// 抓取脚本:从 https://github.com/trending 多语言视图拉项目,关键词过滤后输出候选列表。
// 用法:
//   node scripts/fetch-trending.mjs            # 正式:写 lib/generated/temp-candidates.json
//   node scripts/fetch-trending.mjs --dry-run  # 只抓取打印,不写文件
// 输出: lib/generated/temp-candidates.json (供 ai-evaluate.mjs 消费,字段与旧 discover-topics.mjs 兼容)

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── Config ───────────────────────────────────────────────────────────────────
// 抓哪些语言视图。空字符串 "" = 无语言总榜。AI coding 高频语言优先。
const LANGUAGES = ["", "python", "typescript", "javascript"];
const SINCE = "daily"; // daily / weekly / monthly
const MAX_CANDIDATES = 50; // 最终保留多少个进入 AI 评估

// 关键词过滤:description 或 repo 名命中任一即保留(大小写不敏感)。
// 目的是从 trending 榜(不分主题)里筛出与 AI coding 相关的项目。
const KEEP_KEYWORDS = [
  "ai", "agent", "llm", "gpt", "claude", "codex", "copilot", "cursor",
  "coding", "code-gen", "codegen", "vibe", "mcp", "rag", "embedding",
  "assistant", "chatbot", "prompt", "diffusion", "stable-diffusion",
  "transformer", "huggingface", "langchain", "autogen", "ollama",
  "openai", "anthropic", "gemini", "whisper", "tts", "stt",
  "self-host", "selfhost", "automation", "workflow", "pipeline",
  "browser-use", "playwright", "scrape", "crawler",
];

// 明确排除的关键词(即便命中 KEEP 也丢):纯 awesome-list / 配置 / 面经 / 榜单本身。
const EXCLUDE_KEYWORDS = ["awesome-list", "dotfiles", "interview", "roadmap", "cheatsheet", "study"];

const CONCURRENCY = 4;

// ── HTTP helpers ─────────────────────────────────────────────────────────────
async function fetchWithRetry(url, options = {}, retries = 3) {
  const headers = {
    Accept: "text/html,application/xhtml+xml",
    "User-Agent": "idea-coding-data-refresh",
    ...options.headers,
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { ...options, headers });
      if (!res.ok && attempt < retries) {
        const wait = (attempt + 1) * 2000;
        console.warn(`  ⚠️  ${res.status} ${res.statusText}, retry in ${wait}ms...`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, (attempt + 1) * 2000));
    }
  }
  throw new Error(`Failed after ${retries} retries: ${url}`);
}

// ── GitHub API:拿准确的 stargazers_count(trending 页 star 数是约数)────────
async function ghFetch(url, retries = 2) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "idea-coding-data-refresh",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { headers });
      if (res.status === 403) {
        const remaining = res.headers.get("X-RateLimit-Remaining");
        const reset = res.headers.get("X-RateLimit-Reset");
        if (remaining === "0" && reset) {
          const waitMs = Math.max(0, parseInt(reset) * 1000 - Date.now()) + 1000;
          console.warn(`  ⏳ Rate limited, waiting ${Math.ceil(waitMs / 1000)}s...`);
          await new Promise((r) => setTimeout(r, waitMs));
          continue;
        }
      }
      if (!res.ok && i < retries) {
        await new Promise((r) => setTimeout(r, (i + 1) * 1500));
        continue;
      }
      return res;
    } catch (e) {
      if (i === retries) throw e;
      await new Promise((r) => setTimeout(r, (i + 1) * 1500));
    }
  }
  return null;
}

async function fetchRepoStars(repo) {
  const res = await ghFetch(`https://api.github.com/repos/${repo}`);
  if (!res || !res.ok) return null;
  try {
    const data = await res.json();
    return {
      stargazersCount: data.stargazers_count,
      language: data.language || null,
      description: data.description || null,
    };
  } catch {
    return null;
  }
}

// ── Trending 页解析 ──────────────────────────────────────────────────────────
// 解析单个 <article class="Box-row"> 的 HTML 片段,提取 repo 信息。
function parseArticle(html) {
  // repo 全名:h2 里的 <a href="/owner/repo">
  const hrefMatch = html.match(/<h2[^>]*>\s*<a[^>]*href="\/([^"]+)"/);
  if (!hrefMatch) return null;
  const fullName = hrefMatch[1].replace(/^\/+/, "");
  if (!fullName.includes("/")) return null; // 必须是 owner/repo

  // description:<p class="col-9 ...">...</p>
  const descMatch = html.match(/<p[^>]*class="[^"]*col-9[^"]*"[^>]*>([\s\S]*?)<\/p>/);
  const description = descMatch ? stripTags(descMatch[1]).trim() : "";

  // 语言:<span itemprop="programmingLanguage">
  const langMatch = html.match(/<span[^>]*itemprop="programmingLanguage"[^>]*>([^<]+)<\/span>/);
  const language = langMatch ? langMatch[1].trim() : null;

  // 今日新增 star:<span ...>N stars today</span>
  const todayMatch = html.match(/(\d[\d,]*)\s+stars?\s+(today|this week|this month)/i);
  const starsToday = todayMatch ? parseInt(todayMatch[1].replace(/,/g, "")) : 0;

  return {
    repo: fullName,
    name: fullName.split("/")[1],
    fullName,
    description,
    language,
    starsToday,
    url: `https://github.com/${fullName}`,
  };
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ");
}

// 抓一个 trending 视图(某语言 / since 窗口),返回解析出的 repo 数组。
async function fetchTrendingView(language) {
  const langPart = language ? `${language}/` : "";
  const url = `https://github.com/trending/${langPart}?since=${SINCE}`;
  const res = await fetchWithRetry(url);
  if (!res.ok) {
    console.error(`  ❌ Failed to fetch trending (${language || "all"}): ${res.status}`);
    return [];
  }
  const html = await res.text();

  // 拆成一个个 article.Box-row
  const articles = html.match(/<article[^>]*class="[^"]*Box-row[^"]*"[\s\S]*?<\/article>/g) || [];
  const parsed = articles.map(parseArticle).filter(Boolean);

  console.log(`  📥 ${language || "all"}: ${parsed.length} repos`);
  return parsed;
}

// ── 过滤 ──────────────────────────────────────────────────────────────────────
function matchesKeywords(repo) {
  const haystack = `${repo.fullName} ${repo.description}`.toLowerCase();
  // 用词边界匹配,避免 "ai" 命中 "available"/"certain"、"rag" 命中 "fragments" 之类的误伤。
  // 含连字符的关键词(self-host)单独处理:连字符在 \w 边界外,直接 includes 即可。
  const wordKws = KEEP_KEYWORDS.filter((kw) => !kw.includes("-") && !kw.includes(" "));
  const substrKws = KEEP_KEYWORDS.filter((kw) => kw.includes("-") || kw.includes(" "));
  const kept =
    wordKws.some((kw) => new RegExp(`\\b${kw}\\b`).test(haystack)) ||
    substrKws.some((kw) => haystack.includes(kw));
  if (!kept) return false;
  const excluded = EXCLUDE_KEYWORDS.some((kw) => haystack.includes(kw));
  return !excluded;
}

// ── 并发控制 ──────────────────────────────────────────────────────────────────
async function runWithConcurrency(items, limit, worker) {
  const results = [];
  const executing = new Set();
  for (const item of items) {
    const p = worker(item).then((r) => { executing.delete(p); return r; });
    executing.add(p);
    results.push(p);
    if (executing.size >= limit) await Promise.race(executing);
  }
  return Promise.all(results);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const dryRun = process.argv.includes("--dry-run");
  console.log("🔍 Idea Coding — GitHub Trending Fetch\n");
  console.log(`📡 Languages: [${LANGUAGES.map((l) => l || "all").join(", ")}], since=${SINCE}`);

  const start = Date.now();

  // 1. 抓所有语言视图
  const views = await runWithConcurrency(LANGUAGES, CONCURRENCY, fetchTrendingView);
  let all = views.flat();

  // 2. 去重(多语言视图会重叠)
  const seen = new Set();
  all = all.filter((r) => {
    if (seen.has(r.fullName)) return false;
    seen.add(r.fullName);
    return true;
  });
  console.log(`\n🧹 After dedup: ${all.length} repos`);

  // 3. 关键词过滤
  const filtered = all.filter(matchesKeywords);
  console.log(`🎯 After keyword filter: ${filtered.length} repos`);

  if (filtered.length === 0) {
    console.error("❌ No repos passed keyword filter. Aborting.");
    process.exit(1);
  }

  // 4. 拉准确的 stargazers_count(并发,失败的项目用 starsToday 排序兜底)
  console.log(`\n⭐ Fetching accurate star counts for ${filtered.length} repos...`);
  const withStars = await runWithConcurrency(filtered, CONCURRENCY, async (r) => {
    const stats = await fetchRepoStars(r.fullName);
    return {
      ...r,
      stargazersCount: stats?.stargazersCount ?? 0,
      language: stats?.language ?? r.language,
      description: stats?.description || r.description,
    };
  });

  // 5. 按 star 降序取 Top N
  withStars.sort((a, b) => b.stargazersCount - a.stargazersCount);
  const capped = withStars.slice(0, MAX_CANDIDATES);

  // 6. 整理成 ai-evaluate.mjs 兼容的 candidate 格式
  const candidates = capped.map((r) => ({
    repo: r.fullName,
    name: r.name,
    fullName: r.fullName,
    description: r.description,
    language: r.language,
    stargazersCount: r.stargazersCount,
    url: r.url,
    track: "stars",     // trending 统一归 stars 轨道(ai-evaluate 的 rankProjects 会用到)
    topic: "trending",  // 仅用于 metadata 记录
  }));

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✅ Done in ${elapsed}s`);
  console.log(`   Final candidates: ${candidates.length}`);

  // Top 5 供人工检查
  console.log(`\n📋 Top 5 by stars:`);
  candidates.slice(0, 5).forEach((r, i) => {
    console.log(`   ${i + 1}. ${r.fullName} (${r.stargazersCount}★) [${r.language || "?"}]`);
    console.log(`      ${r.description || "(no description)"}`);
  });

  if (dryRun) {
    console.log(`\n💨 Dry-run mode — not writing files.`);
    return;
  }

  const outPath = path.join(ROOT, "lib", "generated", "temp-candidates.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(candidates, null, 2), "utf-8");
  console.log(`\n📄 Wrote ${candidates.length} candidates to lib/generated/temp-candidates.json`);
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err.message);
  process.exit(1);
});
