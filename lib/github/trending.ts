// GitHub Trending data layer.
//
// Strategy (see plan 决断 B): maintain a candidate repo pool, fetch live
// stargazers_count for each via the GitHub REST API, compute weekly delta
// against a stored previous-week snapshot, rank by delta. Falls back to the
// hand-curated starFallback when the API fails or no token is configured.
//
// The snapshot store is abstracted behind KVAdapter so we can mock it locally
// and swap in Cloudflare KV at deploy time without touching the fetch logic.

import type { StarProject } from "@/lib/data/types";
import { starFallback } from "@/lib/data/stars";
import { toStarBoardProject, type StarBoardProject } from "@/lib/logic/projects";

// The candidate pool: repos worth tracking. Seed from the fallback list;
// callers can extend this. Keep it modest to stay within GitHub rate limits.
const candidateRepos: string[] = starFallback.map((p) => p.repo);

export interface TrendingSnapshot {
  fetchedAt: string; // ISO timestamp
  starProjects: StarProject[];
}

export interface TrendingResult {
  fetchedAt: string;
  projects: StarBoardProject[];
  source: "live" | "fallback";
}

// Minimal KV interface — matches enough of Cloudflare KV to swap in directly.
// get(key) → string | null (Promise); put(key, value) → void (Promise).
export interface KVAdapter {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

// ISO week key, e.g. "2026-W27". Used to namespace weekly snapshots so we can
// read last week's counts and write this week's without collision.
function weekKey(date = new Date()): string {
  // ISO 8601 week: Thursday-based, per RFC 3339 / Date.prototype manipulation.
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = (d.getUTCDay() + 6) % 7; // Mon=0..Sun=6
  d.setUTCDate(d.getUTCDate() - day + 3); // nearest Thursday
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week =
    1 + Math.round(((d.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

interface RepoStats {
  repo: string;
  stargazers_count: number;
  language: string | null;
  description: string | null;
}

async function fetchRepoStats(
  repo: string,
  token?: string,
): Promise<RepoStats | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "idea-coding",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      stargazers_count: number;
      language: string | null;
      description: string | null;
    };
    return {
      repo,
      stargazers_count: data.stargazers_count,
      language: data.language,
      description: data.description,
    };
  } catch {
    return null;
  }
}

// Snapshot stored in KV: repo → star count at the start of this week.
interface WeekSnapshot {
  week: string;
  taken: string;
  counts: Record<string, number>;
}

const SNAPSHOT_KEY = "trending:snapshot";

async function readSnapshot(kv: KVAdapter): Promise<WeekSnapshot | null> {
  const raw = await kv.get(SNAPSHOT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WeekSnapshot;
  } catch {
    return null;
  }
}

async function writeSnapshot(kv: KVAdapter, snap: WeekSnapshot): Promise<void> {
  await kv.put(SNAPSHOT_KEY, JSON.stringify(snap));
}

// Merge live stats with the curated fallback: the fallback carries the
// human-written tagline/mvp/wow/useful/easy, the live stats carry fresh
// star counts. We compute weeklyStars as (current - lastWeekSnapshot), and
// trendingRank as the delta descending order.
function composeProjects(
  stats: RepoStats[],
  prev: WeekSnapshot | null,
): StarProject[] {
  // Index the fallback by repo so we keep the curated copywriting.
  const byRepo = new Map(starFallback.map((p) => [p.repo, p]));

  const withDelta = stats
    .filter((s) => byRepo.has(s.repo))
    .map((s) => {
      const base = byRepo.get(s.repo)!;
      const last = prev?.counts[s.repo];
      const weekly = last ? Math.max(0, s.stargazers_count - last) : base.weeklyStars;
      return {
        ...base,
        totalStars: s.stargazers_count,
        weeklyStars: weekly,
        tagline: s.description || base.tagline,
        language: s.language || base.language,
      } as StarProject;
    });

  // Rank by weekly delta (desc). Tiebreak by total stars.
  withDelta.sort((a, b) => b.weeklyStars - a.weeklyStars || b.totalStars - a.totalStars);
  withDelta.forEach((p, i) => {
    p.trendingRank = i + 1;
  });
  return withDelta;
}

export async function fetchTrending(
  kv: KVAdapter,
  token?: string,
): Promise<TrendingResult> {
  // No token → can't reliably hit GitHub from a shared egress IP. Fall back.
  if (!token) {
    return fallbackResult();
  }

  const stats = await Promise.all(candidateRepos.map((r) => fetchRepoStats(r, token)));
  const ok = stats.filter((s): s is RepoStats => s !== null);

  // If we got nothing useful, fall back.
  if (ok.length === 0) {
    return fallbackResult();
  }

  const prev = await readSnapshot(kv);
  const projects = composeProjects(ok, prev);
  const fetchedAt = new Date().toISOString();

  // Roll the snapshot at week boundaries: write current counts as this week's
  // snapshot so next week's fetch can diff against it.
  const thisWeek = weekKey(new Date(fetchedAt));
  if (!prev || prev.week !== thisWeek) {
    const counts: Record<string, number> = {};
    ok.forEach((s) => { counts[s.repo] = s.stargazers_count; });
    await writeSnapshot(kv, { week: thisWeek, taken: fetchedAt, counts });
  }

  return {
    fetchedAt,
    projects: projects.map((p, i) => toStarBoardProject(p, i)),
    source: "live",
  };
}

function fallbackResult(): TrendingResult {
  const projects = starFallback.map((p, i) => toStarBoardProject(p, i));
  return {
    // Use the fallback's known-updated timestamp; the page shows this as the
    // "updated" time when live data isn't available.
    fetchedAt: "2026-06-29T18:52:00+08:00",
    projects,
    source: "fallback",
  };
}

// In-memory KV for local dev and tests. NOT for production — values don't
// persist across requests in serverless. Swap for Cloudflare KV at deploy.
export class MemoryKV implements KVAdapter {
  private store = new Map<string, string>();
  async get(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  async put(key: string, value: string) {
    this.store.set(key, value);
  }
}

// Cloudflare KV adapter — used at deploy time. The binding `TRENDING_KV` is
// declared in wrangler.toml and surfaced as env.TRENDING_KV in the Worker.
// In Next.js on Cloudflare (OpenNext), `process.env.TRENDING_KV` resolves to
// the bound KV namespace object.
export class CloudflareKV implements KVAdapter {
  private kv: { get(key: string): Promise<string | null>; put(key: string, value: string): Promise<void> };
  constructor(kv: { get(key: string): Promise<string | null>; put(key: string, value: string): Promise<void> }) {
    this.kv = kv;
  }
  async get(key: string) {
    return this.kv.get(key);
  }
  async put(key: string, value: string) {
    await this.kv.put(key, value);
  }
}

// Pick the right KV based on environment. On Cloudflare, process.env.TRENDING_KV
// is the bound namespace object; locally it's undefined and we fall back to MemoryKV.
export function pickKV(): KVAdapter {
  const binding = (process.env as { TRENDING_KV?: KVAdapter }).TRENDING_KV;
  if (binding && typeof binding.get === "function") {
    return new CloudflareKV(binding);
  }
  return new MemoryKV();
}
