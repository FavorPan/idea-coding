// AUTO-GENERATED from src/main.js by scripts/extract-data.mjs.
// Do not edit by hand — re-run the script after changing main.js.
import type { Track } from "./types";

export const tracks: Track[] = [
  {
    "id": "fun",
    "eyebrow": "Play",
    "title": "最好玩的项目",
    "short": "好玩",
    "accent": "#007AFF",
    "summary": "即时反馈、强互动、适合用一天做出能给朋友看的版本。"
  },
  {
    "id": "useful",
    "eyebrow": "Utility",
    "title": "最好用的项目",
    "short": "好用",
    "accent": "#34C759",
    "summary": "做完能进入日常工作流，优先解决信息、文档、财务和个人知识管理。"
  },
  {
    "id": "hardware",
    "eyebrow": "Hardware",
    "title": "最好搓的项目",
    "short": "好搓",
    "nav": "好搓（硬件）",
    "accent": "#FF9500",
    "summary": "小预算也能跑通，硬件反馈明确，适合从 ESP32 和 Raspberry Pi 起步。"
  }
];

export const starTrack: Track = {
  "id": "stars",
  "eyebrow": "GitHub",
  "title": "增长最快的 GitHub 项目",
  "short": "明星",
  "nav": "明星项目",
  "accent": "#AF52DE",
  "summary": "基于 GitHub Trending weekly 候选池，并按本周新增 stars 重新排序，追踪正在冒头的开源项目。"
};

export const boardTabs: Track[] = [...tracks, starTrack];
