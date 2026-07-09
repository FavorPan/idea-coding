// 上次刷新的 star 快照 — 由 GitHub Actions 每次刷新时更新 commit
// 用法: import { lastSnapshot } from "@/lib/generated/lastSnapshot"
// deltaStars = currentTotalStars - (lastSnapshot.counts[repo] ?? currentTotalStars)

export interface LastSnapshot {
  week: string; // ISO week 标签（仅用于记录，不参与对齐）
  taken: string; // ISO timestamp
  counts: Record<string, number>; // repo → totalStars at snapshot time
}

// 默认空快照,Actions 第一次跑之前保证计算不报错
export const lastSnapshot: LastSnapshot = {
  week: "",
  taken: "",
  counts: {},
};
