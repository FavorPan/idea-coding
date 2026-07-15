// Starter advisor logic — pure functions that take starter state + the
// recommendation pool (curated projects + live star projects) as input,
// so the caller controls data sourcing and we avoid module cycles.
import type { StarterState } from "@/lib/data/types";
import { starterLabels, starterLabelsEn } from "@/lib/data/starter";
import { trackById, type BoardProject } from "./projects";
import { formatCount } from "./format";
import { defaultLocale, type Locale } from "@/i18n/config";

export function starterScore(
  project: BoardProject,
  state: StarterState,
): number {
  let score = project.easy * 1.05 + project.wow * 0.45 + project.useful * 0.45;

  if (state.time === "quick") score += project.easy * 0.85;
  if (state.time === "weekend") score += (project.easy + project.wow) * 0.35;
  if (state.time === "week") score += project.useful * 0.55 + project.wow * 0.25;

  if (state.goal === "fun") score += project.wow * 1.05 + (project.track === "fun" ? 40 : 0);
  if (state.goal === "useful") {
    score += project.useful * 1.05 + (project.track === "useful" ? 42 : 0);
  }
  if (state.goal === "hardware") {
    score += project.track === "hardware" ? 90 : -35;
  }
  if (state.goal === "frontier") {
    score += project.track === "stars" ? 96 : 0;
    const delta = project.deltaStars;
    score += delta ? Math.min(46, delta / 420) : 0;
  }

  if (state.skill === "beginner") score += project.easy * 0.75;
  if (state.skill === "builder") score += project.useful * 0.35 + project.wow * 0.25;
  if (state.skill === "tinkerer") score += project.wow * 0.45 + (project.track === "hardware" ? 26 : 0);

  if (state.hardware === "none" && project.track === "hardware") score -= 140;
  if (state.hardware === "small" && project.track === "hardware") score += 28;
  if (state.hardware === "ready" && project.track === "hardware") score += 62;
  if (state.hardware !== "none" && state.goal !== "hardware" && project.track === "hardware") {
    score += 12;
  }

  score += Math.max(0, 31 - project.rank) * 0.35;
  return score;
}

export function starterRecommendations(
  state: StarterState,
  pool: BoardProject[],
) {
  const scored = pool
    .map((project) => ({ project, score: starterScore(project, state) }))
    .sort((a, b) => b.score - a.score || a.project.rank - b.project.rank);

  const picked: { project: BoardProject; score: number }[] = [];
  const trackCounts: Record<string, number> = {};
  for (const item of scored) {
    const track = item.project.track;
    if ((trackCounts[track] ?? 0) >= 2) continue;
    picked.push(item);
    trackCounts[track] = (trackCounts[track] ?? 0) + 1;
    if (picked.length === 3) break;
  }
  return picked;
}

export function starterReason(
  project: BoardProject,
  state: StarterState,
  locale: Locale = defaultLocale,
): string {
  const en = locale === "en";
  const track = trackById(project.track);
  const labels = en ? starterLabelsEn : starterLabels;
  const timeText = labels.time[state.time];
  const goalText = labels.goal[state.goal];
  const trackShort = track?.short ?? "";
  if (project.track === "stars") {
    const delta = project.deltaStars ?? 0;
    return en
      ? `Suited to beginners who want to "${goalText}": recent growth +${formatCount(delta)} stars. Replicate a minimal use case first to feel the frontier.`
      : `适合想“${goalText}”的新手：近期增长 +${formatCount(delta)} stars，先复刻一个最小使用场景就能摸到前沿脉搏。`;
  }
  if (project.track === "hardware") {
    return en
      ? `Suited for "${timeText}" hands-on: feedback comes from real devices; build a visible, testable small result per the MVP.`
      : `适合“${timeText}”动手：反馈来自真实设备，按 MVP 做出一个可见/可测的小结果。`;
  }
  return en
    ? `Suited to start in "${timeText}": the ${trackShort} direction matches "${goalText}"; turn the MVP into a demoable version first.`
    : `适合“${timeText}”开工：${track?.short}方向匹配“${goalText}”，先把 MVP 做成可演示版本。`;
}
