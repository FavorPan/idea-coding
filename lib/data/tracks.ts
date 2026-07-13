// 手动维护:四个分类(fun/useful/hardware/stars)的定义。
import type { Track } from "./types";

export const tracks: Track[] = [
  {
    "id": "fun",
    "eyebrow": "Play",
    "eyebrowEn": "Play",
    "title": "最好玩的项目",
    "titleEn": "Most Fun Projects",
    "short": "好玩",
    "shortEn": "Fun",
    "accent": "#007AFF",
    "summary": "即时反馈、强互动、适合用一天做出能给朋友看的版本。",
    "summaryEn": "Instant feedback, highly interactive — perfect for a one-day build you can show friends."
  },
  {
    "id": "useful",
    "eyebrow": "Utility",
    "eyebrowEn": "Utility",
    "title": "最好用的项目",
    "titleEn": "Most Useful Projects",
    "short": "好用",
    "shortEn": "Useful",
    "accent": "#34C759",
    "summary": "做完能进入日常工作流，优先解决信息、文档、财务和个人知识管理。",
    "summaryEn": "Things you'll use every day — prioritizing information, documents, finance, and personal knowledge management."
  },
  {
    "id": "hardware",
    "eyebrow": "Hardware",
    "eyebrowEn": "Hardware",
    "title": "最好搓的项目",
    "titleEn": "Best Hardware Builds",
    "short": "好搓",
    "shortEn": "Hardware",
    "nav": "好搓（硬件）",
    "navEn": "Hardware",
    "accent": "#FF9500",
    "summary": "小预算也能跑通，硬件反馈明确，适合从 ESP32 和 Raspberry Pi 起步。",
    "summaryEn": "Small budget, clear hardware feedback — great for getting started with ESP32 and Raspberry Pi."
  }
];

export const starTrack: Track = {
  "id": "stars",
  "eyebrow": "GitHub",
  "eyebrowEn": "GitHub",
  "title": "增长最快的 GitHub 项目",
  "titleEn": "Fastest-Growing GitHub Projects",
  "short": "明星",
  "shortEn": "Trending",
  "nav": "明星项目",
  "navEn": "Trending",
  "accent": "#AF52DE",
  "summary": "基于 GitHub Trending weekly 候选池，并按本周新增 stars 重新排序，追踪正在冒头的开源项目。",
  "summaryEn": "Ranked by weekly star growth from the GitHub Trending candidate pool — tracking open-source projects that are heating up right now."
};

export const boardTabs: Track[] = [...tracks, starTrack];
