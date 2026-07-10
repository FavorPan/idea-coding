// Pure project logic — depends only on its inputs, no global state.
// Mirrors the functions in the original src/main.js, made type-safe and
// composable: callers pass `state` (track/metric/query) and `starProjects`
// explicitly so the same logic works in Server and Client Components.

import type { BoardProject, TrackId } from "@/lib/data/types";
import { tracks, boardTabs } from "@/lib/data/tracks";
import { projects as allProjects } from "@/lib/data/projects";
import {
  skillCatalog,
  defaultSkillIds,
  projectSkillOverrides,
  projectSkillLimits,
  projectSkillRules,
} from "@/lib/data/skills";
import { projectTagOverrides, projectTagRules } from "@/lib/data/projects";
import { formatCount } from "./format";
import { defaultLocale, type Locale } from "@/i18n/config";

export type { BoardProject } from "@/lib/data/types";

export interface BoardState {
  track: TrackId | "all";
  metric: "wow" | "useful" | "easy";
  query: string;
}

export function projectStack(project: BoardProject): string[] {
  return Array.isArray(project.stack) ? project.stack : [];
}

export function projectText(project: BoardProject): string {
  return [
    project.name,
    project.tagline,
    project.mvp,
    project.source,
    project.repo ?? "",
    project.language ?? "",
    projectStack(project).join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export function scoreLabel(
  project: Pick<BoardProject, "track">,
  locale: Locale = defaultLocale,
): string {
  if (project.track === "stars") return "HOT";
  return locale === "en" ? "Starter kit" : "开工包";
}

export function recommendedSkillIds(
  project: BoardProject,
  limit = 3,
): string[] {
  const ids: string[] = [];
  const resultLimit = Math.min(limit, projectSkillLimits[project.name] ?? limit);
  const push = (skillId: string) => {
    if (skillCatalog[skillId] && !ids.includes(skillId)) ids.push(skillId);
  };

  (projectSkillOverrides[project.name] ?? []).forEach(push);

  const text = projectText(project);
  projectSkillRules.forEach((rule) => {
    if (rule.tracks && !rule.tracks.includes(project.track)) return;
    if (rule.match.test(text)) rule.skills.forEach(push);
  });

  (defaultSkillIds[project.track] ?? defaultSkillIds.fun).forEach(push);

  return ids.slice(0, resultLimit);
}

export function recommendedSkills(
  project: BoardProject,
  limit = 3,
  locale: Locale = defaultLocale,
) {
  return recommendedSkillIds(project, limit).map((skillId) => {
    const skill = skillCatalog[skillId];
    if (locale === "en") {
      return {
        id: skillId,
        ...skill,
        name: skill.nameEn || skill.name,
        description: skill.descriptionEn || skill.description,
      };
    }
    return { id: skillId, ...skill };
  });
}

const SKILL_USE_REASONS: Record<string, (project: BoardProject) => string> = {
  "github-cli": (p) =>
    `用来 clone / fork「${p.source || p.repo || p.name}」、查看 README、issue 和 release，优先把原项目或最小示例跑起来。`,
  "agent-skills": () =>
    "用来给 Codex 补一套工程化执行流程，适合需要稳定读代码、改代码、跑验收的开源项目复现。",
  "skillspector": () =>
    "用来在安装或复用第三方 Skill 前先扫一遍风险，避免把危险命令和可疑权限直接交给 AI 执行。",
  "opencli": () =>
    "用来抓取项目文档、配置教程、网页控制台或公开 API，把分散资料变成 AI 可执行的步骤。",
  "playwright-skill": (p) =>
    `用来打开浏览器验收「${p.mvp}」里的关键按钮、上传、导出、移动端和重试流程。`,
  "vercel-deploy": () =>
    "用来把网页 demo 部署成可分享预览链接，并检查构建、环境变量和上线后的基础状态。",
  "frontend-design": () =>
    "用来按界面准则检查布局、文字溢出、移动端、焦点态和可访问性，让 demo 不只“能跑”也能交给别人用。",
  "shadcn-skill": () =>
    "用来快速搭出表单、弹窗、设置面板、数据表格等常见 Web App 控件，减少手写低质量 UI。",
  "figma-skills": () =>
    "用来整理界面结构、组件状态和设计上下文，适合需要设计稿、组件库或视觉对齐的项目。",
  "canva-skills": () =>
    "用来快速产出封面、海报、社媒图和展示素材，适合视觉成果型项目。",
  "guizang-ppt": () =>
    "用来把项目结果包装成网页 PPT、发布页或长图说明，适合需要一眼展示效果的项目。",
  "document-skills": () =>
    "用来处理 PDF、Office、Markdown、OCR、表格和导出文件，适合资料、文档、报表类项目。",
  "supabase-skills": () =>
    "用来处理登录、数据库表、权限、实时数据和存储，让需要后端状态的应用更快跑通。",
  "huggingface-skills": () =>
    "用来处理模型、数据集、Gradio 或 Spaces demo，适合需要 AI 模型能力的项目。",
  "sentry-skills": () =>
    "用来接入错误监控、定位线上异常和修复 issue，适合已经准备公开发布的项目。",
  "lark-cli": () =>
    "用来把飞书文档、多维表格、会议纪要、日历和任务接进自动化，适合中文团队工作流项目。",
  "openai-skills": () =>
    "用来查官方 Skill 安装与触发方式，给 Codex 补工具能力；它不是项目依赖，而是开工前的能力目录。",
  "openai-docs": () =>
    "用来参考模型调用、流式输出、工具调用和结构化输出示例，适合需要接入 LLM 的项目。",
};

export function skillUseReason(
  project: BoardProject,
  skill: { id: string; description: string },
): string {
  const fn = SKILL_USE_REASONS[skill.id];
  return fn ? fn(project) : skill.description;
}

export function projectScale(project: BoardProject) {
  const text = projectText(project);
  let score = 1;

  if (project.easy < 52) score += 1.55;
  else if (project.easy < 65) score += 1.05;
  else if (project.easy < 78) score += 0.55;

  if (project.track === "hardware") score += 1.15;
  if (project.track === "stars") score += 0.45;
  if (/docker|compose|k8s|kubernetes|数据库|database|postgres|mysql|redis|supabase|auth|权限|登录/.test(text)) score += 0.65;
  if (/llm|rag|agent|openai|模型|gradio|hugging face|tts|voice|语音|大模型/.test(text)) score += 0.55;
  if (/gpu|cuda|本地模型|stable diffusion|vtuber|webxr|frigate|coral/.test(text)) score += 0.95;
  if (/esp32|raspberry|mqtt|zigbee|固件|烧录|传感器|硬件|3d 打印|lora|sdr/.test(text)) score += 0.75;
  if (/webgl|three|canvas|phaser|pixi|p5|音频|音乐|实时|摄像头|hand tracking/.test(text)) score += 0.35;
  if (project.easy >= 82) score -= 0.25;

  const value = Math.max(1, Math.min(5, Math.round(score * 2) / 2));
  const label = value <= 1.5 ? "轻松跑" : value <= 2.5 ? "有点折腾" : value <= 3.5 ? "需要耐心" : "新手慎入";
  const hint =
    value <= 1.5
      ? "适合直接丢给 AI 开始做，先跑一个最小 demo。"
      : value <= 2.5
        ? "适合新手尝试，但开工前要先确认依赖和账号。"
        : value <= 3.5
          ? "建议让 AI 先做体检，再按最短路径跑通示例。"
          : "先别盲目 clone，最好让 AI 把环境、配置和风险讲清楚再动手。";

  return { value, label, hint };
}

export function projectVerdict(project: BoardProject) {
  const scale = projectScale(project);
  if (project.easy >= 76 && scale.value <= 2.5) {
    return {
      label: "推荐搓",
      tone: "good" as const,
      reason: `这个项目反馈比较直接，适合先做出「${project.mvp}」这样的可展示 demo。`,
    };
  }
  if (scale.value >= 4 || project.easy <= 50) {
    return {
      label: "新手慎入",
      tone: "warn" as const,
      reason: "它很有吸引力，但开工前最好先让 AI 查清依赖、配置和替代方案。",
    };
  }
  return {
    label: "可以试试",
    tone: "ok" as const,
    reason: "适合用 AI 带着跑，但不要一上来做完整版，先收窄成一个最小可运行效果。",
  };
}

export function projectPrepItems(project: BoardProject): string[] {
  const text = projectText(project);
  const items = ["项目链接", "一台电脑"];

  if (/llm|rag|agent|openai|模型|大模型|copilot|chat/.test(text)) items.push("API Key 或模型服务");
  if (/docker|compose|open webui|dify|flowise|ragflow|n8n|paperless|immich/.test(text)) items.push("Docker");
  if (/数据库|database|postgres|mysql|redis|supabase|auth|登录|权限/.test(text)) items.push("数据库/账号配置");
  if (/pdf|office|word|excel|ppt|ocr|markdown|文档|票据|合同|发票/.test(text)) items.push("真实文件样本");
  if (/webgl|three|canvas|phaser|pixi|p5|白板|图表|可视化|音频|音乐|摄像头/.test(text)) items.push("现代浏览器");
  if (/esp32|raspberry|mqtt|zigbee|固件|烧录|传感器|硬件|3d 打印|lora|sdr/.test(text)) items.push("硬件配件和数据线");
  if (/网页抓取|crawler|搜索|opencli|飞书|微信|平台|api|rss/.test(text)) items.push("网络/平台账号");
  if (project.track === "stars") items.push("先读 README");

  return [...new Set(items)].slice(0, 5);
}

export function projectRiskItems(project: BoardProject): string[] {
  const text = projectText(project);
  const risks: string[] = [];

  if (project.easy < 58) risks.push("不要直接做完整版，先让 AI 找到最小可运行入口。");
  if (/llm|rag|agent|openai|模型|大模型|tts|voice|语音/.test(text)) risks.push("可能会卡在 API Key、模型选择或网络访问上。");
  if (/docker|compose|数据库|database|postgres|mysql|redis|supabase/.test(text)) risks.push("可能会卡在环境变量、端口或数据库连接上。");
  if (/esp32|raspberry|mqtt|zigbee|固件|烧录|传感器|硬件|3d 打印|lora|sdr/.test(text)) risks.push("可能会卡在接线、烧录、设备型号或驱动上。");
  if (/webgl|three|canvas|phaser|pixi|p5|webxr|摄像头|音频|音乐/.test(text)) risks.push("可能会卡在浏览器权限、素材路径或实时性能上。");
  if (/pdf|office|ocr|文档|票据|合同|发票|markdown/.test(text)) risks.push("最好准备真实样本，不然 demo 容易只剩空界面。");
  if (!risks.length) risks.push("先跑通原项目或官方示例，再决定要不要二次开发。");

  return [...new Set(risks)].slice(0, 3);
}

export function projectExperienceTags(
  project: BoardProject,
  limit = 4,
  locale: Locale = defaultLocale,
): string[] {
  const text = projectText(project);
  const overrideTags = projectTagOverrides[project.name] ?? [];
  const tags = [...overrideTags];

  if (!overrideTags.length) {
    projectTagRules.forEach((rule) => {
      if (rule.match.test(text)) tags.push(...rule.tags);
    });
  }

  if (project.deltaStars) {
    const recentLabel = locale === "en" ? "Recent" : "近期";
    tags.push(`${recentLabel} +${formatCount(project.deltaStars)}`);
  }

  if (tags.length < 2 && project.track === "fun") tags.push("互动 Demo");
  if (tags.length < 2 && project.track === "useful") tags.push("真实工作流");
  if (tags.length < 2 && project.track === "hardware") tags.push("实体反馈");
  if (tags.length < 2 && project.track === "stars") tags.push("前沿增长");

  if (project.wow >= 90) tags.push("强演示");
  else if (project.wow >= 82) tags.push("效果直观");
  if (project.useful >= 90) tags.push("能进日常");
  else if (project.useful >= 84) tags.push("长期可用");
  if (project.easy >= 78) tags.push("新手友好");
  else if (project.easy <= 55) tags.push("进阶挑战");

  return [...new Set(tags)].slice(0, limit);
}

export function projectPrimaryUrl(project: BoardProject): string {
  return project.demoUrl || project.url || "#";
}

export function projectPrimaryActionLabel(
  project: BoardProject,
  locale: Locale = defaultLocale,
): string {
  if (locale === "en") return project.demoUrl ? "View demo" : "View source";
  return project.demoUrl ? "看演示" : "看来源";
}

export function trackOrder(id: TrackId | "all"): number {
  return tracks.findIndex((track) => track.id === id);
}

export function trackById(id: TrackId | "all") {
  if (id === "all") return undefined;
  return boardTabs.find((track) => track.id === id);
}

// Returns a track copy with eyebrow/title/short/summary swapped to the
// locale-appropriate version (falling back to the Chinese value when the
// En field is missing). Pure — locale passed explicitly.
export function localizeTrack(
  track: NonNullable<ReturnType<typeof trackById>>,
  locale: Locale = defaultLocale,
) {
  if (locale === "zh") return track;
  return {
    ...track,
    eyebrow: track.eyebrowEn || track.eyebrow,
    title: track.titleEn || track.title,
    short: track.shortEn || track.short,
    nav: track.navEn || track.nav,
    summary: track.summaryEn || track.summary,
  };
}

// A star-project-augmented board project (with id/track/rank/source/stack).
export type StarBoardProject = BoardProject & {
  repo: string;
  language: string;
  totalStars: number;
  deltaStars: number;
  trendingRank: number;
};

export function recommendationPool(starProjects: StarBoardProject[]): BoardProject[] {
  return [...allProjects, ...starProjects];
}

export function projectById(
  id: string,
  starProjects: StarBoardProject[],
): BoardProject | undefined {
  return recommendationPool(starProjects).find((project) => project.id === id);
}

function matchesQuery(
  project: BoardProject,
  query: string,
): boolean {
  const haystack = [
    project.name,
    project.tagline,
    projectStack(project).join(" "),
    project.mvp,
    project.source,
    project.repo ?? "",
    project.language ?? "",
    project.deltaStars ? String(project.deltaStars) : "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase().trim());
}

export function filteredProjects(
  state: BoardState,
  starProjects: StarBoardProject[],
): BoardProject[] {
  if (state.track === "stars") {
    return starProjects
      .filter((p) => matchesQuery(p, state.query))
      .sort((a, b) => a.rank - b.rank);
  }
  return allProjects
    .filter((project) => state.track === "all" || project.track === state.track)
    .filter((project) => matchesQuery(project, state.query))
    .sort((a, b) => {
      if (state.track !== "all") return a.rank - b.rank;
      return trackOrder(a.track) - trackOrder(b.track) || a.rank - b.rank;
    });
}

export function projectsForTrack(
  trackId: TrackId,
  query: string,
): BoardProject[] {
  return allProjects
    .filter((project) => project.track === trackId)
    .filter((project) => matchesQuery(project, query))
    .sort((a, b) => a.rank - b.rank);
}

// Augment a raw StarProject (fallback or fetched) with board-placement fields,
// matching the shape the original main.js produced via .map().
export function toStarBoardProject(
  star: StarProject,
  index: number,
  locale: Locale = defaultLocale,
): StarBoardProject {
  const recentLabel = locale === "en" ? "Recent" : "近期";
  return {
    id: `stars-${index + 1}`,
    track: "stars",
    rank: index + 1,
    source: "GitHub",
    stack: [
      star.language,
      `+${formatCount(star.deltaStars)} ${recentLabel}`,
      `Trending #${star.trendingRank}`,
    ],
    name: star.name,
    tagline: star.tagline,
    taglineEn: star.taglineEn,
    mvp: star.mvp,
    mvpEn: star.mvpEn,
    wow: star.wow,
    useful: star.useful,
    easy: star.easy,
    url: star.url,
    repo: star.repo,
    language: star.language,
    totalStars: star.totalStars,
    deltaStars: star.deltaStars,
    trendingRank: star.trendingRank,
  };
}

// Re-export so callers can build star board projects from the fallback.
export type { StarProject } from "@/lib/data/types";
import type { StarProject } from "@/lib/data/types";

// Build the full starter plan shown in the plan dialog. Pure: takes the
// project, returns everything the dialog renders (estimate, source urls,
// skills, scale, verdict, prep, risks, codex prompt).
export function buildStarterPlan(project: BoardProject) {
  const track = trackById(project.track);
  const estimate = project.easy >= 78 ? "2-4 小时" : project.easy >= 62 ? "1-2 天" : "3-7 天";
  const sourceName = project.source || project.repo || project.name;
  const sourceUrl = project.url || "#";
  const demoUrl = project.demoUrl || "";
  const primaryUrl = demoUrl || sourceUrl;
  const sourceType = sourceUrl.includes("github.com") ? "GitHub 项目" : "参考项目/官方文档";
  const skills = recommendedSkills(project);
  const scale = projectScale(project);
  const verdict = projectVerdict(project);
  const prepItems = projectPrepItems(project);
  const risks = projectRiskItems(project);
  const skillPromptLines = skills
    .map((skill, index) => `${index + 1}. ${skill.name}：${skill.url}\n   什么时候用：${skillUseReason(project, skill)}`)
    .join("\n");
  const codexPrompt = [
    "你是 Codex，请帮我判断并复现一个 GitHub / 开源项目。",
    "",
    `项目名称：${project.name}`,
    `项目方向：${track?.title ?? ""}`,
    `项目链接：${sourceUrl}`,
    demoUrl ? `演示入口：${demoUrl}` : "",
    `参考来源：${sourceName}`,
    `我想先做出的效果：${project.mvp}`,
    "",
    "请先不要急着写代码，先做一次项目体检：",
    `1. 阅读这个${sourceType}的 README、安装说明、示例和依赖文件。`,
    "2. 基于项目文档和实际依赖，评估它对新手是否值得搓、难度大概在哪里、开工前需要准备什么。",
    "3. 找出最可能卡住的地方，例如 API Key、Docker、数据库、模型、硬件、浏览器权限或网络问题。",
    "4. 如果没有明显硬阻碍，请优先按原项目文档在我电脑上跑起来，不要一上来重写或缩水成简化版。",
    "5. 只有当原项目因为账号、依赖、网络、硬件或服务限制暂时跑不通时，才做保真降级 demo；降级也要保留它最核心、最好玩的玩法和交互。",
    `6. 对这个项目，降级版至少要保留“${project.mvp}”这类核心效果，不能只做一个普通空壳页面。`,
    "7. 遇到报错时，请先定位原因，再给出修复方案，不要盲目重装。",
    "",
    "可参考的 Skill / 工具链接：",
    skillPromptLines,
  ].join("\n");

  return {
    estimate,
    sourceName,
    sourceUrl,
    demoUrl,
    primaryUrl,
    skills,
    scale,
    verdict,
    prepItems,
    risks,
    codexPrompt,
  };
}

export function skillBundleMarkdown(project: BoardProject): string {
  const plan = buildStarterPlan(project);
  const skillLines = plan.skills
    .map(
      (skill, index) =>
        `${index + 1}. [${skill.name}](${skill.url})\n   - 在这个项目里的用法：${skillUseReason(project, skill)}\n   - 推荐理由：${skill.signal}`,
    )
    .join("\n");

  return [
    `# ${project.name} · Skill 开工清单`,
    "",
    `项目来源：${plan.sourceName}`,
    `项目链接：${plan.sourceUrl}`,
    plan.demoUrl ? `演示入口：${plan.demoUrl}` : "",
    `预计用时：${plan.estimate}`,
    "",
    "## 推荐使用的 Skill",
    skillLines,
    "",
    "## 复制给 Codex 的 Prompt",
    plan.codexPrompt,
  ]
    .filter(Boolean)
    .join("\n");
}

// 返回根据 locale 替换好 tagline/mvp 的项目副本（纯函数）。
// 缺失英文字段时回退到原中文值。
export function localizeProject(
  project: BoardProject,
  locale: Locale = defaultLocale
): BoardProject {
  if (locale === "zh") return project;
  return {
    ...project,
    tagline: project.taglineEn || project.tagline,
    mvp: project.mvpEn || project.mvp,
  };
}

