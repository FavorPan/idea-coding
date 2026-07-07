// AUTO-GENERATED from src/main.js by scripts/extract-data.mjs.
// Do not edit by hand — re-run the script after changing main.js.
import type { Project, TrackId, ProjectTagRule } from "./types";
import { tracks } from "./tracks";

export const projectGroups: Record<Exclude<TrackId, "stars">, Project[]> = {
  "fun": [
    {
      "name": "AI 小镇 / NPC 社交游戏",
      "tagline": "一张小地图，几个会记忆、聊天、行动的 AI 角色。",
      "stack": [
        "Next.js",
        "Convex",
        "LLM",
        "Canvas"
      ],
      "mvp": "先做 3 个角色、1 个场景、10 条记忆；角色每天自动生成一段小剧情。",
      "wow": 97,
      "useful": 66,
      "easy": 68,
      "source": "AI Town",
      "url": "https://github.com/a16z-infra/ai-town",
      "demoUrl": "https://www.convex.dev/ai-town"
    },
    {
      "name": "手势控制小游戏 / 手势乐器",
      "tagline": "摄像头识别手势，用手掌控制游戏、节奏和音效。",
      "stack": [
        "MediaPipe",
        "Tone.js",
        "Phaser"
      ],
      "mvp": "握拳暂停，张手发射，左右移动控制音高；5 分钟就能感到魔法发生。",
      "wow": 94,
      "useful": 58,
      "easy": 74,
      "source": "Hand Tracking Demo",
      "url": "https://github.com/collidingScopes/threejs-handtracking-101",
      "demoUrl": "https://collidingscopes.github.io/threejs-handtracking-101/"
    },
    {
      "name": "节点式视觉实验室",
      "tagline": "像搭积木一样连节点，生成海报、动效和可交互图形。",
      "stack": [
        "Graphite",
        "WASM",
        "Node Graph"
      ],
      "mvp": "先复刻一个节点画布：形状、颜色、噪声和导出四个节点能连起来。",
      "wow": 93,
      "useful": 70,
      "easy": 54,
      "source": "Graphite",
      "url": "https://github.com/GraphiteEditor/Graphite",
      "demoUrl": "https://graphite.art"
    },
    {
      "name": "浏览器里的迷你音频工作站",
      "tagline": "上传一段音频，剪切、变声、循环采样，直接导出。",
      "stack": [
        "Web Audio",
        "Waveform",
        "IndexedDB"
      ],
      "mvp": "做波形预览、片段裁切、三种效果器和本地保存。",
      "wow": 91,
      "useful": 72,
      "easy": 62,
      "source": "AudioMass",
      "url": "https://github.com/pkalogiros/AudioMass",
      "demoUrl": "https://audiomass.co"
    },
    {
      "name": "物理沙盒 / 像素炼金术",
      "tagline": "沙子、水、火、植物互相反应，几行规则就能长出一个小宇宙。",
      "stack": [
        "Rust/WASM",
        "Canvas",
        "Cellular"
      ],
      "mvp": "先做 8 种材料、画笔、暂停/单步和分享种子。",
      "wow": 90,
      "useful": 45,
      "easy": 60,
      "source": "Sandspiel",
      "url": "https://github.com/MaxBittker/sandspiel",
      "demoUrl": "https://sandspiel.club"
    },
    {
      "name": "浏览器现场视觉合成器",
      "tagline": "输入一行代码，画面跟着音乐和节奏实时变形。",
      "stack": [
        "Hydra",
        "WebGL",
        "Web Audio"
      ],
      "mvp": "做 6 个 preset、BPM 控制、录屏导出和随机视觉按钮。",
      "wow": 89,
      "useful": 52,
      "easy": 57,
      "source": "Hydra",
      "url": "https://github.com/hydra-synth/hydra",
      "demoUrl": "https://hydra.ojack.xyz"
    },
    {
      "name": "生成式海报 / 壁纸工厂",
      "tagline": "滑动几个参数，就能生成一张有自己审美的海报。",
      "stack": [
        "p5.js",
        "Tweakpane",
        "Canvas"
      ],
      "mvp": "做 6 个参数、3 套版式、PNG 导出和随机种子复现。",
      "wow": 89,
      "useful": 61,
      "easy": 82,
      "source": "p5Catalyst Demo",
      "url": "https://multitude-amsterdam.github.io/p5Catalyst/"
    },
    {
      "name": "多人涂鸦白板游戏",
      "tagline": "多人同时画画、投票、猜词，适合朋友局和团队破冰。",
      "stack": [
        "tldraw",
        "PartyKit",
        "Realtime"
      ],
      "mvp": "先做一个房间码、实时画布、倒计时和投票按钮。",
      "wow": 86,
      "useful": 57,
      "easy": 70,
      "source": "tldraw",
      "url": "https://github.com/tldraw/tldraw",
      "demoUrl": "https://www.tldraw.com"
    },
    {
      "name": "24 小时人生拨盘",
      "tagline": "把一天做成一个可拖拽的圆盘，看见时间正在流向哪里。",
      "stack": [
        "SVG",
        "LocalStorage",
        "Charts"
      ],
      "mvp": "拖拽分配睡眠、工作、娱乐和学习；自动生成日复盘。",
      "wow": 82,
      "useful": 76,
      "easy": 80,
      "source": "Linear Clock Lab",
      "url": "https://github.com/jm5k/jm5k.github.io",
      "demoUrl": "https://linearclocklab.com/"
    },
    {
      "name": "产品发布短片生成器",
      "tagline": "给截图、脚本和几个镜头，让代码代理自动合成发布视频。",
      "stack": [
        "Remotion",
        "LLM",
        "Video"
      ],
      "mvp": "上传 3 张截图，自动生成字幕、镜头运动和 30 秒 MP4。",
      "wow": 84,
      "useful": 67,
      "easy": 46,
      "source": "Montage",
      "url": "https://github.com/simplexlabs/montage"
    },
    {
      "name": "手绘风白板 / 灵感草图板",
      "tagline": "把流程、脑暴、路线图画成手绘质感，可分享也可协作。",
      "stack": [
        "Excalidraw",
        "SVG",
        "Realtime"
      ],
      "mvp": "做无限画布、三种图形、文本贴纸和一键分享链接。",
      "wow": 85,
      "useful": 75,
      "easy": 72,
      "source": "Excalidraw",
      "url": "https://github.com/excalidraw/excalidraw",
      "demoUrl": "https://excalidraw.com"
    },
    {
      "name": "3D 房间 / 作品集小宇宙",
      "tagline": "把个人主页做成可走动的 3D 房间，每个物件都是一个链接。",
      "stack": [
        "Three.js",
        "GLTF",
        "Pointer"
      ],
      "mvp": "放 6 个模型、键盘移动、点击物件打开项目卡。",
      "wow": 92,
      "useful": 64,
      "easy": 45,
      "source": "Room Portfolio",
      "url": "https://github.com/AT010303/Room_Portfolio"
    },
    {
      "name": "WebGL 流体玩具",
      "tagline": "鼠标一划就像墨水在水里散开，适合做背景、封面和装置。",
      "stack": [
        "WebGL",
        "Shaders",
        "Canvas"
      ],
      "mvp": "做流体画布、颜色切换、截图导出和移动端触摸。",
      "wow": 88,
      "useful": 48,
      "easy": 56,
      "source": "WebGL Fluid",
      "url": "https://github.com/PavelDoGreat/WebGL-Fluid-Simulation",
      "demoUrl": "https://paveldogreat.github.io/WebGL-Fluid-Simulation/"
    },
    {
      "name": "算法节奏乐队",
      "tagline": "用短短几行 pattern 生成鼓点、旋律和循环音乐。",
      "stack": [
        "Strudel",
        "Web Audio",
        "Live Coding"
      ],
      "mvp": "做四轨循环、BPM 控制、录音和分享 pattern。",
      "wow": 87,
      "useful": 53,
      "easy": 61,
      "source": "Strudel REPL",
      "url": "https://strudel.cc/"
    },
    {
      "name": "浏览器合成器面板",
      "tagline": "旋钮、键盘、波形和效果器都在网页里，调参就出声。",
      "stack": [
        "Tone.js",
        "Web MIDI",
        "Canvas"
      ],
      "mvp": "做一个双振荡器合成器，支持键盘弹奏、滤波和 delay。",
      "wow": 84,
      "useful": 62,
      "easy": 67,
      "source": "JSS-01 Synthesizer",
      "url": "https://github.com/michaelkolesidis/javascript-software-synthesizer",
      "demoUrl": "https://jss.michaelkolesidis.com"
    },
    {
      "name": "2D 闯关小游戏",
      "tagline": "用地图、角色、碰撞和道具做一关能玩的横版小游戏。",
      "stack": [
        "Phaser",
        "Tilemap",
        "Sprites"
      ],
      "mvp": "做一个地图、一种敌人、三枚金币和终点门。",
      "wow": 83,
      "useful": 49,
      "easy": 73,
      "source": "Phaser Platformer",
      "url": "https://github.com/remarkablegames/phaser-platformer",
      "demoUrl": "https://remarkablegames.org/phaser-platformer/"
    },
    {
      "name": "街机风小游戏原型机",
      "tagline": "用更轻量的游戏库，快速做出弹幕、跳跃或收集类 demo。",
      "stack": [
        "KAPLAY",
        "JavaScript",
        "Sprites"
      ],
      "mvp": "做一个 60 秒挑战关，支持分数、失败和重新开始。",
      "wow": 82,
      "useful": 47,
      "easy": 78,
      "source": "KAPLAY",
      "url": "https://github.com/kaplayjs/kaplay"
    },
    {
      "name": "物理弹球 / 多米诺实验",
      "tagline": "让球、方块、弹簧和重力自己演戏，特别适合做小游戏机制。",
      "stack": [
        "Matter.js",
        "Canvas",
        "Physics"
      ],
      "mvp": "做一个弹球台：挡板、碰撞音效、计分和重力滑杆。",
      "wow": 82,
      "useful": 50,
      "easy": 70,
      "source": "JavaScript Physics",
      "url": "https://github.com/lonekorean/javascript-physics",
      "demoUrl": "https://lonekorean.github.io/javascript-physics/"
    },
    {
      "name": "拖拽式海报编辑器",
      "tagline": "图片、文字、贴纸、滤镜都能拖拽摆放，最后导出 PNG。",
      "stack": [
        "Fabric.js",
        "Canvas",
        "Export"
      ],
      "mvp": "做图层、拖拽缩放、对齐线和一键导出。",
      "wow": 80,
      "useful": 78,
      "easy": 64,
      "source": "vue-fabric-editor",
      "url": "https://github.com/ikuaitu/vue-fabric-editor",
      "demoUrl": "https://ikuaitu.github.io/doc/#/"
    },
    {
      "name": "代码动画课件",
      "tagline": "用动画框架和时间轴生成解释课件，适合做技术视频和课程图解。",
      "stack": [
        "Motion Canvas",
        "TypeScript",
        "Timeline"
      ],
      "mvp": "做一个排序算法动画，带字幕、暂停点和导出。",
      "wow": 81,
      "useful": 73,
      "easy": 52,
      "source": "Motion Canvas",
      "url": "https://github.com/motion-canvas/motion-canvas",
      "demoUrl": "https://motioncanvas.io"
    },
    {
      "name": "React 视频渲染工厂",
      "tagline": "用 React 视频框架把组件渲染成视频，自动生成开场、字幕和产品演示。",
      "stack": [
        "Remotion",
        "React",
        "FFmpeg"
      ],
      "mvp": "用数据生成 5 个镜头，导出一支 15 秒产品短片。",
      "wow": 83,
      "useful": 74,
      "easy": 55,
      "source": "Remotion",
      "url": "https://github.com/remotion-dev/remotion",
      "demoUrl": "https://www.remotion.dev/"
    },
    {
      "name": "节点流程玩具",
      "tagline": "参考 React Flow 示例做拖线流程画布，天然适合可视化 AI agent。",
      "stack": [
        "React Flow",
        "Nodes",
        "Edges"
      ],
      "mvp": "实现输入、处理、输出三类节点，支持保存和重放。",
      "wow": 78,
      "useful": 82,
      "easy": 68,
      "source": "React Flow Example Apps",
      "url": "https://github.com/xyflow/react-flow-example-apps",
      "demoUrl": "https://reactflow.dev/examples"
    },
    {
      "name": "文本生成图表魔法",
      "tagline": "用户写几行文字，就能生成流程图、时序图和项目路线图。",
      "stack": [
        "Mermaid",
        "Markdown",
        "Export"
      ],
      "mvp": "做编辑器、实时预览、主题切换和 PNG/SVG 导出。",
      "wow": 76,
      "useful": 84,
      "easy": 78,
      "source": "Mermaid Live Editor",
      "url": "https://github.com/mermaid-js/mermaid-live-editor",
      "demoUrl": "https://mermaid.live"
    },
    {
      "name": "数据可视化玩具箱",
      "tagline": "把 CSV 拖进可视化工具，快速试气泡图、桑基图、时间线和关系图。",
      "stack": [
        "RAWGraphs",
        "CSV",
        "Charts"
      ],
      "mvp": "上传一份表格，选 3 种图表，调字段映射并导出 SVG/PNG。",
      "wow": 79,
      "useful": 81,
      "easy": 58,
      "source": "RAWGraphs",
      "url": "https://github.com/rawgraphs/rawgraphs-app",
      "demoUrl": "https://app.rawgraphs.io/"
    },
    {
      "name": "手绘风 UI 组件参考",
      "tagline": "一组手绘质感 Web 组件参考，适合快速做 wireframe、草稿原型和趣味控件。",
      "stack": [
        "Rough.js",
        "SVG",
        "Canvas"
      ],
      "mvp": "先挑按钮、输入框、卡片和开关四类组件，做成一个可复用的草稿风组件页。",
      "wow": 75,
      "useful": 67,
      "easy": 80,
      "source": "Wired Elements",
      "url": "https://github.com/rough-stuff/wired-elements",
      "demoUrl": "https://wiredjs.com"
    },
    {
      "name": "浏览器 3D 小展厅 / A-Frame 示例",
      "tagline": "先用普通浏览器搭一个能走动的 3D 展厅，再把 WebXR 当作可选增强。",
      "stack": [
        "A-Frame",
        "Three.js",
        "3D Assets"
      ],
      "mvp": "做一间展厅、五件展品、说明牌和第一人称漫游；确认桌面端可见后再考虑手机 XR。",
      "wow": 84,
      "useful": 55,
      "easy": 66,
      "source": "A-Frame Examples",
      "url": "https://github.com/aframevr/aframe",
      "demoUrl": "https://aframe.io/examples/"
    },
    {
      "name": "像素 / 粒子编辑器",
      "tagline": "用现成粒子编辑器调出火花、烟雾和像素舞台，再把配置接进自己的页面。",
      "stack": [
        "PixiJS",
        "Particles",
        "Sprites"
      ],
      "mvp": "先用编辑器调出 3 个粒子 preset，再接入一个 PixiJS 画布页面。",
      "wow": 84,
      "useful": 56,
      "easy": 62,
      "source": "Pixi Particle Editor",
      "url": "https://userland.pixijs.io/particle-emitter-editor/"
    },
    {
      "name": "React 3D 产品模型参考",
      "tagline": "参考一个 React Three Fiber 产品模型源码，先做本地旋转、热点和动画解释。",
      "stack": [
        "React Three Fiber",
        "Three.js",
        "GLTF"
      ],
      "mvp": "先在本地展示一个模型，做 4 个热点、光照切换和截图按钮。",
      "wow": 82,
      "useful": 76,
      "easy": 50,
      "source": "3D Product Configurator Source",
      "url": "https://github.com/Madewill/3d-product-configurator"
    },
    {
      "name": "字体扭曲效果库",
      "tagline": "一个老牌 WebGL 字体效果库参考，适合做标题封面、动态字效和海报灵感。",
      "stack": [
        "Blotter",
        "GLSL",
        "Typography"
      ],
      "mvp": "先复刻 3 种标题效果，支持改字、换色和截图导出。",
      "wow": 78,
      "useful": 61,
      "easy": 59,
      "source": "Blotter",
      "url": "https://github.com/bradley/Blotter",
      "demoUrl": "https://blotter.js.org"
    },
    {
      "name": "周末游戏引擎原型",
      "tagline": "用 Godot 官方示例在本地引擎里做一个可导出网页的 2D/3D 小游戏切片。",
      "stack": [
        "Godot",
        "GDScript",
        "Web Export"
      ],
      "mvp": "做一个完整循环：开始、玩法、失败、胜利、导出网页。",
      "wow": 80,
      "useful": 60,
      "easy": 57,
      "source": "Godot Demo Projects",
      "url": "https://github.com/godotengine/godot-demo-projects"
    }
  ],
  "useful": [
    {
      "name": "个人 AI 工作台",
      "tagline": "统一聊天、文件问答、网页总结和日常工具调用。",
      "stack": [
        "Open WebUI",
        "RAG",
        "Local LLM"
      ],
      "mvp": "先接一个模型，支持上传 PDF，回答时附来源片段。",
      "wow": 79,
      "useful": 98,
      "easy": 65,
      "source": "Open WebUI",
      "url": "https://github.com/open-webui/open-webui"
    },
    {
      "name": "自动化工作流中枢",
      "tagline": "把表单、邮件、表格、AI 总结和提醒串成一条自动流水线。",
      "stack": [
        "n8n",
        "Webhook",
        "AI Tools"
      ],
      "mvp": "先做一个「收到链接 → 摘要 → 写进表格 → 发通知」流程。",
      "wow": 86,
      "useful": 97,
      "easy": 66,
      "source": "n8n",
      "url": "https://github.com/n8n-io/n8n"
    },
    {
      "name": "信息雷达 / 周报机器人",
      "tagline": "自动扫描 Product Hunt、HN、GitHub 和 RSS，整理成可发布周报。",
      "stack": [
        "Vercel Cron",
        "RSS",
        "LLM"
      ],
      "mvp": "每日抓 30 条链接，去重、打分、生成 5 条推荐。",
      "wow": 82,
      "useful": 96,
      "easy": 72,
      "source": "agents-radar",
      "url": "https://github.com/duanyytop/agents-radar"
    },
    {
      "name": "收藏夹 + AI 阅读收件箱",
      "tagline": "网页、PDF、视频链接统一收藏，自动归档、摘要和全文保存。",
      "stack": [
        "Linkwarden",
        "Crawler",
        "RAG"
      ],
      "mvp": "浏览器扩展收藏链接，抓正文，生成一句摘要和三个标签。",
      "wow": 77,
      "useful": 94,
      "easy": 70,
      "source": "Linkwarden",
      "url": "https://github.com/linkwarden/linkwarden"
    },
    {
      "name": "票据合同 OCR 文档库",
      "tagline": "把合同、发票、截图变成可搜索、可标签化的资料库。",
      "stack": [
        "OCR",
        "Postgres",
        "Search"
      ],
      "mvp": "图片/PDF 上传、OCR 文本、标签、全文搜索。",
      "wow": 73,
      "useful": 94,
      "easy": 63,
      "source": "paperless-ngx",
      "url": "https://github.com/paperless-ngx/paperless-ngx"
    },
    {
      "name": "私人相册 + AI 搜索",
      "tagline": "找照片不再翻一年相册，直接搜地点、人物、事件和画面。",
      "stack": [
        "Image Search",
        "Object Tags",
        "Storage"
      ],
      "mvp": "本地上传 200 张照片，自动生成标签和按月浏览。",
      "wow": 76,
      "useful": 91,
      "easy": 59,
      "source": "Immich",
      "url": "https://github.com/immich-app/immich"
    },
    {
      "name": "个人财务 / 订阅管理器",
      "tagline": "看清每月钱去了哪里，自动提醒快到期的订阅。",
      "stack": [
        "CSV Import",
        "Charts",
        "Reminders"
      ],
      "mvp": "导入账单 CSV，识别订阅，生成月度支出图。",
      "wow": 68,
      "useful": 90,
      "easy": 78,
      "source": "Actual Budget",
      "url": "https://github.com/actualbudget/actual"
    },
    {
      "name": "PDF 万能工具箱",
      "tagline": "合并、压缩、签名、OCR、转图片，所有 PDF 小活都在本地跑。",
      "stack": [
        "Stirling PDF",
        "Docker",
        "OCR"
      ],
      "mvp": "做一个上传区，支持合并、压缩、加水印和转图片四个按钮。",
      "wow": 71,
      "useful": 89,
      "easy": 74,
      "source": "Stirling PDF",
      "url": "https://github.com/Stirling-Tools/Stirling-PDF"
    },
    {
      "name": "服务健康监控面板",
      "tagline": "把网站、接口、自动化脚本都放进一个会报警的状态页。",
      "stack": [
        "Uptime Kuma",
        "Status Page",
        "Alerts"
      ],
      "mvp": "监控 5 个 URL，失败时发邮件/Telegram，并生成公开状态页。",
      "wow": 69,
      "useful": 88,
      "easy": 79,
      "source": "Uptime Kuma",
      "url": "https://github.com/louislam/uptime-kuma"
    },
    {
      "name": "食谱 + 购物清单 + 冰箱库存",
      "tagline": "复制菜谱链接，自动拆成采购清单，顺手管理库存。",
      "stack": [
        "Recipe Parser",
        "Checklist",
        "PWA"
      ],
      "mvp": "菜谱粘贴、食材提取、购物清单勾选、常买项记忆。",
      "wow": 70,
      "useful": 87,
      "easy": 76,
      "source": "Mealie",
      "url": "https://github.com/mealie-recipes/mealie"
    },
    {
      "name": "闪念备忘录 / 个人微博",
      "tagline": "像发微博一样记录想法、链接、截图和今日碎片。",
      "stack": [
        "Memos",
        "Markdown",
        "Tags"
      ],
      "mvp": "做快速输入、标签、日历视图和全文搜索。",
      "wow": 65,
      "useful": 86,
      "easy": 82,
      "source": "Memos",
      "url": "https://github.com/usememos/memos"
    },
    {
      "name": "Bookmark Everything 档案馆",
      "tagline": "链接、图片、笔记全收藏，并用 AI 自动打标签。",
      "stack": [
        "Karakeep",
        "AI Tags",
        "Full Text"
      ],
      "mvp": "浏览器收藏 50 条链接，自动抓取正文、截图和标签。",
      "wow": 73,
      "useful": 88,
      "easy": 69,
      "source": "Karakeep",
      "url": "https://github.com/karakeep-app/karakeep"
    },
    {
      "name": "本地 Notion 式工作台",
      "tagline": "项目、文档、任务和数据库放在一个可离线的工作空间。",
      "stack": [
        "AppFlowy",
        "Kanban",
        "Docs"
      ],
      "mvp": "做一个项目空间：文档、任务看板、数据库和 AI 摘要。",
      "wow": 72,
      "useful": 88,
      "easy": 60,
      "source": "AppFlowy",
      "url": "https://github.com/AppFlowy-IO/AppFlowy"
    },
    {
      "name": "白板 + 知识库混合空间",
      "tagline": "既能写文档，也能用白板整理关系和思路。",
      "stack": [
        "AFFiNE",
        "Canvas",
        "Docs"
      ],
      "mvp": "做一个选题工作区：资料页、白板、任务区互相引用。",
      "wow": 76,
      "useful": 86,
      "easy": 58,
      "source": "AFFiNE",
      "url": "https://github.com/toeverything/AFFiNE"
    },
    {
      "name": "双链知识库 / 学习卡片",
      "tagline": "把读书笔记、会议纪要和灵感连成可回溯的知识网络。",
      "stack": [
        "Logseq",
        "Markdown",
        "Graph"
      ],
      "mvp": "做每日笔记、双链引用、标签图谱和复习清单。",
      "wow": 68,
      "useful": 87,
      "easy": 67,
      "source": "Logseq",
      "url": "https://github.com/logseq/logseq"
    },
    {
      "name": "团队 Wiki / SOP 中心",
      "tagline": "把流程、模板、账号说明和 FAQ 整理成团队知识库。",
      "stack": [
        "Outline",
        "Markdown",
        "Search"
      ],
      "mvp": "搭一个空间，录入 20 篇 SOP，支持权限和搜索。",
      "wow": 64,
      "useful": 89,
      "easy": 71,
      "source": "Outline",
      "url": "https://github.com/outline/outline"
    },
    {
      "name": "私人手册站",
      "tagline": "像一本内部百科，把生活、项目和工具说明分层管理。",
      "stack": [
        "BookStack",
        "Pages",
        "Permissions"
      ],
      "mvp": "建立 3 本书、10 个章节、搜索和公开分享。",
      "wow": 62,
      "useful": 86,
      "easy": 75,
      "source": "BookStack",
      "url": "https://github.com/BookStackApp/BookStack"
    },
    {
      "name": "开源文档协作站",
      "tagline": "给小团队做一个轻量版 Confluence，写需求、规范和复盘。",
      "stack": [
        "Docmost",
        "Docs",
        "Realtime"
      ],
      "mvp": "做一个团队空间、模板库、评论和权限。",
      "wow": 66,
      "useful": 88,
      "easy": 68,
      "source": "Docmost",
      "url": "https://github.com/docmost/docmost"
    },
    {
      "name": "无代码数据库后台",
      "tagline": "把表格变成数据库和内部工具，适合做运营台账。",
      "stack": [
        "NocoDB",
        "Database",
        "Forms"
      ],
      "mvp": "把 CSV 导入成数据库，做表单、视图和筛选。",
      "wow": 69,
      "useful": 90,
      "easy": 74,
      "source": "NocoDB",
      "url": "https://github.com/nocodb/nocodb"
    },
    {
      "name": "表格数据库 / 小型 CRM",
      "tagline": "用 Airtable 式表格管理客户、项目、报价和内容排期。",
      "stack": [
        "Baserow",
        "Tables",
        "Automation"
      ],
      "mvp": "搭 4 张表：客户、项目、任务、报价，并加自动提醒。",
      "wow": 67,
      "useful": 88,
      "easy": 73,
      "source": "Baserow",
      "url": "https://github.com/baserow/baserow"
    },
    {
      "name": "内部工具搭建器",
      "tagline": "拖拽表格、按钮、表单和自动化，做一个自己的运营后台。",
      "stack": [
        "Budibase",
        "Forms",
        "Automations"
      ],
      "mvp": "做一个商单排期后台，支持新建、筛选、状态变更。",
      "wow": 70,
      "useful": 89,
      "easy": 65,
      "source": "Budibase",
      "url": "https://github.com/Budibase/budibase"
    },
    {
      "name": "私人知识问答库",
      "tagline": "把本地文件、网页和笔记接入一个能追问的 AI 助手。",
      "stack": [
        "AnythingLLM",
        "RAG",
        "Workspaces"
      ],
      "mvp": "创建 3 个资料库，上传文件并按空间回答问题。",
      "wow": 76,
      "useful": 91,
      "easy": 67,
      "source": "AnythingLLM",
      "url": "https://github.com/Mintplex-Labs/anything-llm"
    },
    {
      "name": "AI 应用工作流平台",
      "tagline": "把提示词、知识库、工具调用和发布入口做成可复用应用。",
      "stack": [
        "Dify",
        "Agents",
        "Workflow"
      ],
      "mvp": "做一个选题助手：输入链接，输出摘要、角度和标题。",
      "wow": 78,
      "useful": 92,
      "easy": 63,
      "source": "Dify",
      "url": "https://github.com/langgenius/dify"
    },
    {
      "name": "可视化 Agent 编排器",
      "tagline": "用节点方式搭聊天机器人、检索链和工具调用流程。",
      "stack": [
        "Flowise",
        "LangChain",
        "Nodes"
      ],
      "mvp": "拖一个 RAG 流程：输入、检索、LLM、输出四个节点。",
      "wow": 75,
      "useful": 89,
      "easy": 66,
      "source": "Flowise",
      "url": "https://github.com/FlowiseAI/Flowise"
    },
    {
      "name": "深度 RAG 文档助手",
      "tagline": "给大量 PDF、网页和表格做检索增强问答。",
      "stack": [
        "RAGFlow",
        "OCR",
        "Agents"
      ],
      "mvp": "导入 20 份 PDF，支持引用来源和多轮追问。",
      "wow": 73,
      "useful": 91,
      "easy": 54,
      "source": "RAGFlow",
      "url": "https://github.com/infiniflow/ragflow"
    },
    {
      "name": "网页抓取 / 资料管道",
      "tagline": "把网页变成干净 Markdown，供周报、知识库和 AI 流程使用。",
      "stack": [
        "Firecrawl",
        "Markdown",
        "Crawler"
      ],
      "mvp": "输入 URL 列表，抓正文、去重、转摘要并导出。",
      "wow": 72,
      "useful": 90,
      "easy": 62,
      "source": "Firecrawl",
      "url": "https://github.com/firecrawl/firecrawl"
    },
    {
      "name": "私人元搜索引擎",
      "tagline": "聚合多个搜索源，不追踪、不广告，适合当资料入口。",
      "stack": [
        "SearXNG",
        "Docker",
        "Search"
      ],
      "mvp": "部署搜索页，配置 5 个引擎，保存常用查询。",
      "wow": 66,
      "useful": 86,
      "easy": 70,
      "source": "SearXNG",
      "url": "https://github.com/searxng/searxng"
    },
    {
      "name": "跨设备文件同步",
      "tagline": "电脑、NAS、手机之间自动同步文件，不依赖网盘。",
      "stack": [
        "Syncthing",
        "P2P",
        "Folders"
      ],
      "mvp": "同步两个文件夹，设置忽略规则和冲突提示。",
      "wow": 64,
      "useful": 88,
      "easy": 73,
      "source": "Syncthing",
      "url": "https://github.com/syncthing/syncthing"
    },
    {
      "name": "家庭密码库",
      "tagline": "自托管密码管理，给自己和家人统一保存账号。",
      "stack": [
        "Vaultwarden",
        "Bitwarden",
        "Docker"
      ],
      "mvp": "部署服务、创建家庭组织、导入密码并启用 2FA。",
      "wow": 62,
      "useful": 92,
      "easy": 69,
      "source": "Vaultwarden",
      "url": "https://github.com/dani-garcia/vaultwarden"
    },
    {
      "name": "财务火控仪表盘",
      "tagline": "把账户、预算、账单和财务规则做成更完整的个人系统。",
      "stack": [
        "Firefly III",
        "Budgets",
        "Rules"
      ],
      "mvp": "导入账单，自动分类，做预算、标签和月报。",
      "wow": 63,
      "useful": 89,
      "easy": 58,
      "source": "Firefly III",
      "url": "https://github.com/firefly-iii/firefly-iii"
    }
  ],
  "hardware": [
    {
      "name": "ESP32 电子墨水日历牌",
      "tagline": "一块低功耗屏，放在桌面显示日程、天气、待办和提醒。",
      "stack": [
        "ESP32",
        "E-paper",
        "ESPHome"
      ],
      "mvp": "每 30 分钟刷新一次天气和今日待办，晚上自动低功耗。",
      "wow": 90,
      "useful": 91,
      "easy": 73,
      "source": "LilyGo ESPHome Calendar",
      "url": "https://github.com/AppForce1/lilygo-t5-47-plus-esphome"
    },
    {
      "name": "WLED 音乐律动灯",
      "tagline": "用手机网页控制灯带，让房间跟音乐一起动起来。",
      "stack": [
        "ESP32",
        "LED Strip",
        "WLED"
      ],
      "mvp": "三种氛围场景、一个音乐模式、一个睡前暖光模式。",
      "wow": 92,
      "useful": 69,
      "easy": 80,
      "source": "WLED",
      "url": "https://github.com/wled/WLED"
    },
    {
      "name": "Magic Mirror 智能镜子",
      "tagline": "Raspberry Pi + 半透镜，把镜子变成家庭信息面板。",
      "stack": [
        "Raspberry Pi",
        "MagicMirror",
        "Modules"
      ],
      "mvp": "天气、日历、新闻、倒计时四个模块先跑起来。",
      "wow": 93,
      "useful": 82,
      "easy": 61,
      "source": "MagicMirror",
      "url": "https://github.com/MagicMirrorOrg/MagicMirror"
    },
    {
      "name": "Meshtastic 离线通讯节点",
      "tagline": "两块 LoRa 小板就能组一个不用手机信号的文字通讯网。",
      "stack": [
        "LoRa",
        "ESP32",
        "Meshtastic"
      ],
      "mvp": "两台设备互发消息，网页地图显示节点位置，再加一个频道名。",
      "wow": 91,
      "useful": 76,
      "easy": 62,
      "source": "Meshtastic",
      "url": "https://github.com/meshtastic/firmware"
    },
    {
      "name": "QMK 宏键盘 / 工作流控制台",
      "tagline": "几颗按键完成截图、发提示词、开工具、切场景。",
      "stack": [
        "QMK",
        "USB HID",
        "3D Print"
      ],
      "mvp": "6 个键：截图、录音、打开项目、切窗口、提交、部署。",
      "wow": 84,
      "useful": 88,
      "easy": 67,
      "source": "QMK",
      "url": "https://github.com/qmk/qmk_firmware"
    },
    {
      "name": "本地 AI 摄像头门铃",
      "tagline": "门口摄像头本地识别人、车和包裹，只把重要事件推给你。",
      "stack": [
        "Frigate",
        "Coral TPU",
        "Home Assistant"
      ],
      "mvp": "先接一支摄像头，识别人形事件，保存 10 秒片段并推送。",
      "wow": 87,
      "useful": 89,
      "easy": 44,
      "source": "Frigate",
      "url": "https://github.com/blakeblackshear/frigate"
    },
    {
      "name": "小智 ESP32 AI 语音终端",
      "tagline": "一块小板、一只喇叭和麦克风，做成可对话的桌面 AI 伙伴。",
      "stack": [
        "ESP32",
        "MCP",
        "Speech"
      ],
      "mvp": "按键唤醒、语音问答、调用一个本地工具，再在屏幕上显示回复。",
      "wow": 89,
      "useful": 80,
      "easy": 52,
      "source": "xiaozhi-esp32",
      "url": "https://github.com/78/xiaozhi-esp32"
    },
    {
      "name": "Tasmota 家电控制台",
      "tagline": "把插座、灯、传感器刷成统一固件，搭一个完全本地的控制面板。",
      "stack": [
        "Tasmota",
        "MQTT",
        "Web UI"
      ],
      "mvp": "先接一个智能插座，网页开关、定时规则和功耗曲线跑起来。",
      "wow": 78,
      "useful": 86,
      "easy": 63,
      "source": "Tasmota",
      "url": "https://github.com/arendst/Tasmota"
    },
    {
      "name": "Pi-hole 家庭网络护城河",
      "tagline": "一台 Raspberry Pi 变成全家的广告拦截、DNS 和网络统计中心。",
      "stack": [
        "Raspberry Pi",
        "Pi-hole",
        "DNS"
      ],
      "mvp": "接管家庭 DNS，显示今日拦截数，再加常用域名白名单。",
      "wow": 74,
      "useful": 90,
      "easy": 71,
      "source": "Pi-hole",
      "url": "https://github.com/pi-hole/pi-hole"
    },
    {
      "name": "智能植物监测器",
      "tagline": "湿度、温度、光照和缺水提醒，让桌面植物更容易活。",
      "stack": [
        "ESP32",
        "Sensors",
        "Home Assistant"
      ],
      "mvp": "土壤湿度低于阈值时亮灯，并推送一条提醒。",
      "wow": 78,
      "useful": 81,
      "easy": 77,
      "source": "Soil Moisture Sensor",
      "url": "https://github.com/bicycleboy/yet-another-soil-moisture-sensor"
    },
    {
      "name": "ESPHome 全屋传感器平台",
      "tagline": "用 YAML 把温湿度、人体、门磁和灯控接进家庭自动化。",
      "stack": [
        "ESPHome",
        "ESP32",
        "YAML"
      ],
      "mvp": "做一个温湿度节点，接入 Home Assistant 并显示历史曲线。",
      "wow": 76,
      "useful": 90,
      "easy": 75,
      "source": "ESPHome",
      "url": "https://github.com/esphome/esphome"
    },
    {
      "name": "Home Assistant 家庭中枢",
      "tagline": "把灯、门锁、传感器、摄像头和自动化统一管理。",
      "stack": [
        "Home Assistant",
        "Integrations",
        "Dashboard"
      ],
      "mvp": "接入 5 个设备，做一个早安/晚安自动化和手机面板。",
      "wow": 80,
      "useful": 94,
      "easy": 57,
      "source": "Home Assistant",
      "url": "https://github.com/home-assistant/core"
    },
    {
      "name": "OpenMQTTGateway 万能网关",
      "tagline": "把蓝牙、433MHz、红外等设备信号转换成 MQTT。",
      "stack": [
        "MQTT",
        "RF",
        "ESP32"
      ],
      "mvp": "读取一个蓝牙温度计和一个 433 遥控器，发布到 MQTT。",
      "wow": 77,
      "useful": 86,
      "easy": 56,
      "source": "OpenMQTTGateway",
      "url": "https://github.com/1technophile/OpenMQTTGateway"
    },
    {
      "name": "Zigbee2MQTT 设备桥",
      "tagline": "让 Zigbee 传感器不依赖厂商网关，直接接入本地系统。",
      "stack": [
        "Zigbee",
        "MQTT",
        "Coordinator"
      ],
      "mvp": "配对一个门磁和一个按钮，触发灯光或通知。",
      "wow": 76,
      "useful": 88,
      "easy": 54,
      "source": "Zigbee2MQTT",
      "url": "https://github.com/Koenkk/zigbee2mqtt"
    },
    {
      "name": "ESP32-CAM 口袋摄像头",
      "tagline": "几十块钱的小板做延时摄影、门口观察或宠物相机。",
      "stack": [
        "ESP32-CAM",
        "MJPEG",
        "Storage"
      ],
      "mvp": "网页实时预览，按按钮拍照，并保存最近 20 张。",
      "wow": 82,
      "useful": 75,
      "easy": 62,
      "source": "ESP32 Cam Webserver",
      "url": "https://github.com/easytarget/esp32-cam-webserver"
    },
    {
      "name": "ESPresense 房间定位",
      "tagline": "用蓝牙信号判断人在客厅、卧室还是书房。",
      "stack": [
        "ESP32",
        "BLE",
        "Presence"
      ],
      "mvp": "部署两个节点，识别手机/手环所在房间并触发自动化。",
      "wow": 79,
      "useful": 84,
      "easy": 57,
      "source": "ESPresense",
      "url": "https://github.com/ESPresense/ESPresense"
    },
    {
      "name": "Marlin 3D 打印机固件",
      "tagline": "给 3D 打印机刷开源固件，理解温控、步进和限位。",
      "stack": [
        "Marlin",
        "Firmware",
        "3D Printer"
      ],
      "mvp": "编译固件，配置主板、热床、喷头和自动调平。",
      "wow": 76,
      "useful": 82,
      "easy": 43,
      "source": "Marlin",
      "url": "https://github.com/MarlinFirmware/Marlin"
    },
    {
      "name": "Klipper 高速打印控制器",
      "tagline": "Raspberry Pi 负责运动控制，让 3D 打印更快更稳。",
      "stack": [
        "Klipper",
        "Raspberry Pi",
        "Printer"
      ],
      "mvp": "接入一台打印机，完成校准、压力提前和输入整形。",
      "wow": 79,
      "useful": 84,
      "easy": 42,
      "source": "Klipper",
      "url": "https://github.com/Klipper3d/klipper"
    },
    {
      "name": "OctoPrint 打印机监控台",
      "tagline": "远程上传模型、看摄像头、暂停打印和查看进度。",
      "stack": [
        "OctoPrint",
        "Raspberry Pi",
        "Webcam"
      ],
      "mvp": "网页上传 G-code，接摄像头，做打印完成通知。",
      "wow": 73,
      "useful": 85,
      "easy": 66,
      "source": "OctoPrint",
      "url": "https://github.com/OctoPrint/OctoPrint"
    },
    {
      "name": "ZMK 无线机械键盘",
      "tagline": "低功耗蓝牙键盘固件，适合分体键盘和便携键盘。",
      "stack": [
        "ZMK",
        "Bluetooth",
        "Keymap"
      ],
      "mvp": "配置 36 键布局、蓝牙配对、双层快捷键。",
      "wow": 77,
      "useful": 83,
      "easy": 52,
      "source": "ZMK",
      "url": "https://github.com/zmkfirmware/zmk"
    },
    {
      "name": "KMK CircuitPython 键盘",
      "tagline": "用 Python 写键盘固件，更适合快速改键和实验。",
      "stack": [
        "KMK",
        "CircuitPython",
        "HID"
      ],
      "mvp": "做一个 4 键小键盘，支持旋钮、宏和层切换。",
      "wow": 75,
      "useful": 82,
      "easy": 66,
      "source": "KMK",
      "url": "https://github.com/KMKfw/kmk_firmware"
    },
    {
      "name": "OpenSprinkler 智能浇灌",
      "tagline": "根据时间、天气和湿度控制花园或阳台浇水。",
      "stack": [
        "OpenSprinkler",
        "Valves",
        "Weather"
      ],
      "mvp": "控制一路水阀，设置日程和下雨跳过规则。",
      "wow": 74,
      "useful": 84,
      "easy": 49,
      "source": "OpenSprinkler",
      "url": "https://github.com/OpenSprinkler/OpenSprinkler-Firmware"
    },
    {
      "name": "OpenAstroTracker 星空追踪器",
      "tagline": "自制赤道仪追踪星空，拍更清楚的长曝光星野。",
      "stack": [
        "Stepper",
        "Arduino",
        "Astronomy"
      ],
      "mvp": "打印结构件，驱动一步进电机，完成基础极轴校准。",
      "wow": 88,
      "useful": 68,
      "easy": 35,
      "source": "OpenAstroTracker",
      "url": "https://github.com/OpenAstroTech/OpenAstroTracker-Firmware"
    },
    {
      "name": "SmartKnob 触感旋钮",
      "tagline": "一个带屏幕和力反馈的旋钮，可以控制音量、灯光和时间线。",
      "stack": [
        "ESP32",
        "Motor",
        "Display"
      ],
      "mvp": "做音量旋钮、模式切换、屏幕显示和阻尼反馈。",
      "wow": 90,
      "useful": 78,
      "easy": 37,
      "source": "SmartKnob",
      "url": "https://github.com/scottbez1/smartknob"
    },
    {
      "name": "ratgdo 车库门控制器",
      "tagline": "把车库门状态、本地控制和自动化接入 Home Assistant。",
      "stack": [
        "ESPHome",
        "Garage",
        "Home Assistant"
      ],
      "mvp": "读取开关状态，网页控制开关，并设置离家提醒。",
      "wow": 72,
      "useful": 86,
      "easy": 50,
      "source": "ratgdo",
      "url": "https://github.com/ratgdo/esphome-ratgdo"
    },
    {
      "name": "AirGradient 空气质量站",
      "tagline": "监测 PM2.5、CO2、温湿度，做一块家里的空气仪表盘。",
      "stack": [
        "AirGradient",
        "Sensors",
        "Dashboard"
      ],
      "mvp": "接入 CO2 和 PM2.5 传感器，显示曲线和超标提醒。",
      "wow": 76,
      "useful": 88,
      "easy": 59,
      "source": "AirGradient",
      "url": "https://github.com/airgradienthq/arduino"
    },
    {
      "name": "OpenDTU 太阳能监控",
      "tagline": "读取微型逆变器数据，看今天发了多少电。",
      "stack": [
        "ESP32",
        "Solar",
        "MQTT"
      ],
      "mvp": "读取逆变器功率，展示实时曲线和日发电量。",
      "wow": 73,
      "useful": 87,
      "easy": 48,
      "source": "OpenDTU",
      "url": "https://github.com/tbnobody/OpenDTU"
    },
    {
      "name": "rtl_433 无线传感器雷达",
      "tagline": "用 SDR 接收温度计、门铃、轮胎压力等 433MHz 信号。",
      "stack": [
        "SDR",
        "rtl_433",
        "MQTT"
      ],
      "mvp": "识别一个无线温度计，把数据写入 Home Assistant。",
      "wow": 79,
      "useful": 81,
      "easy": 46,
      "source": "rtl_433",
      "url": "https://github.com/merbanan/rtl_433"
    },
    {
      "name": "openHASP 墙面控制屏",
      "tagline": "旧手机或小屏变成 Home Assistant 的墙面控制面板。",
      "stack": [
        "openHASP",
        "MQTT",
        "Touchscreen"
      ],
      "mvp": "做灯光、温度、场景三个页面，并支持触摸控制。",
      "wow": 77,
      "useful": 85,
      "easy": 55,
      "source": "openHASP",
      "url": "https://github.com/HASwitchPlate/openHASP"
    },
    {
      "name": "Mainsail 3D 打印仪表盘",
      "tagline": "给 Klipper 打印机配一个更漂亮的网页控制台。",
      "stack": [
        "Mainsail",
        "Klipper",
        "Dashboard"
      ],
      "mvp": "显示温度、进度、文件列表和摄像头预览。",
      "wow": 72,
      "useful": 84,
      "easy": 62,
      "source": "Mainsail",
      "url": "https://github.com/mainsail-crew/mainsail"
    }
  ]
};

// Derived: every project tagged with its track id and 1-based rank.
export const projects: (Project & { id: string; track: TrackId; rank: number })[] =
  tracks
    .filter((t) => t.id !== "stars")
    .flatMap((track) =>
      projectGroups[track.id as Exclude<TrackId, "stars">].map((project, index) => ({
        id: `${track.id}-${index + 1}`,
        track: track.id,
        rank: index + 1,
        ...project,
      })),
    );

export const projectTagOverrides: Record<string, string[]> = {
  "AI 小镇 / NPC 社交游戏": [
    "AI 角色实验",
    "角色记忆",
    "小地图剧情"
  ],
  "手势控制小游戏 / 手势乐器": [
    "摄像头手势",
    "体感控制",
    "音效反馈"
  ],
  "节点式视觉实验室": [
    "节点编排",
    "参数画布",
    "导出海报"
  ],
  "浏览器里的迷你音频工作站": [
    "波形剪辑",
    "变声采样",
    "本地导出"
  ],
  "物理沙盒 / 像素炼金术": [
    "像素沙盒",
    "材料反应",
    "规则涌现"
  ],
  "浏览器现场视觉合成器": [
    "实时视觉",
    "代码演出",
    "节奏变形"
  ],
  "生成式海报 / 壁纸工厂": [
    "参数海报",
    "随机种子",
    "PNG 导出"
  ],
  "多人涂鸦白板游戏": [
    "房间码协作",
    "涂鸦投票",
    "破冰游戏"
  ],
  "24 小时人生拨盘": [
    "拖拽时间盘",
    "日复盘",
    "习惯分配"
  ],
  "产品发布短片生成器": [
    "截图成片",
    "自动字幕",
    "发布短片"
  ],
  "手绘风白板 / 灵感草图板": [
    "手绘流程",
    "无限画布",
    "分享草图"
  ],
  "3D 房间 / 作品集小宇宙": [
    "3D 房间",
    "物件链接",
    "漫游主页"
  ],
  "WebGL 流体玩具": [
    "流体墨水",
    "触摸涂抹",
    "截图背景"
  ],
  "算法节奏乐队": [
    "代码作曲",
    "四轨循环",
    "Pattern 分享"
  ],
  "浏览器合成器面板": [
    "网页合成器",
    "旋钮调音",
    "MIDI 弹奏"
  ],
  "2D 闯关小游戏": [
    "横版关卡",
    "金币敌人",
    "完整循环"
  ],
  "街机风小游戏原型机": [
    "街机挑战",
    "计分重开",
    "快速原型"
  ],
  "物理弹球 / 多米诺实验": [
    "碰撞物理",
    "弹球计分",
    "重力滑杆"
  ],
  "拖拽式海报编辑器": [
    "拖拽排版",
    "图层编辑",
    "PNG 导出"
  ],
  "代码动画课件": [
    "代码动画",
    "时间轴",
    "课程图解"
  ],
  "React 视频渲染工厂": [
    "组件转视频",
    "数据镜头",
    "MP4 导出"
  ],
  "节点流程玩具": [
    "拖线流程",
    "节点重放",
    "Agent 画布"
  ],
  "文本生成图表魔法": [
    "文本出图",
    "实时预览",
    "SVG 导出"
  ],
  "数据可视化玩具箱": [
    "CSV 探索",
    "关系气泡图",
    "Hover 详情"
  ],
  "手绘风 UI 组件参考": [
    "手绘组件",
    "草稿质感",
    "原型可视化"
  ],
  "浏览器 3D 小展厅 / A-Frame 示例": [
    "3D 展厅",
    "五件展品",
    "漫游说明牌"
  ],
  "像素 / 粒子编辑器": [
    "粒子编辑器",
    "配置导出",
    "PixiJS 画布"
  ],
  "React 3D 产品模型参考": [
    "源码参考",
    "交互热点",
    "旋转截图"
  ],
  "字体扭曲效果库": [
    "字体扭曲",
    "GLSL 标题",
    "封面效果"
  ],
  "周末游戏引擎原型": [
    "游戏切片",
    "Web 导出",
    "胜负循环"
  ],
  "个人 AI 工作台": [
    "文件问答",
    "来源引用",
    "私人 AI 工作台"
  ],
  "自动化工作流中枢": [
    "链接到表格",
    "Webhook 自动化",
    "AI 通知"
  ],
  "信息雷达 / 周报机器人": [
    "多源扫描",
    "去重打分",
    "周报生成"
  ],
  "收藏夹 + AI 阅读收件箱": [
    "链接归档",
    "正文抓取",
    "AI 标签"
  ],
  "票据合同 OCR 文档库": [
    "OCR 归档",
    "合同发票",
    "全文搜索"
  ],
  "私人相册 + AI 搜索": [
    "相册 AI 搜索",
    "人物地点",
    "家庭照片库"
  ],
  "个人财务 / 订阅管理器": [
    "订阅识别",
    "月度预算",
    "支出图表"
  ],
  "PDF 万能工具箱": [
    "PDF 合并",
    "本地 OCR",
    "文档工具箱"
  ],
  "服务健康监控面板": [
    "URL 监控",
    "故障报警",
    "公开状态页"
  ],
  "食谱 + 购物清单 + 冰箱库存": [
    "菜谱拆解",
    "购物清单",
    "冰箱库存"
  ],
  "闪念备忘录 / 个人微博": [
    "闪念输入",
    "日历回看",
    "全文搜索"
  ],
  "Bookmark Everything 档案馆": [
    "截图收藏",
    "AI 标签",
    "链接档案"
  ],
  "本地 Notion 式工作台": [
    "离线工作台",
    "任务看板",
    "数据库空间"
  ],
  "白板 + 知识库混合空间": [
    "文档白板",
    "资料互链",
    "选题工作区"
  ],
  "双链知识库 / 学习卡片": [
    "双链笔记",
    "标签图谱",
    "复习清单"
  ],
  "团队 Wiki / SOP 中心": [
    "团队 SOP",
    "权限搜索",
    "模板文档"
  ],
  "私人手册站": [
    "分层手册",
    "公开分享",
    "生活百科"
  ],
  "开源文档协作站": [
    "轻量 Confluence",
    "评论权限",
    "团队模板"
  ],
  "无代码数据库后台": [
    "CSV 变后台",
    "表单视图",
    "运营台账"
  ],
  "表格数据库 / 小型 CRM": [
    "小型 CRM",
    "报价排期",
    "自动提醒"
  ],
  "内部工具搭建器": [
    "拖拽后台",
    "状态变更",
    "商单排期"
  ],
  "私人知识问答库": [
    "空间问答",
    "文件检索",
    "私人资料库"
  ],
  "AI 应用工作流平台": [
    "提示词应用",
    "工具调用",
    "选题助手"
  ],
  "可视化 Agent 编排器": [
    "RAG 节点",
    "可视化编排",
    "检索链"
  ],
  "深度 RAG 文档助手": [
    "深度文档问答",
    "PDF OCR",
    "引用追问"
  ],
  "网页抓取 / 资料管道": [
    "网页转 Markdown",
    "干净正文",
    "资料管道"
  ],
  "私人元搜索引擎": [
    "元搜索",
    "无广告",
    "资料入口"
  ],
  "跨设备文件同步": [
    "跨设备同步",
    "P2P 文件夹",
    "冲突提示"
  ],
  "家庭密码库": [
    "家庭密码库",
    "2FA 导入",
    "自托管账号"
  ],
  "财务火控仪表盘": [
    "账单规则",
    "预算标签",
    "月度财务"
  ],
  "ESP32 电子墨水日历牌": [
    "桌面日历牌",
    "低功耗刷新",
    "天气待办"
  ],
  "WLED 音乐律动灯": [
    "灯带律动",
    "氛围场景",
    "手机控制"
  ],
  "Magic Mirror 智能镜子": [
    "智能镜面",
    "家庭信息面板",
    "模块化屏幕"
  ],
  "Meshtastic 离线通讯节点": [
    "LoRa 离线通讯",
    "节点地图",
    "频道消息"
  ],
  "QMK 宏键盘 / 工作流控制台": [
    "宏键控制台",
    "HID 快捷键",
    "工作流按键"
  ],
  "本地 AI 摄像头门铃": [
    "本地 AI 识别",
    "门铃事件",
    "片段推送"
  ],
  "小智 ESP32 AI 语音终端": [
    "语音终端",
    "按键唤醒",
    "工具调用"
  ],
  "Tasmota 家电控制台": [
    "插座控制",
    "MQTT 规则",
    "功耗曲线"
  ],
  "Pi-hole 家庭网络护城河": [
    "DNS 拦截",
    "家庭网络",
    "拦截统计"
  ],
  "智能植物监测器": [
    "土壤湿度",
    "缺水提醒",
    "植物看护"
  ],
  "ESPHome 全屋传感器平台": [
    "YAML 传感器",
    "HA 曲线",
    "温湿度节点"
  ],
  "Home Assistant 家庭中枢": [
    "全屋中枢",
    "早晚自动化",
    "手机面板"
  ],
  "OpenMQTTGateway 万能网关": [
    "蓝牙 433 网关",
    "MQTT 桥接",
    "信号转换"
  ],
  "Zigbee2MQTT 设备桥": [
    "Zigbee 本地桥",
    "门磁按钮",
    "厂商解绑"
  ],
  "ESP32-CAM 口袋摄像头": [
    "实时预览",
    "延时摄影",
    "小板相机"
  ],
  "ESPresense 房间定位": [
    "BLE 房间定位",
    "人在何处",
    "自动化触发"
  ],
  "Marlin 3D 打印机固件": [
    "打印固件",
    "温控步进",
    "自动调平"
  ],
  "Klipper 高速打印控制器": [
    "高速打印",
    "输入整形",
    "树莓派控制"
  ],
  "OctoPrint 打印机监控台": [
    "G-code 上传",
    "摄像头监控",
    "完成通知"
  ],
  "ZMK 无线机械键盘": [
    "蓝牙键盘",
    "分体布局",
    "双层快捷键"
  ],
  "KMK CircuitPython 键盘": [
    "Python 键盘",
    "旋钮宏",
    "层切换"
  ],
  "OpenSprinkler 智能浇灌": [
    "智能浇灌",
    "下雨跳过",
    "水阀日程"
  ],
  "OpenAstroTracker 星空追踪器": [
    "星空追踪",
    "步进赤道仪",
    "长曝光"
  ],
  "SmartKnob 触感旋钮": [
    "力反馈旋钮",
    "屏幕模式",
    "阻尼手感"
  ],
  "ratgdo 车库门控制器": [
    "车库门状态",
    "本地控制",
    "离家提醒"
  ],
  "AirGradient 空气质量站": [
    "CO2/PM 监测",
    "空气曲线",
    "超标提醒"
  ],
  "OpenDTU 太阳能监控": [
    "太阳能监控",
    "实时功率",
    "日发电量"
  ],
  "rtl_433 无线传感器雷达": [
    "SDR 监听",
    "433 信号",
    "传感器雷达"
  ],
  "openHASP 墙面控制屏": [
    "墙面触屏",
    "场景面板",
    "MQTT 页面"
  ],
  "Mainsail 3D 打印仪表盘": [
    "Klipper 仪表盘",
    "温度进度",
    "文件预览"
  ],
  "harry0703/MoneyPrinterTurbo": [
    "短视频流水线",
    "本周爆发",
    "脚本到成片"
  ],
  "Lum1104/Understand-Anything": [
    "代码图谱",
    "仓库问答",
    "模块关系"
  ],
  "microsoft/markitdown": [
    "文件转 Markdown",
    "AI 阅读入口",
    "Office 处理"
  ],
  "Leonxlnx/taste-skill": [
    "去模板味",
    "审美增强",
    "输出对比"
  ],
  "colbymchenry/codegraph": [
    "本地图谱",
    "少用 Token",
    "架构问答"
  ],
  "affaan-m/ECC": [
    "代理优化",
    "记忆流程",
    "开发环境增强"
  ],
  "rohitg00/ai-engineering-from-scratch": [
    "AI 工程路线",
    "Notebook 实践",
    "学习进度板"
  ],
  "mukul975/Anthropic-Cybersecurity-Skills": [
    "安全技能库",
    "框架映射",
    "审查流程"
  ],
  "hardikpandya/stop-slop": [
    "去 AI 味",
    "自然改写",
    "Skill 文件"
  ],
  "calesthio/OpenMontage": [
    "AI 视频工厂",
    "脚本到成片",
    "本周爆发"
  ],
  "google-labs-code/design.md": [
    "设计记忆",
    "AI 视觉规范",
    "DESIGN.md"
  ],
  "topoteretes/cognee": [
    "长期记忆",
    "知识图谱",
    "Agent 记住上下文"
  ],
  "JCodesMore/ai-website-cloner-template": [
    "网页克隆",
    "视觉复刻",
    "一条命令"
  ],
  "ZhuLinsen/daily_stock_analysis": [
    "行情看板",
    "新闻摘要",
    "自动推送"
  ],
  "chopratejas/headroom": [
    "Token 压缩",
    "长日志救星",
    "RAG 节省"
  ],
  "DeusData/codebase-memory-mcp": [
    "代码库记忆",
    "少用 Token",
    "MCP 索引"
  ],
  "Panniantong/Agent-Reach": [
    "全网搜索",
    "零 API 费",
    "多平台证据"
  ],
  "palmier-io/palmier-pro": [
    "AI 视频编辑",
    "macOS 剪辑",
    "字幕素材"
  ],
  "jamiepine/voicebox": [
    "AI 语音工作室",
    "声音克隆",
    "配音生成"
  ],
  "simplex-chat/simplex-chat": [
    "隐私聊天",
    "无用户 ID",
    "端到端通信"
  ],
  "Stirling-Tools/Stirling-PDF": [
    "PDF 工具箱",
    "本地处理",
    "OCR 转换"
  ],
  "anthropics/knowledge-work-plugins": [
    "知识工作插件",
    "资料整理",
    "会议准备"
  ],
  "EveryInc/compound-engineering-plugin": [
    "工程拆解",
    "任务切片",
    "可执行 Prompt"
  ]
};

export const projectTagRules: ProjectTagRule[] = [
  { match: /ai town|npc|小镇|角色每天|角色.*记忆/, tags: ["AI 角色实验", "角色记忆", "小地图剧情"] },
  { match: /手势|gesture|mediapipe|张手|握拳|手掌/, tags: ["摄像头手势", "体感控制", "即时反馈"] },
  { match: /节点式|node graph|graphite|react flow|flowise|拖线|可视化 agent/, tags: ["节点编排", "拖拽搭建", "流程可视化"] },
  { match: /waveform|audiomass|音频工作站|剪切|采样/, tags: ["波形编辑", "声音实验", "本地保存"] },
  { match: /沙子|sandspiel|像素炼金|cellular|材料/, tags: ["规则涌现", "像素沙盒", "参数玩具"] },
  { match: /hydra|流体|fluid|shader|视觉合成|粒子舞台/, tags: ["实时视觉", "鼠标即反馈", "舞台背景"] },
  { match: /海报|壁纸|poster|fabric|rough|blotter|字体|封面|贴纸/, tags: ["可导出作品", "设计玩具", "封面生成"] },
  { match: /tldraw|excalidraw|手绘风白板|涂鸦|猜词|破冰|无限画布/, tags: ["多人协作", "破冰玩法", "画布分享"] },
  { match: /24 小时|拨盘|时间|习惯|复盘|okr/, tags: ["自我复盘", "拖拽规划", "日常可用"] },
  { match: /remotion|motion canvas|montage|视频|短片|字幕|分镜|配音/, tags: ["发布短片", "自动分镜", "可导出视频"] },
  { match: /3d 房间|three|r3f|react three|webxr|a-frame|gltf|展厅|产品模型|模型放进网页/, tags: ["沉浸展示", "3D 作品集", "热点互动"] },
  { match: /phaser|kaplay|godot|matter\.js|闯关|弹球|街机|敌人|金币|横版|挑战关/, tags: ["完整游戏循环", "关卡原型", "失败重开"] },
  { match: /tone|strudel|合成器|节奏|音乐|乐器|bpm|旋钮|midi/, tags: ["调参即出声", "节奏循环", "声音反馈"] },
  { match: /mermaid|d3|csv|图表|流程图|时序图|关系图|时间线|数据可视化/, tags: ["一键图解", "数据探索", "可视化表达"] },
  { match: /open webui|anythingllm|ragflow|rag|文件问答|知识问答|引用来源/, tags: ["文件问答", "引用来源", "私人知识库"] },
  { match: /dify|agent|workflow|提示词|工具调用|应用工作流/, tags: ["AI 应用编排", "工具调用", "可发布应用"] },
  { match: /n8n|webhook|自动化|流水线|提醒|表格/, tags: ["自动流水线", "少手工操作", "工作流串联"] },
  { match: /product hunt|hacker news|hn|rss|周报|信息雷达|github 和 rss/, tags: ["信息雷达", "每周更新", "可发周报"] },
  { match: /linkwarden|karakeep|bookmark|收藏|阅读收件箱|链接/, tags: ["收藏归档", "自动摘要", "资料入口"] },
  { match: /paperless|ocr|票据|合同|发票|报销/, tags: ["票据合同整理", "全文搜索", "省心归档"] },
  { match: /immich|相册|照片|人物|地点/, tags: ["相册搜索", "画面标签", "家庭资料库"] },
  { match: /actual|firefly|财务|预算|订阅|账单/, tags: ["预算看板", "订阅提醒", "钱流可见"] },
  { match: /stirling|markitdown|pdf|office|markdown|文档转换/, tags: ["文档转换", "本地工具箱", "AI 阅读入口"] },
  { match: /uptime|状态页|监控|报警|服务健康/, tags: ["服务报警", "公开状态页", "运维看板"] },
  { match: /mealie|食谱|购物清单|冰箱/, tags: ["购物清单", "菜谱拆解", "家庭流程"] },
  { match: /memos|logseq|appflowy|affine|outline|bookstack|docmost|wiki|sop|笔记|知识库/, tags: ["知识沉淀", "双链整理", "团队 SOP"] },
  { match: /nocodb|baserow|budibase|crm|数据库|运营后台|表单/, tags: ["运营后台", "表格变应用", "客户台账"] },
  { match: /firecrawl|crawler|抓取|searxng|搜索引擎|元搜索/, tags: ["资料管道", "搜索入口", "干净正文"] },
  { match: /syncthing|同步|文件同步/, tags: ["跨设备同步", "不靠网盘", "文件保险"] },
  { match: /vaultwarden|密码|bitwarden/, tags: ["家庭密码库", "账号保险", "自托管"] },
  { match: /moneyprinter|短视频自动生成/, tags: ["短视频流水线", "AI 变现感", "脚本到成片"] },
  { match: /understand-anything|codegraph|代码图谱|仓库|模块关系/, tags: ["代码图谱", "仓库问答", "模块关系"] },
  { match: /taste-skill|stop-slop|ai 文风|文风痕迹|审美 skill|减少无聊/, tags: ["去 AI 味", "审美增强", "文案改造"] },
  { match: /headroom|token|压缩|日志/, tags: ["Token 压缩", "长日志救星", "省上下文"] },
  { match: /claude code|codex|cursor|代理|engineering|compound|skills|插件|学习路线|安全/, tags: ["工程方法", "技能库", "可复用流程"] },
  { match: /电子墨水|e-paper|日历牌|低功耗/, tags: ["桌面信息牌", "低功耗显示", "日程天气"] },
  { match: /wled|灯带|led|律动灯|音乐模式|氛围/, tags: ["房间氛围灯", "音乐律动", "手机控制"] },
  { match: /mirror|镜子|半透镜/, tags: ["家庭信息镜", "一眼查看", "客厅装置"] },
  { match: /meshtastic|lora|离线通讯/, tags: ["离线通讯", "节点地图", "户外可玩"] },
  { match: /qmk|zmk|kmk|键盘|宏键盘|快捷键|hid/, tags: ["工作流按键", "快捷键控制台", "可天天用"] },
  { match: /frigate|门铃|摄像头|人形|包裹|安防/, tags: ["本地识别", "安防提醒", "事件片段"] },
  { match: /xiaozhi|语音终端|speech|麦克风|喇叭/, tags: ["桌面语音终端", "按键唤醒", "本地工具调用"] },
  { match: /tasmota|home assistant|esphome|openmqtt|zigbee|mqtt|智能家居|门磁|传感器/, tags: ["本地智能家居", "设备联动", "自动化场景"] },
  { match: /pi-hole|dns|广告拦截|网络统计/, tags: ["家庭网络净化", "拦截统计", "全家可用"] },
  { match: /智能植物|植物监测|浇灌|sprinkler|土壤湿度|缺水提醒|水阀/, tags: ["植物看护", "自动浇水", "传感提醒"] },
  { match: /3d 打印|marlin|klipper|octoprint|mainsail|打印机/, tags: ["打印机调校", "远程监控", "进度可见"] },
  { match: /astro|星空|赤道仪|长曝光/, tags: ["星空追踪", "机械结构", "摄影增强"] },
  { match: /smartknob|力反馈|旋钮|motor|阻尼/, tags: ["力反馈旋钮", "实体手感", "桌面控制"] },
  { match: /airgradient|空气|co2|pm2.5/, tags: ["空气仪表盘", "超标提醒", "家庭健康"] },
  { match: /opendtu|太阳能|逆变器|发电/, tags: ["发电监控", "实时功率", "能源看板"] },
  { match: /rtl_433|sdr|433mhz|无线信号/, tags: ["无线信号雷达", "传感器监听", "频谱探索"] },
  { match: /openhasp|墙面|触摸控制屏/, tags: ["墙面控制屏", "场景面板", "旧屏复活"] },
];
