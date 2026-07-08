# Idea Coding

Idea Coding 是一个给 AI Coding 新手看的项目发现网站，也是一枚可以装进 Codex 的项目推荐 Skill：帮你找到值得搓的项目、看清项目亮点、匹配用得上的 Skill / 工具，并复制一段能直接交给 Codex、Cursor 或 Claude Code 的开工提示词。

公开站点：[https://ideacoding.favorhub.top](https://ideacoding.favorhub.top)

- **网站**：Next.js 应用。四大方向——好玩 / 好用 / 好搓（硬件）/ 增长最快的 GitHub 项目。
- **Skill**：装进 Codex 的项目推荐能力包，在对话里直接推荐项目、推荐 Skill、生成开工提示词。

## 这个仓库是什么

一个仓库，两个产品：

- 一个可浏览、可分享的 Next.js 网页看板，展示约 90 个精挑细选的项目、Skill 榜单与开工建议器。
- 一个独立的 Codex Skill（`skills/idea-coding/`），在对话里提供同样的推荐能力。

```
app/                  # Next.js App Router（Server Component 入口）
components/idea/      # 客户端看板组件（IdeaBoard / IdeaCanvas / PlanDialog）
lib/
  data/               # 精选数据层：项目、轨道、Skill、明星项目、建议器选项
  logic/              # 纯函数逻辑：项目筛选、Skill 匹配、开工提示词组装
  github/trending.ts  # GitHub Trending 数据层 + KV 快照
public/               # 静态 SEO 专题页（guides/、projects/）与站点文件
skills/idea-coding/   # Codex Skill 版本（SKILL.md + references/）
test/                 # 数据质量测试套件
```

## 数据流：服务端缓存的 Trending → 客户端看板

`app/page.tsx` 是一个异步 Server Component。它调用 `getTrending()`（一个 `"use cache"` 函数，`minutes` 缓存策略），后者调用 `lib/github/trending.ts` 里的 `fetchTrending()`。结果（`StarBoardProject[]` + `fetchedAt` + `source`）传给顶层客户端组件 `<IdeaBoard>`。

Trending 策略：维护一个候选仓库池（由 `starFallback` 播种），通过 GitHub REST API 拉取实时 `stargazers_count`，与上一周的 KV 快照对比算出本周增量，再按增量排序。三层回退：

- **没有 `GITHUB_TOKEN`** → 直接返回手工整理的 `starFallback`（source: `"fallback"`）。只有配置了 token 才会跑实时拉取。
- **API 失败 / 返回空** → 同样回退到 fallback。
- **KV 里没有上周快照** → `weeklyStars` 回退到 `starFallback` 里的整理值；首次成功拉取后会把当前计数写成本周快照。

`KVAdapter`（定义在 `trending.ts`）抽象了快照存储：本地 / 测试用 `MemoryKV`，生产用绑定到 `TRENDING_KV` 命名空间的 KV 适配器。`pickKV()` 根据 `process.env.TRENDING_KV` 选择。

## 命令

```bash
pnpm dev          # Next.js 开发服务器
pnpm build        # 生产构建
pnpm test         # node --test test/project-data-quality.test.mjs（唯一的测试套件）
```

部署目标通过 OpenNext 适配到边缘运行时：

```bash
pnpm preview      # OpenNext 边缘构建 + 本地预览
pnpm deploy       # OpenNext 边缘构建 + 部署
```

首次部署前，先在 `wrangler.toml` 里创建引用的绑定：

- R2 桶 `idea-coding-opennext-cache`（增量缓存）
- KV 命名空间 `TRENDING_KV`（替换占位 id，用于 Trending 周快照）
- 自引用 service binding（OpenNext 缓存需要）

生产环境若要让 Trending 实时拉取生效，需配置 `GITHUB_TOKEN` 环境变量。

> 仓库里没有 `lint` / `tsc` 脚本。类型检查在 `next build` 时隐式进行。

## 数据层是项目的核心

`lib/data/` 持有约 90 个精挑细选的项目（横跨 `fun` / `useful` / `hardware` / `stars` 四个轨道）、Skill 目录、开工建议器选项，以及标签 / Skill 匹配规则。`lib/data/types.ts` 是类型权威来源。`BoardProject` 是统一的渲染形状——精选项目和明星项目都会被归一化成它，所以 `<IdeaBoard>` 能一视同仁地处理（见 `toStarBoardProject`）。

> `lib/data/*.ts` 里的 `// AUTO-GENERATED from src/main.js by scripts/extract-data.mjs` 头是**历史遗留**。`src/main.js` 已不存在，运行 `scripts/extract-data.mjs` 会失败。**请直接手改 `lib/data/*.ts`。** 增删改项目时，记得同步更新同文件里的 `projectTagOverrides` 和正则规则 `projectTagRules` / `projectSkillRules`。

## 纯逻辑，无全局状态

`lib/logic/projects.ts` 和 `lib/logic/starter.ts` 是纯函数：调用方显式传入 `state`（轨道 / 指标 / 查询）和 `starProjects`。这是有意为之，让同一套逻辑在 Server 和 Client Component 里都能用，不产生模块循环。新增逻辑时保持纯函数，并把明星项目作为参数传入——不要引入模块级状态。

## Codex Skill

`skills/idea-coding/SKILL.md` 是自包含的：它的工作流读取 `references/projects.md`、`references/skills.md`、`references/starter-prompts.md`。Skill 的内容与 Web 应用的 `lib/data/` **分开维护**——若要在两边同步项目 / Skill 推荐，需同时更新。

内置 Skill 路径：

```text
skills/idea-coding/
```

可以把这个目录安装到 Codex 的 Skills 目录，或让支持 Skill 的代理直接读取这个目录。

### 调用示例

```text
Use Idea Coding to find 5 fun beginner-friendly Vibe Coding projects.
每个项目给我：为什么值得做、推荐 Skill / 工具、GitHub 或来源链接、复制给 Codex 的开工提示词。
```

```text
我想做一个能发朋友圈的 AI 小网页，帮我找项目并给我开工提示词。
```

```text
我要做网页 / PPT / 部署 / 自动化，有什么 Skill 值得装？
```

## 静态 SEO 内容

`public/guides/` 和 `public/projects/` 是手写的静态 HTML 专题页，面向搜索引擎和 AI 爬虫。`public/llms.txt`、`public/sitemap.xml`、`public/feed.xml`、`public/robots.txt` 也由手工维护。`scripts/check-geo-seo.mjs` 和 `scripts/submit-indexnow.mjs` 是独立的 SEO 辅助脚本（IndexNow ping、地理 / SEO 检查），与 Next.js 构建无关。

## 测试

唯一的测试套件 [test/project-data-quality.test.mjs](test/project-data-quality.test.mjs) 守护前 30 个 `fun` 项目的数据质量：断言特定 URL / Demo 链接未失效或归档，库类推荐被标注为参考，且 [test/first-page-project-audit.md](test/first-page-project-audit.md) 正好覆盖这 30 行。该测试通过 eval 从 `lib/data/projects.ts` 抽出对象字面量加载（不走 TS import）。改了 `fun` 项目的 name / url / demoUrl 时，这个套件和审计 markdown 需同步更新。

## 适合用来做什么

- 找一个适合新手的 Vibe Coding 项目。
- 找一个好玩、好用、能部署、能发朋友圈或适合周末做的项目。
- 找适合 AI Coding 新手的 Skill / 工具。
- 给某个项目生成一段可以直接复制给 Codex 的开工提示词。
- 维护自己的项目榜单、Skill 榜单或 AI 编程资料站。

## 开源协议

代码、Skill 工作流、提示词模板和项目整理格式使用 MIT License。

`Idea Coding` 名称、`ideacoding.favorhub.top` 域名和项目视觉识别不包含在 MIT 授权中。你可以 fork、改造和二创，但公开衍生版本请使用不同名称，不要暗示官方关联。详见 [TRADEMARK.md](TRADEMARK.md)。

## 贡献

欢迎贡献：

- 新的 Vibe Coding 项目来源。
- 更准确的 GitHub / Demo 链接。
- 更适合新手的 Skill / 工具推荐。
- 更清晰的开工提示词模板。
- 页面排版、可访问性、移动端体验改进。

请尽量附上项目来源、GitHub 链接、Demo 链接或社区热度证据。
