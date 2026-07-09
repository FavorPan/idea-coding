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
components/idea/      # 看板 UI（IdeaBoard 看板 / IdeaCanvas 建议器 / PlanDialog 开工对话）
lib/data/             # 精选数据层：约 90 个项目、四轨道、Skill 目录、建议器选项
lib/generated/        # 自动生成数据层（每天由 GitHub Actions 刷新，勿手改）
lib/logic/            # 筛选、Skill 匹配、开工提示词组装
lib/github/trending.ts  # 明星项目数据层
scripts/              # 数据刷新链路：discover / ai-evaluate / validate
skills/idea-coding/   # Codex Skill 版本
public/               # 静态 SEO 专题页与站点文件
```

## 四大轨道

看板把所有项目分成四个轨道，对应新手关心的四种「值不值得做」：

| 轨道 | 定位 |
|---|---|
| **好玩**（fun） | 即时反馈、强互动，一天能做出给朋友看的版本。 |
| **好用**（useful） | 做完能进入日常工作流，优先解决信息、文档、财务、个人知识管理。 |
| **好搓**（hardware） | 小预算也能跑通，硬件反馈明确，从 ESP32、树莓派起步。 |
| **明星**（stars） | 最近 star 增长最快的 GitHub 项目，追踪正在冒头的开源新货。 |

前三个轨道是手维护的精选项目（约 90 个，见 `lib/data/`）；明星轨道由 GitHub Actions 每天自动刷新（见 `lib/generated/`）。四者在看板上统一呈现，每个项目都带三个评分。

## 三个评分维度

每个项目都有三个 0–5 的评分，帮新手快速判断「值不值得做」：

- **wow** — 惊喜感 / 炫不炫。做完能不能让人眼前一亮、想分享。
- **useful** — 实用度。做完是不是真的能进日常用。
- **easy** — 上手友好度。步骤清不清晰、要不要踩坑、环境复杂不复杂。

看板支持按任一维度排序，配合轨道筛选快速定位。比如「好玩 + 按 wow 排序」找最炫的演示项目，「好用 + 按 useful 排序」找最值得长期用的工具。

## 数据从哪来：自动刷新链路

明星轨道的数据每天自动更新。`.github/workflows/data-refresh.yml` 每天北京时间 11:00 自动跑，分三步，全部成功才会 commit：

1. **发现** — `scripts/discover-topics.mjs` 对 13 个 GitHub Topics（`creative-coding` / `ai-agents` / `esp32` 等，硬编码映射到 `fun` / `useful` / `hardware` 三轨道）调 Search API，过滤掉 star < 100 或超过 12 个月未更新的仓库，输出候选列表。
2. **评估** — `scripts/ai-evaluate.mjs` 读每个候选的 README 和 issue 区，交给 Agnes AI（`agnes-2.0-flash`）生成 `tagline` / `mvp` / `wow·useful·easy` 评分 / Skill 推荐，每轨道留 Top 30。
3. **校验** — `scripts/validate-data.mjs` 跑数据质量校验，失败则 abort workflow，不会污染数据。

通过后把结果 commit 进 `lib/generated/`：`stars.ts`（评估结果）、`lastSnapshot.ts`（上次刷新的 star 快照）、`metadata.ts`（刷新时间）。**这个目录不要手改**，一切由脚本写入。

### 明星轨道怎么算出来

1. 候选池来自上一步 AI 评估通过的 Top 项目（带预填的 wow/useful/easy 评分和 tagline）。
2. 每次构建时并发拉取这些仓库的实时 `stargazers_count`，用 `当前总数 − 上次快照` 算出增量，按增量排序。
3. 上次快照就存在 git 里——Actions 每天跑一次，每次把当天的 star 数写进 `lib/generated/lastSnapshot.ts` 并 commit。下次构建时拿这个快照来 diff，所以「增量」实际是「距上一次每日刷新的增长量」。

也就是说，明星轨道的「排名」是构建时算的，数据新鲜度取决于上一次构建。要是没有配 `GITHUB_TOKEN`，star 数不会实时刷新，只会用 commit 进 `lib/generated/` 的快照值。

## 命令

```bash
pnpm dev          # 本地开发
pnpm build        # 构建（输出到 out/，纯静态）
pnpm test         # 数据质量测试

pnpm data:refresh # 手动跑一次数据刷新链路（discover + evaluate + validate）
```

部署是分工的：GitHub Actions 只刷新数据并 commit `lib/generated/` 回 main；push 到 main 后，由托管平台的 Git 集成自动拉取代码、构建、部署。Actions 里不跑构建、不部署。

需要的环境变量：

- `GITHUB_TOKEN` — 数据刷新链路拉候选仓库用（Actions 自动提供）；构建时也用它实时拉 star 数，不配的话明星轨道 star 数不会刷新。
- `AGNES_API_KEY` — AI 评估用，只在数据刷新链路里需要。

## 开工建议器

看板上的「开工建议器」（IdeaCanvas）是一个四维度的小问答，帮不知道做什么的新手缩小范围：

- **时间** — 今天 2 小时 / 周末 1-2 天 / 一周慢慢做
- **目标** — 给朋友演示 / 自己日常用 / 动手搓设备 / 追前沿动态
- **熟练度** — 刚开始 / 会一点 / 愿意折腾
- **硬件** — 不买硬件 / 几十块可以 / 已经有设备

选完四个维度后，看板会推荐一个最匹配的项目，并生成一段**开工提示词**——包含项目来源链接、推荐 Skill 及每个 Skill 的使用理由、难度评估、风险清单、准备清单，最终拼成一段可以直接复制粘贴给 Codex / Cursor / Claude Code 的 prompt。这是整个项目的核心交付：不只是「推荐项目」，而是「给新手一个能直接开工的起点」。

## Skill 推荐

每个项目会匹配若干个值得搭配的 Skill / 工具（比如做网页的配 HTML/CSS Skill，做自动化的配脚本 Skill）。匹配规则在 `lib/data/` 里，按项目轨道和技术栈正则匹配。开工提示词里会逐个说明「这个 Skill 在本项目里用在哪一步」，而不是干巴巴列一串工具名。

## 数据层

`lib/data/` 是精选数据层：约 90 个项目、四轨道定义、Skill 目录、开工建议器选项、标签和 Skill 匹配规则。直接手改这些 `.ts` 文件即可——文件头的 `AUTO-GENERATED` 注释是历史遗留，已不再有生成脚本。增删改项目时，记得同步更新同文件里的 `projectTagOverrides` 和 `projectTagRules` / `projectSkillRules`，否则标签和 Skill 匹配会不一致。

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

`public/guides/` 和 `public/projects/` 是手写的静态 HTML 专题页，面向搜索引擎和 AI 爬虫。`public/llms.txt`、`public/sitemap.xml`、`public/feed.xml`、`public/robots.txt` 也由手工维护。`scripts/check-geo-seo.mjs` 和 `scripts/submit-indexnow.mjs` 是独立的 SEO 辅助脚本（IndexNow ping、地理 / SEO 检查）。

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
