// AUTO-GENERATED from src/main.js by scripts/extract-data.mjs.
// Do not edit by hand — re-run the script after changing main.js.
import type { StarterOption, StarterState } from "./types";

export const starterOptions: Record<string, StarterOption[]> = {
  "time": [
    {
      "id": "quick",
      "label": "今天 2 小时",
      "description": "优先推荐马上能跑起来的轻量项目。"
    },
    {
      "id": "weekend",
      "label": "周末 1-2 天",
      "description": "平衡完成度和惊喜感。"
    },
    {
      "id": "week",
      "label": "一周慢慢做",
      "description": "允许更多集成、部署和打磨。"
    }
  ],
  "goal": [
    {
      "id": "fun",
      "label": "给朋友演示",
      "description": "偏好互动、视觉、游戏和 wow moment。"
    },
    {
      "id": "useful",
      "label": "自己日常用",
      "description": "偏好工作流、资料整理和效率工具。"
    },
    {
      "id": "hardware",
      "label": "动手搓设备",
      "description": "偏好有真实设备反馈的硬件项目。"
    },
    {
      "id": "frontier",
      "label": "追前沿动态",
      "description": "偏好本周增长最快的新鲜 GitHub 项目。"
    }
  ],
  "skill": [
    {
      "id": "beginner",
      "label": "刚开始",
      "description": "更看重友好度、步骤清晰和少踩坑。"
    },
    {
      "id": "builder",
      "label": "会一点",
      "description": "可以接受前端、脚本和 API 集成。"
    },
    {
      "id": "tinkerer",
      "label": "愿意折腾",
      "description": "愿意调环境、接硬件或做复杂流程。"
    }
  ],
  "hardware": [
    {
      "id": "none",
      "label": "不买硬件",
      "description": "只推荐网页、软件和本地工具。"
    },
    {
      "id": "small",
      "label": "几十块可以",
      "description": "可以接受 ESP32、传感器和小屏。"
    },
    {
      "id": "ready",
      "label": "已经有设备",
      "description": "可以推荐树莓派、打印机、智能家居。"
    }
  ]
};

export const starterGroupLabels: Record<string, string> = {
  "time": "时间",
  "goal": "目标",
  "skill": "熟练度",
  "hardware": "硬件"
};

export const starterGroupHints: Record<string, string> = {
  "time": "这次准备投入多久",
  "goal": "做出来主要给谁用",
  "skill": "你愿意折腾到哪一步",
  "hardware": "是否接受买点小东西"
};

export const starterGroupStyles: Record<string, object> = {
  "time": {
    "x": 50,
    "y": 50,
    "width": 100,
    "height": 100,
    "tone": "#225CFF",
    "label": {
      "x": 50,
      "y": 31
    },
    "positions": [
      {
        "x": 27,
        "y": 23
      },
      {
        "x": 52,
        "y": 18
      },
      {
        "x": 76,
        "y": 26
      }
    ]
  },
  "goal": {
    "x": 50,
    "y": 50,
    "width": 100,
    "height": 100,
    "tone": "#18A058",
    "label": {
      "x": 30,
      "y": 55
    },
    "positions": [
      {
        "x": 22,
        "y": 38
      },
      {
        "x": 14,
        "y": 53
      },
      {
        "x": 24,
        "y": 68
      },
      {
        "x": 49,
        "y": 72
      }
    ]
  },
  "skill": {
    "x": 50,
    "y": 50,
    "width": 100,
    "height": 100,
    "tone": "#FF6A3D",
    "label": {
      "x": 70,
      "y": 55
    },
    "positions": [
      {
        "x": 77,
        "y": 38
      },
      {
        "x": 86,
        "y": 53
      },
      {
        "x": 72,
        "y": 67
      }
    ]
  },
  "hardware": {
    "x": 50,
    "y": 50,
    "width": 100,
    "height": 100,
    "tone": "#111827",
    "label": {
      "x": 50,
      "y": 71
    },
    "positions": [
      {
        "x": 29,
        "y": 88
      },
      {
        "x": 54,
        "y": 90
      },
      {
        "x": 77,
        "y": 86
      }
    ]
  }
};

export const starterLabels: Record<string, Record<string, string>> = {
  "time": {
    "quick": "今天 2 小时",
    "weekend": "周末 1-2 天",
    "week": "一周慢慢做"
  },
  "goal": {
    "fun": "给朋友演示",
    "useful": "自己日常用",
    "hardware": "动手搓设备",
    "frontier": "追前沿动态"
  },
  "skill": {
    "beginner": "刚开始",
    "builder": "会一点",
    "tinkerer": "愿意折腾"
  },
  "hardware": {
    "none": "不买硬件",
    "small": "几十块可以",
    "ready": "已经有设备"
  }
};

export const defaultStarterState: StarterState = {
  "time": "weekend",
  "goal": "fun",
  "skill": "beginner",
  "hardware": "none"
};
