// 上周 star 快照 — 由 GitHub Actions 每次刷新时更新 commit
// 用法: import { lastWeekSnapshot } from "@/lib/generated/lastWeek"
// weeklyStars = currentTotalStars - (lastWeekSnapshot.counts[repo] ?? currentTotalStars)

export interface LastWeekSnapshot {
  week: string; // ISO week key, e.g. "2026-W27"
  taken: string; // ISO timestamp
  counts: Record<string, number>; // repo → totalStars at snapshot time
}

// 默认空快照,Actions 第一次跑之前保证计算不报错
export const lastWeekSnapshot: LastWeekSnapshot = {
  week: "",
  taken: "",
  counts: {},
};
