// 发现脚本:对 13 个 GitHub Topics 调 Search API,拉候选仓库列表。
// 用法: node scripts/discover-topics.mjs
// 输出: lib/generated/temp-candidates.json (供 ai-evaluate.mjs 消费)

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// 13 个 topics → 轨道映射(唯一的人工映射,写死不再动)
const TOPIC_TRACK_MAP = {
  // fun
  "creative-coding": "fun",
  "game-development": "fun",
  webgl: "fun",
  canvas: "fun",
  "web-audio": "fun",
  // useful
  "self-hosted": "useful",
  "ai-agents": "useful",
  rag: "useful",
  // hardware
  esp32: "hardware",
  "raspberry-pi": "hardware",
  "home-automation": "hardware",
  "3d-printing": "hardware",
  "home-assistant": "hardware",
};

const TOPICS = Object.keys(TOPIC_TRACK_MAP);

// 每个 topic 最多拉多少个仓库
const PER_PAGE = 30;
// 每个 topic 最多保留多少个进入 AI 评估阶段
const MAX_PER_TOPIC = 10;

// 过滤条件
const MIN_STARS = 100;          // star 数低于此的不要
const MAX_STALE_MONTHS = 12;    // 超过此月未更新的不要

// 并发控制:避免 GitHub 限流
const CONCURRENCY = 3;

// 工具函数:带重试的 fetch
async function fetchWithRetry(url, options = {}, retries = 3) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "idea-coding-data-refresh",
    ...options.headers,
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { ...options, headers });

      if (res.status === 403) {
        const reset = res.headers.get("X-RateLimit-Reset");
        const remaining = res.headers.get("X-RateLimit-Remaining");
        if (reset && remaining === "0") {
          const waitSec = Math.max(0, parseInt(reset) * 1000 - Date.now());
          console.warn(`  ⏳ Rate limited. Waiting ${Math.ceil(waitSec / 1000)}s...`);
          await new Promise((r) => setTimeout(r, waitSec + 1000));
          continue;
        }
      }

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

// 拉一个 topic 的仓库列表
async function fetchTopicRepos(topic) {
  const url = `https://api.github.com/search/repositories?q=topic:${encodeURIComponent(topic)}+is:public&sort=stars&order=desc&per_page=${PER_PAGE}`;
  const res = await fetchWithRetry(url);

  if (!res.ok) {
    console.error(`  ❌ Failed to fetch topic "${topic}": ${res.status}`);
    return [];
  }

  const data = await res.json();
  return (data.items || []).map((repo) => ({
    topic,
    repo: repo.full_name,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || null,
    language: repo.language || null,
    stargazersCount: repo.stargazers_count,
    pushedAt: repo.pushed_at,
    archived: repo.archived,
    fork: repo.fork,
    url: repo.html_url,
    topics: repo.topics || [],
  }));
}

// 过滤仓库
function filterRepos(repos, topic) {
  const now = new Date();
  const staleThreshold = new Date(now);
  staleThreshold.setMonth(staleThreshold.getMonth() - MAX_STALE_MONTHS);

  return repos.filter((repo) => {
    if (repo.archived) return false;
    if (repo.fork) return false;
    if (repo.stargazersCount < MIN_STARS) return false;

    const pushed = new Date(repo.pushedAt);
    if (pushed < staleThreshold) return false;

    return true;
  });
}

// 并发控制版 Promise.all
async function runWithConcurrency(tasks, limit) {
  const results = [];
  const executing = new Set();

  for (const task of tasks) {
    const p = task().then((result) => {
      executing.delete(p);
      return result;
    });
    executing.add(p);
    results.push(p);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

// 主函数
async function main() {
  console.log("🔍 Idea Coding — GitHub Topics Discovery\n");
  console.log(`📡 Fetching ${TOPICS.length} topics...`);

  const start = Date.now();
  const allResults = [];

  // 分批并发,避免同时开太多连接
  for (let i = 0; i < TOPICS.length; i += CONCURRENCY) {
    const batch = TOPICS.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(async (topic) => {
        process.stdout.write(`  [${i / CONCURRENCY + 1}/${Math.ceil(TOPICS.length / CONCURRENCY)}] ${topic}... `);
        const repos = await fetchTopicRepos(topic);
        const filtered = filterRepos(repos, topic);
        // 每个 topic 只保留 star 最高的前 MAX_PER_TOPIC 个
        filtered.sort((a, b) => b.stargazersCount - a.stargazersCount);
        const capped = filtered.slice(0, MAX_PER_TOPIC);
        console.log(`${repos.length} → ${filtered.length} → ${capped.length} passed`);
        return { topic, repos: capped };
      })
    );
    allResults.push(...batchResults);
  }

  // 合并所有 topic 的结果,按 star 降序
  const allRepos = allResults.flatMap((b) => b.repos);
  allRepos.sort((a, b) => b.stargazersCount - a.stargazersCount);

  // 去重(同一仓库可能在多个 topic 里出现)
  const seen = new Set();
  const unique = allRepos.filter((r) => {
    if (seen.has(r.fullName)) return false;
    seen.add(r.fullName);
    return true;
  });

  // 加上轨道信息
  const withTrack = unique.map((r) => ({
    ...r,
    track: TOPIC_TRACK_MAP[r.topic],
  }));

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log(`\n✅ Done in ${elapsed}s`);
  console.log(`   Topics: ${TOPICS.length}`);
  console.log(`   Total candidates (after dedup): ${allRepos.length}`);
  console.log(`   Passed filters: ${withTrack.length}`);

  // 打印每个轨道的分布
  const byTrack = {};
  for (const r of withTrack) {
    byTrack[r.track] = (byTrack[r.track] || 0) + 1;
  }
  console.log(`   By track: ${JSON.stringify(byTrack)}`);

  // 写临时文件供 ai-evaluate.mjs 消费
  const outPath = path.join(ROOT, "lib", "generated", "temp-candidates.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(withTrack, null, 2), "utf-8");
  console.log(`\n📄 Wrote candidates to lib/generated/temp-candidates.json`);

  // 也打印 Top 5 供人工检查
  console.log(`\n📋 Top 5 by stars:`);
  withTrack.slice(0, 5).forEach((r, i) => {
    console.log(`   ${i + 1}. ${r.fullName} (${r.stargazersCount}★) [${r.track}]`);
    console.log(`      ${r.description || "(no description)"}`);
  });
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err.message);
  process.exit(1);
});
