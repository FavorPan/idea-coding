// AI 评估脚本:对候选仓库做 AI 评估,生成 tagline/mvp/评分/Skill 推荐
// 用法: node scripts/ai-evaluate.mjs [--dry-run] [--repo owner/repo]
// 输入: lib/generated/temp-candidates.json (由 discover-topics.mjs 生成)
// 输出: lib/generated/stars.ts + lib/generated/lastSnapshot.ts + lib/generated/metadata.ts

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── Agnes AI Hub config ───────────────────────────────────────────────────────
const AGNES_BASE_URL = "https://apihub.agnes-ai.com/v1";
const AGNES_MODEL = "agnes-2.0-flash";
const AGNES_API_KEY = process.env.AGNES_API_KEY;
if (!AGNES_API_KEY) {
  console.error("❌ AGNES_API_KEY environment variable not set.");
  process.exit(1);
}

// ── Config ───────────────────────────────────────────────────────────────────
const CANDIDATES_FILE = path.join(ROOT, "lib", "generated", "temp-candidates.json");
const OUTPUT_STARS = path.join(ROOT, "lib", "generated", "stars.ts");
const OUTPUT_META = path.join(ROOT, "lib", "generated", "metadata.ts");
const OUTPUT_LAST_SNAPSHOT = path.join(ROOT, "lib", "generated", "lastSnapshot.ts");
const CONCURRENCY = 5; // 并发 AI 评估数
const TOP_N_PER_TRACK = 30; // 每个轨道最多留多少个

// ── GitHub API helpers ────────────────────────────────────────────────────────

async function ghFetch(url, retries = 2) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "idea-coding-data-refresh",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { headers });
      if (res.status === 403) {
        const remaining = res.headers.get("X-RateLimit-Remaining");
        const reset = res.headers.get("X-RateLimit-Reset");
        if (remaining === "0" && reset) {
          const waitMs = Math.max(0, parseInt(reset) * 1000 - Date.now()) + 1000;
          console.warn(`  ⏳ Rate limited, waiting ${Math.ceil(waitMs / 1000)}s...`);
          await new Promise((r) => setTimeout(r, waitMs));
          continue;
        }
      }
      if (!res.ok && i < retries) {
        await new Promise((r) => setTimeout(r, (i + 1) * 1500));
        continue;
      }
      return res;
    } catch (e) {
      if (i === retries) throw e;
      await new Promise((r) => setTimeout(r, (i + 1) * 1500));
    }
  }
  return null;
}

async function fetchReadme(repo) {
  // 常见 README 文件名
  const names = ["README.md", "readme.md", "README.MD", "README"];
  for (const name of names) {
    const url = `https://api.github.com/repos/${repo}/contents/${name}`;
    const res = await ghFetch(url);
    if (!res || !res.ok) continue;
    try {
      const data = await res.json();
      if (data.encoding === "base64") {
        return Buffer.from(data.content, "base64").toString("utf-8");
      }
    } catch (_e) { /* skip */ }
  }
  return null;
}

async function fetchIssues(repo) {
  // 只拉 open issues 的标题,按 updated 排序取前 30 条
  const url = `https://api.github.com/repos/${repo}/issues?state=open&sort=updated&per_page=30`;
  const res = await ghFetch(url);
  if (!res || !res.ok) return [];
  const data = await res.json();
  return (Array.isArray(data) ? data : [])
    .filter((i) => !i.pull_request) // 排除 PR
    .map((i) => i.title);
}

// ── Issue difficulty calibration ─────────────────────────────────────────────
// 统计 issue 标题里有多少"安装/运行失败"类关键词,作为难度上调信号
const DIFFICULTY_KEYWORDS = [
  "install", "setup", "failed", "error", "doesn't work", "doesn't run",
  "can't run", "cannot run", "build fail", "compile", "not working",
  "broken", "crash", "exception", "dependency", "version", "node",
];

function countDifficultyIssues(issueTitles) {
  return issueTitles.filter((title) =>
    DIFFICULTY_KEYWORDS.some((kw) => title.toLowerCase().includes(kw))
  ).length;
}

// ── AI evaluation prompt ──────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a professional project evaluator for an AI coding beginner discovery site. For each GitHub repository, you will evaluate it across four dimensions and provide structured output.

IMPORTANT: Output ONLY valid JSON. No markdown, no explanation, just the JSON object.`;

// Difficulty calibration hint injected per repo based on issue density
function buildEvalPrompt({ repo, readme, issueTitles, starCount, language }) {
  const difficultyIssues = countDifficultyIssues(issueTitles);
  const issueSignal = difficultyIssues >= 5
    ? "⚠️ HIGH DIFFICULTY SIGNAL: This repo has many issues mentioning install/setup/build failures. Be more conservative with the 'easy' score."
    : difficultyIssues >= 2
    ? "Some install/setup issues found — consider difficulty carefully."
    : "Few or no install-related issues.";

  const readmePreview = readme
    ? readme.slice(0, 4000) // 截断避免 token 过多
    : "(No README found)";

  return {
    role: "user",
    content: `Evaluate this GitHub repository for AI coding beginners.

Repo: ${repo}
Language: ${language ?? "unknown"}
Stars: ${starCount}
Issue signal: ${issueSignal}

README preview:
${readmePreview}

${issueTitles.length > 0 ? `Recent open issue titles (for difficulty calibration):\n${issueTitles.slice(0, 20).map((t) => `- ${t}`).join("\n")}` : ""}

Evaluate and return JSON with exactly this shape:
{
  "tagline": "One compelling Chinese sentence (≤30 chars) describing what makes this project fun/useful to try",
  "taglineEn": "English tagline (≤30 chars, same meaning as tagline)",
  "mvp": "A specific, concrete MVP description in Chinese: what to build first and what result to show. Start with '先做...'. 20-40 chars.",
  "mvpEn": "English MVP description. Start with 'First build'. 20-40 chars, same meaning as mvp.",
  "wow": integer 0-100, how impressive/memorable the demo result is,
  "useful": integer 0-100, how practical this is for daily use or real work,
  "easy": integer 0-100, how accessible this is for AI coding beginners (higher = easier, 100 = "just describe it to AI and it works"),
  "skills": ["skill-id-1", "skill-id-2"] // up to 3 skill IDs from: github-cli, agent-skills, skillspector, opencli, playwright-skill, vercel-deploy, frontend-design, shadcn-skill, figma-skills, canva-skills, guizang-ppt, document-skills, supabase-skills, huggingface-skills, sentry-skills, lark-cli, openai-skills, openai-docs
}

IMPORTANT: tagline and taglineEn must have the same meaning (Chinese vs English). mvp and mvpEn must have the same meaning (Chinese vs English).
`,
  };
}

async function callAgnes(messages) {
  const res = await fetch(`${AGNES_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AGNES_API_KEY}`,
    },
    body: JSON.stringify({
      model: AGNES_MODEL,
      messages,
      temperature: 0.3,
      max_tokens: 800,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Agnes API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content from Agnes API");

  // 尝试解析 JSON,去掉可能的 markdown 代码块包装
  const jsonStr = content.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(jsonStr);
}

// ── Main evaluation logic ─────────────────────────────────────────────────────

async function evaluateCandidate(candidate) {
  const { fullName: repo, stargazersCount, language, description } = candidate;

  try {
    // 并发拉 README 和 issues
    const [readme, issueTitles] = await Promise.all([
      fetchReadme(repo),
      fetchIssues(repo),
    ]);

    const prompt = buildEvalPrompt({
      repo,
      readme,
      issueTitles,
      starCount: stargazersCount,
      language,
    });

    const result = await callAgnes([{ role: "system", content: SYSTEM_PROMPT }, prompt]);

    // 验证输出字段
    const wow = Math.min(100, Math.max(0, parseInt(result.wow) || 50));
    const useful = Math.min(100, Math.max(0, parseInt(result.useful) || 50));
    const easy = Math.min(100, Math.max(0, parseInt(result.easy) || 50));
    const tagline = (result.tagline || description || "").slice(0, 80);
    const mvp = (result.mvp || "先做一个可运行的最小 demo。").slice(0, 80);
    const taglineEn = (result.taglineEn || tagline).slice(0, 80);
    const mvpEn = (result.mvpEn || mvp).slice(0, 80);
    const skills = Array.isArray(result.skills) ? result.skills.slice(0, 3) : [];

    return {
      repo,
      name: repo.split("/")[1],
      tagline,
      taglineEn,
      language: language || null,
      totalStars: stargazersCount,
      deltaStars: 0, // Actions 会更新 lastSnapshot.ts 后算出来
      trendingRank: 0, // 排序后填
      mvp,
      mvpEn,
      wow,
      useful,
      easy,
      url: `https://github.com/${repo}`,
      skills,
    };
  } catch (err) {
    console.error(`  ❌ Failed to evaluate ${repo}: ${err.message}`);
    return null;
  }
}

// ── Concurrent evaluation with progress ──────────────────────────────────────

async function runWithConcurrency(tasks, limit) {
  const results = [];
  const executing = new Set();

  for (const task of tasks) {
    const p = task().catch((e) => e);
    executing.add(p);
    results.push(p);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

// ── Output writers ────────────────────────────────────────────────────────────

function writeStarsTs(stars) {
  const header = `// AUTO-GENERATED by scripts/ai-evaluate.mjs — DO NOT EDIT BY HAND
// This file is updated daily by GitHub Actions Cron.
import type { StarProject } from "@/lib/data/types";`;
  const body = `export const generatedStars: StarProject[] = ${JSON.stringify(stars, null, 2)};`;
  fs.writeFileSync(OUTPUT_STARS, `${header}\n\n${body}\n`, "utf-8");
}

function writeLastSnapshotTs(stars) {
  const counts = {};
  for (const s of stars) {
    counts[s.repo] = s.totalStars;
  }
  const now = new Date();
  const week = `${now.getUTCFullYear()}-W${String(Math.ceil((now.getUTCDay() + 1 + now.getUTCDate()) / 7)).padStart(2, "0")}`;
  const snapshot = {
    week,
    taken: now.toISOString(),
    counts,
  };
  const header = `// AUTO-GENERATED by scripts/ai-evaluate.mjs — DO NOT EDIT BY HAND`;
  const body = `import type { LastSnapshot } from "@/lib/generated/lastSnapshot";
export const lastSnapshot: LastSnapshot = ${JSON.stringify(snapshot, null, 2)};`;
  fs.writeFileSync(OUTPUT_LAST_SNAPSHOT, `${header}\n\n${body}\n`, "utf-8");
}

function writeMetaTs(meta) {
  const header = `// AUTO-GENERATED by scripts/ai-evaluate.mjs — DO NOT EDIT BY HAND
import type { GeneratedMeta } from "@/lib/generated/metadata";`;
  const body = `export const generatedMeta: GeneratedMeta = ${JSON.stringify(meta, null, 2)};`;
  fs.writeFileSync(OUTPUT_META, `${header}\n\n${body}\n`, "utf-8");
}

// ── Ranking ───────────────────────────────────────────────────────────────────
// 综合分 = 归一化 star(30%) + 归一化 wow(25%) + 归一化 useful(25%) + 归一化 easy(20%)
function rankProjects(stars) {
  // 按轨道分组,每组分别排名
  const byTrack = {};
  for (const s of stars) {
    if (!byTrack[s.track]) byTrack[s.track] = [];
    byTrack[s.track].push(s);
  }

  const ranked = [];
  for (const [track, items] of Object.entries(byTrack)) {
    // 归一化辅助函数
    const max = (arr, key) => Math.max(...arr.map((x) => x[key]));
    const min = (arr, key) => Math.min(...arr.map((x) => x[key]));
    const norm = (arr, key) => {
      const hi = max(arr, key), lo = min(arr, key);
      return (v) => (hi === lo ? 0.5 : (v - lo) / (hi - lo));
    };

    const nStars = norm(items, "totalStars");
    const nWow = norm(items, "wow");
    const nUseful = norm(items, "useful");
    const nEasy = norm(items, "easy");

    items.forEach((s) => {
      s.score = 0.3 * nStars(s.totalStars) + 0.25 * nWow(s.wow) + 0.25 * nUseful(s.useful) + 0.2 * nEasy(s.easy);
      s.track = track;
    });

    // 每条轨道取 Top-N
    const top = items
      .sort((a, b) => b.score - a.score)
      .slice(0, TOP_N_PER_TRACK);
    ranked.push(...top);
  }

  // 重新按 trendingRank 排序
  ranked.sort((a, b) => b.deltaStars - a.deltaStars || b.totalStars - a.totalStars);
  ranked.forEach((p, i) => { p.trendingRank = i + 1; });

  return ranked;
}

// ── CLI: single repo mode ─────────────────────────────────────────────────────

async function evaluateSingleRepo(repo) {
  console.log(`\n🔍 Evaluating single repo: ${repo}`);
  const readme = await fetchReadme(repo);
  const issueTitles = await fetchIssues(repo);
  const result = await callAgnes([
    { role: "system", content: SYSTEM_PROMPT },
    buildEvalPrompt({ repo, readme, issueTitles, starCount: 0, language: null }),
  ]);
  console.log("\n📋 Evaluation result:");
  console.log(JSON.stringify(result, null, 2));
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  // 单项目模式: node scripts/ai-evaluate.mjs --repo owner/repo
  if (args.includes("--repo")) {
    const idx = args.indexOf("--repo");
    const repo = args[idx + 1];
    if (!repo) { console.error("Usage: --repo owner/repo"); process.exit(1); }
    await evaluateSingleRepo(repo);
    return;
  }

  // 正式模式:读取候选列表
  if (!fs.existsSync(CANDIDATES_FILE)) {
    console.error(`❌ Candidates file not found: ${CANDIDATES_FILE}`);
    console.error("   Run 'node scripts/discover-topics.mjs' first.");
    process.exit(1);
  }

  const candidates = JSON.parse(fs.readFileSync(CANDIDATES_FILE, "utf-8"));
  console.log(`🔍 Idea Coding — AI Evaluation`);
  console.log(`📋 ${candidates.length} candidates to evaluate`);
  console.log(`⚡ Concurrency: ${CONCURRENCY}`);

  const start = Date.now();
  let completed = 0;
  const total = candidates.length;

  // 分批并发评估
  const results = [];
  for (let i = 0; i < candidates.length; i += CONCURRENCY) {
    const batch = candidates.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map((c) => evaluateCandidate(c)));
    results.push(...batchResults);
    completed += batch.length;
    const pct = Math.round((completed / total) * 100);
    process.stdout.write(`\r  Progress: ${completed}/${total} (${pct}%)`);
  }
  console.log();

  const evaluated = results.filter(Boolean);
  const failed = results.length - evaluated.length;
  console.log(`\n✅ Evaluated: ${evaluated.length}, ❌ Failed: ${failed}`);

  if (evaluated.length === 0) {
    console.error("❌ No candidates evaluated successfully. Exiting.");
    process.exit(1);
  }

  // 排名并截取 Top-N
  const ranked = rankProjects(evaluated);
  console.log(`📊 Ranked ${ranked.length} projects across ${Object.keys(
    ranked.reduce((acc, p) => { acc[p.track] = 1; return acc; }, {})
  ).length} tracks`);

  // 写输出文件
  writeStarsTs(ranked);
  writeLastSnapshotTs(ranked);
  writeMetaTs({
    refreshedAt: new Date().toISOString(),
    topics: [...new Set(candidates.map((c) => c.topic))],
    totalCandidates: candidates.length,
    passedFilters: evaluated.length,
    topNPerTrack: TOP_N_PER_TRACK,
  });

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✅ Done in ${elapsed}s`);
  console.log(`   📄 Written: lib/generated/stars.ts (${ranked.length} projects)`);
  console.log(`   📄 Written: lib/generated/lastSnapshot.ts (snapshot)`);
  console.log(`   📄 Written: lib/generated/metadata.ts`);
  console.log(`\n📋 Top 3:`);
  ranked.slice(0, 3).forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.repo} [${p.track}] wow=${p.wow} easy=${p.easy}`);
    console.log(`      ${p.tagline}`);
    console.log(`      ${p.mvp}`);
  });
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err.message);
  process.exit(1);
});
