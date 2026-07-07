// AUTO-GENERATED from src/main.js by scripts/extract-data.mjs.
// Do not edit by hand — re-run the script after changing main.js.
import type { BoardTheme, TrackId } from "./types";

export const boardThemes: Record<string, BoardTheme> = {
  "all": {
    "primary": "#0071E3",
    "soft": "#F5F5F7",
    "shadow": "rgba(0, 113, 227, 0.15)"
  },
  "fun": {
    "primary": "#007AFF",
    "soft": "rgba(0, 122, 255, 0.08)",
    "shadow": "rgba(0, 122, 255, 0.2)"
  },
  "useful": {
    "primary": "#34C759",
    "soft": "rgba(52, 199, 89, 0.08)",
    "shadow": "rgba(52, 199, 89, 0.2)"
  },
  "hardware": {
    "primary": "#FF9500",
    "soft": "rgba(255, 149, 0, 0.08)",
    "shadow": "rgba(255, 149, 0, 0.2)"
  },
  "stars": {
    "primary": "#AF52DE",
    "soft": "rgba(175, 82, 222, 0.08)",
    "shadow": "rgba(175, 82, 222, 0.2)"
  }
};

export const focusHeaderNotes: Record<TrackId, string[]> = {
  "fun": [
    "互动反馈优先",
    "一天内可演示",
    "适合做给朋友看"
  ],
  "useful": [
    "日常工作流优先",
    "做完马上能用",
    "适合长期迭代"
  ],
  "hardware": [
    "真实设备反馈",
    "桌面可见成果",
    "适合边买边做"
  ],
  "stars": [
    "本周增长优先",
    "GitHub Trending 候选",
    "适合追前沿动态"
  ]
};

export const focusPalettes: Record<TrackId, string[]> = {
  "fun": [
    "#007AFF",
    "#5856D6",
    "#32ADE6"
  ],
  "useful": [
    "#34C759",
    "#30D158",
    "#63E6BE"
  ],
  "hardware": [
    "#FF9500",
    "#FF9F0A",
    "#FFD60A"
  ],
  "stars": [
    "#AF52DE",
    "#BF5AF2",
    "#FF2D55"
  ]
};
