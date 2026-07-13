// 手动维护:starter-advisor 选项,人手编辑。
import type { StarterOption, StarterState } from "./types";

export const starterOptions: Record<string, StarterOption[]> = {
  "time": [
    {
      "id": "quick",
      "label": "今天 2 小时",
      "labelEn": "2 hours today",
      "description": "优先推荐马上能跑起来的轻量项目。",
      "descriptionEn": "Prioritizes lightweight projects you can get running right away."
    },
    {
      "id": "weekend",
      "label": "周末 1-2 天",
      "labelEn": "1–2 days on a weekend",
      "description": "平衡完成度和惊喜感。",
      "descriptionEn": "Balances completeness with a sense of delight."
    },
    {
      "id": "week",
      "label": "一周慢慢做",
      "labelEn": "A week, taking it slow",
      "description": "允许更多集成、部署和打磨。",
      "descriptionEn": "Room for more integrations, deployment, and polish."
    }
  ],
  "goal": [
    {
      "id": "fun",
      "label": "给朋友演示",
      "labelEn": "Show off to friends",
      "description": "偏好互动、视觉、游戏和 wow moment。",
      "descriptionEn": "Prefers interactive, visual, game-like projects with a wow moment."
    },
    {
      "id": "useful",
      "label": "自己日常用",
      "labelEn": "Use it every day",
      "description": "偏好工作流、资料整理和效率工具。",
      "descriptionEn": "Prefers workflows, document organizers, and productivity tools."
    },
    {
      "id": "hardware",
      "label": "动手搓设备",
      "labelEn": "Build a physical device",
      "description": "偏好有真实设备反馈的硬件项目。",
      "descriptionEn": "Prefers hardware projects with real device feedback."
    },
    {
      "id": "frontier",
      "label": "追前沿动态",
      "labelEn": "Follow the frontier",
      "description": "偏好本周增长最快的新鲜 GitHub 项目。",
      "descriptionEn": "Prefers fresh GitHub projects with the fastest growth this week."
    }
  ],
  "skill": [
    {
      "id": "beginner",
      "label": "刚开始",
      "labelEn": "Just starting out",
      "description": "更看重友好度、步骤清晰和少踩坑。",
      "descriptionEn": "Prioritizes friendliness, clear steps, and fewer pitfalls."
    },
    {
      "id": "builder",
      "label": "会一点",
      "labelEn": "Know the basics",
      "description": "可以接受前端、脚本和 API 集成。",
      "descriptionEn": "Comfortable with frontend, scripts, and API integrations."
    },
    {
      "id": "tinkerer",
      "label": "愿意折腾",
      "labelEn": "Ready to tinker",
      "description": "愿意调环境、接硬件或做复杂流程。",
      "descriptionEn": "Willing to configure environments, wire up hardware, or tackle complex flows."
    }
  ],
  "hardware": [
    {
      "id": "none",
      "label": "不买硬件",
      "labelEn": "No hardware",
      "description": "只推荐网页、软件和本地工具。",
      "descriptionEn": "Only recommends web, software, and local tools."
    },
    {
      "id": "small",
      "label": "几十块可以",
      "labelEn": "Small budget is fine",
      "description": "可以接受 ESP32、传感器和小屏。",
      "descriptionEn": "Open to ESP32, sensors, and small displays."
    },
    {
      "id": "ready",
      "label": "已经有设备",
      "labelEn": "Already have devices",
      "description": "可以推荐树莓派、打印机、智能家居。",
      "descriptionEn": "Can recommend Raspberry Pi, 3D printers, and smart-home setups."
    }
  ]
};

export const starterGroupLabels: Record<string, string> = {
  "time": "时间",
  "goal": "目标",
  "skill": "熟练度",
  "hardware": "硬件"
};

export const starterGroupLabelsEn: Record<string, string> = {
  "time": "Time",
  "goal": "Goal",
  "skill": "Skill level",
  "hardware": "Hardware"
};

export const starterGroupHints: Record<string, string> = {
  "time": "这次准备投入多久",
  "goal": "做出来主要给谁用",
  "skill": "你愿意折腾到哪一步",
  "hardware": "是否接受买点小东西"
};

export const starterGroupHintsEn: Record<string, string> = {
  "time": "How much time do you have?",
  "goal": "Who is this for?",
  "skill": "How far are you willing to tinker?",
  "hardware": "Are you open to buying small things?"
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

export const starterLabelsEn: Record<string, Record<string, string>> = {
  "time": {
    "quick": "2 hours today",
    "weekend": "1–2 days on a weekend",
    "week": "A week, taking it slow"
  },
  "goal": {
    "fun": "Show off to friends",
    "useful": "Use it every day",
    "hardware": "Build a physical device",
    "frontier": "Follow the frontier"
  },
  "skill": {
    "beginner": "Just starting out",
    "builder": "Know the basics",
    "tinkerer": "Ready to tinker"
  },
  "hardware": {
    "none": "No hardware",
    "small": "Small budget is fine",
    "ready": "Already have devices"
  }
};

export const defaultStarterState: StarterState = {
  "time": "weekend",
  "goal": "fun",
  "skill": "beginner",
  "hardware": "none"
};
