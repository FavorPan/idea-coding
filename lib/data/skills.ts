// 手动维护:Skill 目录,人手编辑。
import type { Skill, SkillId } from "./types";

export const skillCatalog: Record<SkillId, Skill> = {
  "openai-skills": {
    "name": "OpenAI Skills Catalog",
    "nameEn": "OpenAI Skills Catalog",
    "signal": "Codex 官方目录",
    "url": "https://github.com/openai/skills",
    "description": "先从官方目录理解 Skill 怎么安装、触发和复用，适合作为所有项目的起点。",
    "descriptionEn": "Start from the official catalog to understand how to install, trigger, and reuse Skills — a great starting point for any project."
  },
  "openai-docs": {
    "name": "OpenAI Cookbook",
    "nameEn": "OpenAI Cookbook",
    "signal": "模型/API 示例",
    "url": "https://github.com/openai/openai-cookbook",
    "description": "用于参考模型选择、API 调用、流式输出、工具调用和结构化输出等示例。",
    "descriptionEn": "A reference for model selection, API calls, streaming, tool use, and structured output examples."
  },
  "agent-skills": {
    "name": "Addy Osmani Agent Skills",
    "nameEn": "Addy Osmani Agent Skills",
    "signal": "工程 Skill · 68.4k stars",
    "url": "https://github.com/addyosmani/agent-skills",
    "description": "生产级 AI coding agent 工程 Skill，适合让 Codex 更稳定地读项目、改代码、跑验收。",
    "descriptionEn": "Production-grade AI coding agent engineering Skills that help Codex read projects, edit code, and run acceptance checks more reliably."
  },
  "skillspector": {
    "name": "NVIDIA SkillSpector",
    "nameEn": "NVIDIA SkillSpector",
    "signal": "安全扫描 · +1,387/7d",
    "url": "https://github.com/NVIDIA/SkillSpector",
    "description": "安装第三方 Skill 前先扫描危险命令、可疑网络请求和高风险权限。",
    "descriptionEn": "Scan third-party Skills for dangerous commands, suspicious network requests, and high-risk permissions before installing them."
  },
  "frontend-design": {
    "name": "Vercel Web Guidelines",
    "nameEn": "Vercel Web Guidelines",
    "signal": "UI 验收规则",
    "url": "https://github.com/vercel-labs/web-interface-guidelines",
    "description": "用公开的 Web 界面准则检查布局、焦点态、移动端和可访问性。",
    "descriptionEn": "Use public web interface guidelines to check layout, focus states, mobile responsiveness, and accessibility."
  },
  "playwright-skill": {
    "name": "Playwright Skill",
    "nameEn": "Playwright Skill",
    "signal": "真浏览器验收",
    "url": "https://github.com/lackeyjb/playwright-skill",
    "description": "让 AI 打开页面测试按钮、表单、响应式和关键流程，避免 demo 只在想象里可用。",
    "descriptionEn": "Let AI open pages to test buttons, forms, responsive layouts, and key flows — so your demo actually works in a real browser, not just in theory."
  },
  "vercel-deploy": {
    "name": "Vercel Deploy Skills",
    "nameEn": "Vercel Deploy Skills",
    "signal": "公开链接",
    "url": "https://github.com/vercel-labs/agent-skills",
    "description": "做完网页后生成预览、部署公开链接，并检查上线前的基础问题。",
    "descriptionEn": "After building a web app, generate preview deployments, publish public links, and check for common pre-launch issues."
  },
  "shadcn-skill": {
    "name": "shadcn/ui Skill",
    "nameEn": "shadcn/ui Skill",
    "signal": "常用组件 · 117.8k stars",
    "url": "https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/SKILL.md",
    "description": "快速把按钮、表单、弹窗、表格等 Web App 常用组件接进项目。",
    "descriptionEn": "Quickly add common web app components like buttons, forms, dialogs, and tables to your project."
  },
  "figma-skills": {
    "name": "Figma Skills",
    "nameEn": "Figma Skills",
    "signal": "设计协作",
    "url": "https://claude.com/skills",
    "description": "把界面、组件库和设计稿整理成 AI 能继续执行的设计上下文。",
    "descriptionEn": "Turn interfaces, component libraries, and design files into design context that AI can act on."
  },
  "canva-skills": {
    "name": "Canva Skills",
    "nameEn": "Canva Skills",
    "signal": "素材出图",
    "url": "https://claude.com/skills",
    "description": "适合做封面、海报、社媒图和视觉素材，不必先学复杂设计软件。",
    "descriptionEn": "Great for making covers, posters, social media graphics, and visual assets without learning complex design software."
  },
  "guizang-ppt": {
    "name": "归藏 PPT Skill",
    "nameEn": "Guizang PPT Skill",
    "signal": "中文爆款视觉 · +887/7d",
    "url": "https://github.com/op7418/guizang-ppt-skill",
    "description": "适合把项目做成发布会式网页 PPT、长图或可分享的视觉说明。",
    "descriptionEn": "Turn your project into launch-style web slides, infographics, or shareable visual explainers."
  },
  "document-skills": {
    "name": "Document Skills",
    "nameEn": "Document Skills",
    "signal": "文档表格",
    "url": "https://github.com/anthropics/skills",
    "description": "处理 Word、Excel、PPT、PDF 和资料整理类项目时最容易马上见效。",
    "descriptionEn": "The fastest to show results when working on Word, Excel, PPT, PDF, or document-organization projects."
  },
  "opencli": {
    "name": "OpenCLI",
    "nameEn": "OpenCLI",
    "signal": "真实网页操作 · +643/7d",
    "url": "https://github.com/jackwener/opencli",
    "description": "把网页、平台和公开 API 变成 AI 可以稳定调用的命令行工具。",
    "descriptionEn": "Turn websites, platforms, and public APIs into command-line tools that AI can call reliably."
  },
  "lark-cli": {
    "name": "飞书 / Lark CLI",
    "nameEn": "Feishu / Lark CLI",
    "signal": "中文团队工作流 · +342/7d",
    "url": "https://github.com/larksuite/cli",
    "description": "适合会议纪要、文档、多维表格、日历和任务流这类中文办公项目。",
    "descriptionEn": "Suited for Chinese-office projects like meeting notes, docs, spreadsheets, calendars, and task workflows."
  },
  "github-cli": {
    "name": "GitHub CLI",
    "nameEn": "GitHub CLI",
    "signal": "复现开源项目",
    "url": "https://cli.github.com/",
    "description": "让 AI 更顺地 clone、看 issue、开 PR、跑 release 和管理项目来源。",
    "descriptionEn": "Helps AI smoothly clone repos, read issues, open PRs, run releases, and manage project sources."
  },
  "supabase-skills": {
    "name": "Supabase Agent Skills",
    "nameEn": "Supabase Agent Skills",
    "signal": "登录数据库",
    "url": "https://github.com/supabase/agent-skills",
    "description": "新手做账号、权限、数据库、实时数据时，用它减少后端卡点。",
    "descriptionEn": "Reduces backend friction for beginners building auth, permissions, databases, and real-time data."
  },
  "huggingface-skills": {
    "name": "Hugging Face Skills",
    "nameEn": "Hugging Face Skills",
    "signal": "AI Demo",
    "url": "https://github.com/huggingface/skills",
    "description": "适合把模型、数据集、Gradio、Spaces 接进 AI 项目和演示页面。",
    "descriptionEn": "Integrate models, datasets, Gradio, and Spaces into your AI projects and demo pages."
  },
  "sentry-skills": {
    "name": "Sentry Agent Skills",
    "nameEn": "Sentry Agent Skills",
    "signal": "上线稳定性",
    "url": "https://github.com/getsentry/skills",
    "description": "公开项目上线后，用来定位错误、修 issue、维护监控接入。",
    "descriptionEn": "After your project goes live, use it to track down errors, fix issues, and maintain monitoring."
  }
};

export const defaultSkillIds: Record<string, SkillId[]> = {
  "fun": [
    "github-cli",
    "playwright-skill",
    "frontend-design"
  ],
  "useful": [
    "github-cli",
    "shadcn-skill",
    "playwright-skill"
  ],
  "hardware": [
    "github-cli",
    "opencli"
  ],
  "stars": [
    "github-cli",
    "openai-skills"
  ]
};

export const projectSkillOverrides: Record<string, SkillId[]> = {
  "AI 小镇 / NPC 社交游戏": [
    "github-cli",
    "openai-docs",
    "playwright-skill"
  ],
  "手势控制小游戏 / 手势乐器": [
    "github-cli",
    "playwright-skill",
    "frontend-design"
  ],
  "节点式视觉实验室": [
    "github-cli",
    "frontend-design",
    "playwright-skill"
  ],
  "生成式海报 / 壁纸工厂": [
    "canva-skills",
    "figma-skills",
    "frontend-design"
  ],
  "产品发布短片生成器": [
    "github-cli",
    "huggingface-skills",
    "canva-skills"
  ],
  "手绘风白板 / 灵感草图板": [
    "figma-skills",
    "frontend-design",
    "playwright-skill"
  ],
  "24 小时人生拨盘": [
    "github-cli",
    "frontend-design",
    "playwright-skill"
  ],
  "节点流程玩具": [
    "github-cli",
    "shadcn-skill",
    "playwright-skill"
  ],
  "文本生成图表魔法": [
    "github-cli",
    "openai-docs",
    "playwright-skill"
  ],
  "数据可视化玩具箱": [
    "github-cli",
    "frontend-design",
    "playwright-skill"
  ],
  "WebGL 流体玩具": [
    "github-cli",
    "playwright-skill",
    "frontend-design"
  ],
  "代码动画课件": [
    "github-cli",
    "playwright-skill",
    "frontend-design"
  ],
  "闪念备忘录 / 个人微博": [
    "github-cli",
    "shadcn-skill",
    "playwright-skill"
  ],
  "个人 AI 工作台": [
    "openai-docs",
    "huggingface-skills",
    "document-skills"
  ],
  "自动化工作流中枢": [
    "opencli",
    "github-cli",
    "shadcn-skill"
  ],
  "信息雷达 / 周报机器人": [
    "opencli",
    "document-skills",
    "github-cli"
  ],
  "票据合同 OCR 文档库": [
    "document-skills",
    "opencli",
    "github-cli"
  ],
  "PDF 万能工具箱": [
    "document-skills",
    "github-cli",
    "playwright-skill"
  ],
  "私人知识问答库": [
    "openai-docs",
    "huggingface-skills",
    "document-skills"
  ],
  "AI 应用工作流平台": [
    "openai-docs",
    "github-cli",
    "playwright-skill"
  ],
  "网页抓取 / 资料管道": [
    "opencli",
    "document-skills",
    "github-cli"
  ],
  "服务健康监控面板": [
    "sentry-skills",
    "github-cli",
    "playwright-skill"
  ],
  "私人元搜索引擎": [
    "opencli",
    "github-cli",
    "playwright-skill"
  ],
  "跨设备文件同步": [
    "github-cli",
    "opencli"
  ],
  "Meshtastic 离线通讯节点": [
    "github-cli",
    "opencli"
  ],
  "QMK 宏键盘 / 工作流控制台": [
    "github-cli",
    "opencli"
  ],
  "智能植物监测器": [
    "github-cli",
    "opencli"
  ],
  "ESPHome 全屋传感器平台": [
    "github-cli",
    "opencli"
  ],
  "ratgdo 车库门控制器": [
    "github-cli",
    "opencli"
  ],
  "harry0703/MoneyPrinterTurbo": [
    "github-cli",
    "openai-docs",
    "huggingface-skills"
  ],
  "Lum1104/Understand-Anything": [
    "github-cli",
    "openai-skills",
    "playwright-skill"
  ],
  "microsoft/markitdown": [
    "document-skills",
    "github-cli",
    "opencli"
  ],
  "Leonxlnx/taste-skill": [
    "openai-skills",
    "document-skills",
    "github-cli"
  ],
  "colbymchenry/codegraph": [
    "github-cli",
    "openai-docs",
    "playwright-skill"
  ],
  "affaan-m/ECC": [
    "openai-skills",
    "openai-docs",
    "github-cli"
  ],
  "rohitg00/ai-engineering-from-scratch": [
    "github-cli",
    "huggingface-skills",
    "openai-docs"
  ],
  "mukul975/Anthropic-Cybersecurity-Skills": [
    "openai-skills",
    "github-cli",
    "document-skills"
  ],
  "hardikpandya/stop-slop": [
    "openai-skills",
    "document-skills",
    "github-cli"
  ],
  "calesthio/OpenMontage": [
    "github-cli",
    "huggingface-skills",
    "canva-skills"
  ],
  "google-labs-code/design.md": [
    "frontend-design",
    "figma-skills",
    "github-cli"
  ],
  "topoteretes/cognee": [
    "openai-docs",
    "github-cli",
    "document-skills"
  ],
  "JCodesMore/ai-website-cloner-template": [
    "github-cli",
    "frontend-design",
    "playwright-skill"
  ],
  "ZhuLinsen/daily_stock_analysis": [
    "openai-docs",
    "github-cli",
    "document-skills"
  ],
  "addyosmani/agent-skills": [
    "agent-skills",
    "github-cli",
    "playwright-skill"
  ],
  "apple/container": [
    "github-cli",
    "openai-docs",
    "document-skills"
  ],
  "chopratejas/headroom": [
    "openai-docs",
    "github-cli",
    "document-skills"
  ],
  "phuryn/pm-skills": [
    "openai-skills",
    "document-skills",
    "github-cli"
  ],
  "NVIDIA/SkillSpector": [
    "skillspector",
    "github-cli",
    "document-skills"
  ],
  "anthropics/knowledge-work-plugins": [
    "document-skills",
    "openai-skills",
    "github-cli"
  ],
  "EveryInc/compound-engineering-plugin": [
    "openai-skills",
    "github-cli",
    "document-skills"
  ],
  "mvanhorn/last30days-skill": [
    "openai-skills",
    "opencli",
    "document-skills"
  ],
  "DeusData/codebase-memory-mcp": [
    "github-cli",
    "openai-docs",
    "document-skills"
  ],
  "NousResearch/hermes-agent": [
    "github-cli",
    "openai-docs",
    "document-skills"
  ],
  "Panniantong/Agent-Reach": [
    "opencli",
    "github-cli",
    "playwright-skill"
  ],
  "palmier-io/palmier-pro": [
    "github-cli",
    "canva-skills",
    "huggingface-skills"
  ],
  "jamiepine/voicebox": [
    "github-cli",
    "huggingface-skills",
    "openai-docs"
  ],
  "simplex-chat/simplex-chat": [
    "github-cli",
    "document-skills",
    "playwright-skill"
  ],
  "Stirling-Tools/Stirling-PDF": [
    "document-skills",
    "github-cli",
    "playwright-skill"
  ],
  "lfnovo/open-notebook": [
    "document-skills",
    "openai-docs",
    "github-cli"
  ],
  "chatwoot/chatwoot": [
    "github-cli",
    "shadcn-skill",
    "playwright-skill"
  ],
  "kenn-io/agentsview": [
    "github-cli",
    "openai-docs",
    "document-skills"
  ],
  "microsoft/PowerToys": [
    "github-cli",
    "document-skills",
    "playwright-skill"
  ],
  "PaddlePaddle/PaddleOCR": [
    "document-skills",
    "github-cli",
    "huggingface-skills"
  ],
  "pbakaus/impeccable": [
    "frontend-design",
    "figma-skills",
    "playwright-skill"
  ],
  "roboflow/supervision": [
    "huggingface-skills",
    "github-cli",
    "playwright-skill"
  ],
  "Open-LLM-VTuber/Open-LLM-VTuber": [
    "openai-docs",
    "huggingface-skills",
    "github-cli"
  ],
  "CopilotKit/CopilotKit": [
    "github-cli",
    "shadcn-skill",
    "playwright-skill"
  ]
};

export const projectSkillLimits: Record<string, number> = {
  "跨设备文件同步": 2,
  "ESP32 电子墨水日历牌": 2,
  "Meshtastic 离线通讯节点": 2,
  "QMK 宏键盘 / 工作流控制台": 2,
  "智能植物监测器": 2,
  "ESPHome 全屋传感器平台": 2,
  "OpenMQTTGateway 万能网关": 2,
  "Zigbee2MQTT 设备桥": 2,
  "ESP32-CAM 口袋摄像头": 2,
  "ESPresense 房间定位": 2,
  "Marlin 3D 打印机固件": 2,
  "Klipper 高速打印控制器": 2,
  "ZMK 无线机械键盘": 2,
  "KMK CircuitPython 键盘": 2,
  "OpenSprinkler 智能浇灌": 2,
  "OpenAstroTracker 星空追踪器": 2,
  "SmartKnob 触感旋钮": 2,
  "ratgdo 车库门控制器": 2,
  "OpenDTU 太阳能监控": 2,
  "rtl_433 无线传感器雷达": 2
};

export const projectSkillRules: import("./types").ProjectSkillRule[] = [
  { tracks: ["fun", "stars"], match: /短片|短视频|视频|成片|分镜|配音|字幕|tts|voice|movie|moneyprinter|remotion|ffmpeg/, skills: ["github-cli", "openai-docs", "huggingface-skills"] },
  { tracks: ["fun"], match: /海报|壁纸|封面|字体|素材|视觉稿|typography|blotter/, skills: ["canva-skills", "figma-skills", "frontend-design"] },
  { tracks: ["fun"], match: /three|webgl|canvas|phaser|pixi|p5|kaplay|godot|matter|game|游戏|白板|3d|视觉|动画|音频|音乐|合成器|可视化|图表|节点|流程|拖拽|房间|展厅|粒子|webxr|react three/, skills: ["github-cli", "playwright-skill", "frontend-design"] },
  { tracks: ["fun", "useful"], match: /ppt|网页 ppt|演示稿|发布页|长图|presentation|deck|幻灯/, skills: ["guizang-ppt", "canva-skills", "figma-skills"] },
  { tracks: ["useful", "stars"], match: /pdf|office|word|excel|ppt|markdown|ocr|文档|票据|合同|发票|周报|资料|知识工作|会议|skill file|技能清单/, skills: ["document-skills", "opencli", "github-cli"] },
  { tracks: ["useful", "stars"], match: /hugging face|gradio|spaces|数据集|dataset|model|模型|image search|object tags/, skills: ["huggingface-skills", "github-cli", "playwright-skill"] },
  { tracks: ["fun", "useful", "stars"], match: /\bai\b|rag|llm|问答|知识库|agent|workflow|应用工作流|大模型|总结|提示词/, skills: ["openai-docs", "github-cli", "playwright-skill"] },
  { tracks: ["useful"], match: /数据库|crm|后台|登录|权限|表格|realtime|supabase|台账|内部工具|forms|automation/, skills: ["supabase-skills", "shadcn-skill", "playwright-skill"] },
  { tracks: ["useful"], match: /飞书|lark|微信|会议|多维表格/, skills: ["lark-cli", "opencli", "github-cli"] },
  { tracks: ["useful"], match: /自动化|webhook|opencli|抓取|搜索|api|rss|crawler|元搜索|资料管道/, skills: ["opencli", "github-cli", "document-skills"] },
  { tracks: ["useful"], match: /监控|状态页|报警|健康|uptime|错误|sentry/, skills: ["sentry-skills", "github-cli", "playwright-skill"] },
  { tracks: ["useful"], match: /看板|工作台|仪表盘|表单|按钮|页面|pwa|wiki|知识库|白板|表格|管理器|收件箱|档案馆/, skills: ["github-cli", "shadcn-skill", "playwright-skill"] },
  { tracks: ["hardware"], match: /\bai\b|语音|speech|mcp|coral|frigate|大模型/, skills: ["github-cli", "openai-docs", "opencli"] },
  { tracks: ["hardware"], match: /dashboard|仪表盘|控制台|面板|web ui|网页|home assistant|magicmirror|pi-hole|tasmota|octoprint|mainsail|openhasp|airgradient|状态|统计/, skills: ["github-cli", "opencli", "playwright-skill"] },
  { tracks: ["hardware"], match: /esp32|raspberry|home assistant|esphome|mqtt|zigbee|qmk|zmk|kmk|klipper|marlin|3d 打印|传感器|硬件|门铃|灯带|电子墨水|lora|sdr|firmware|固件|keymap|arduino/, skills: ["github-cli", "opencli"] },
];
