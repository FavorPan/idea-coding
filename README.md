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
  generated/          # 自动生成数据层（每天由 GitHub Actions 刷新，勿手改）
  logic/              # 纯函数逻辑：项目筛选、Skill 匹配、开工提示词组装
  github/trending.ts  # GitHub Trending 数据层（消费 lib/generated/ + 实时拉取）
scripts/              # 数据刷新链路：discover-topics / ai-evaluate / validate-data
.github/workflows/    # data-refresh.yml — 每天 UTC 03:00 跑发现 + 评估 + commit
public/               # 静态 SEO 专题页（guides/、projects/）与站点文件
skills/idea-coding/   # Codex Skill 版本（SKILL.md + references/）
test/                 # 数据质量测试套件
```

## 数据流：自动刷新链路 → 服务端缓存 → 客户端看板

数据分两层：**精选项目**（`lib/data/`，手维护）和**增长项目**（`lib/generated/`，GitHub Actions 每天自动刷新）。两者都被归一化成 `BoardProject`，`<IdeaBoard>` 一视同仁。

### 自动刷新链路（GitHub Actions Cron）

`.github/workflows/data-refresh.yml` 每天北京时间 11:00（UTC 03:00）自动跑，分三步，全部成功才会 commit：

1. **发现** — `scripts/discover-topics.mjs` 对 13 个 GitHub Topics（`creative-coding` / `ai-agents` / `esp32` 等，硬编码映射到 `fun` / `useful` / `hardware` 三轨道）调 Search API，过滤掉 star < 100 或超过 12 个月未更新的仓库，输出候选列表。
2. **评估** — `scripts/ai-evaluate.mjs` 读每个候选的 README 和 issue 区，交给 Agnes AI（`agnes-2.0-flash`）生成 `tagline` / `mvp` / `wow·useful·easy` 评分 / Skill 推荐，每轨道留 Top 30。
3. **校验** — `scripts/validate-data.mjs` 跑数据质量校验，失败则 abort workflow，不会污染数据。

通过后把结果 commit 进 `lib/generated/`：`stars.ts`（评估结果）、`lastWeek.ts`（上周 star 快照）、`metadata.ts`（刷新时间）。**这个目录不要手改**，一切由脚本写入。

### 运行时：服务端缓存 → 客户端

`app/page.tsx` 是异步 Server Component，调用 `getTrending()`（`"use cache"` 函数，`minutes` 缓存策略），后者调用 `lib/github/trending.ts` 里的 `fetchTrending()`：

- 主数据源是 `lib/generated/stars.ts`（AI 评估过的项目，带预填的评分）。为空时回退到 `lib/data/stars.ts` 里手维护的 `starFallback`。
- 请求时并发拉取实时 `stargazers_count`，`weeklyStars = 当前总数 − lastWeek 快照`，按周增量排序。Git 本身就是快照存储——每次 Actions 都把当前计数和上周快照一起 commit，周对周 diff 天然成立。
- 三层回退：没有 `GITHUB_TOKEN` → 仍用 generated 数据但 star 数不实时；generated 为空 → 用 `starFallback`；API 全失败 → 返回静态数据，source 标为 `"fallback"`。

`getGeneratedMeta()` 暴露刷新时间，页面据此显示「上次刷新」时间戳。

## 命令

```bash
pnpm dev          # Next.js 开发服务器
pnpm build        # 生产构建
pnpm test         # node --test test/project-data-quality.test.mjs（唯一的测试套件）
```

数据刷新链路（对应 GitHub Actions 的三步，本地也能单跑）：

```bash
pnpm data:discover   # 拉 13 个 GitHub Topics 候选仓库（需 GITHUB_TOKEN）
pnpm data:evaluate   # Agnes AI 评估候选，写 lib/generated/（需 GITHUB_TOKEN + AGNES_API_KEY）
pnpm data:validate   # 校验生成数据质量
pnpm data:refresh    # 顺序跑上面三步
```

部署目标通过 OpenNext 适配到 Cloudflare 边缘运行时：

```bash
pnpm preview      # OpenNext 边缘构建 + 本地预览
pnpm deploy       # OpenNext 边缘构建 + 部署
```

首次部署前，先在 `wrangler.toml` 里创建引用的绑定：

- R2 桶 `idea-coding-opennext-cache`（OpenNext 增量缓存 / ISR）
- 自引用 service binding（OpenNext 缓存需要）

> Trending 的定时刷新已从 Cloudflare cron 迁移到 GitHub Actions（见上文的自动刷新链路），`wrangler.toml` 不再有 cron trigger 和 KV 绑定。push 到 main 即触发 Cloudflare Pages 自动 rebuild。

生产环境若要让运行时实时拉取 star 数生效，需配置 `GITHUB_TOKEN` 环境变量；自动刷新链路则需要在 GitHub 仓库 Secrets 里配 `AGNES_API_KEY`（`GITHUB_TOKEN` 由 Actions 自动提供）。

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
