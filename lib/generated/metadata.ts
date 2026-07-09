// 自动生成数据 — 本目录由 GitHub Actions Cron 每天更新
// 不要手动编辑,所有改动由 scripts/discover-topics.mjs 和 scripts/ai-evaluate.mjs 自动写入

export interface GeneratedMeta {
  refreshedAt: string;
  topics: string[];
  totalCandidates: number;
  passedFilters: number;
}

// 默认占位数据,Actions 第一次跑之前保证页面能渲染
export const generatedMeta: GeneratedMeta = {
  refreshedAt: "2026-07-09T00:00:00Z",
  topics: [],
  totalCandidates: 0,
  passedFilters: 0,
};
