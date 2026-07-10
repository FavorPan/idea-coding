// 数据质量校验脚本:检查生成的 stars.ts 是否有问题
// 用法: node scripts/validate-data.mjs
// 退出码:0 = 通过,1 = 有错误(但仍写日志,让 Actions 决定是否 abort)

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const STARS_FILE = path.join(ROOT, "lib", "generated", "stars.ts");
const ERRORS = [];
const WARNINGS = [];

function error(msg) { ERRORS.push(msg); }
function warn(msg) { WARNINGS.push(msg); }

// ── Required fields check ─────────────────────────────────────────────────────
function validateRequiredFields(stars) {
  const required = ["repo", "name", "tagline", "mvp", "url", "wow", "useful", "easy"];
  stars.forEach((s, i) => {
    required.forEach((field) => {
      if (s[field] == null || s[field] === "") {
        error(`[${i + 1}] ${s.repo}: missing required field "${field}"`);
      }
    });
    // Score ranges
    if (s.wow < 0 || s.wow > 100) error(`[${i + 1}] ${s.repo}: wow=${s.wow} out of range [0,100]`);
    if (s.useful < 0 || s.useful > 100) error(`[${i + 1}] ${s.repo}: useful=${s.useful} out of range [0,100]`);
    if (s.easy < 0 || s.easy > 100) error(`[${i + 1}] ${s.repo}: easy=${s.easy} out of range [0,100]`);
    // URL format
    if (s.url && !s.url.startsWith("https://github.com/")) {
      warn(`[${i + 1}] ${s.repo}: url "${s.url}" doesn't look like a GitHub repo URL`);
    }
  });
}

// ── Duplicate check ───────────────────────────────────────────────────────────
function validateNoDuplicates(stars) {
  const seen = new Set();
  stars.forEach((s, i) => {
    if (seen.has(s.repo)) {
      error(`[${i + 1}] Duplicate repo: ${s.repo}`);
    }
    seen.add(s.repo);
  });
}

// ── Content quality check ─────────────────────────────────────────────────────
function validateContentQuality(stars) {
  stars.forEach((s) => {
    // tagline 太短或无意义
    if (s.tagline && s.tagline.length < 5) {
      warn(`${s.repo}: tagline too short: "${s.tagline}"`);
    }
    // mvp 没有"先做"
    if (s.mvp && !s.mvp.startsWith("先做") && !s.mvp.startsWith("先构建")) {
      warn(`${s.repo}: mvp doesn't start with "先做/先构建": "${s.mvp}"`);
    }
    // taglineEn / mvpEn bilingual field checks (warning-level, non-blocking)
    if (!s.taglineEn) {
      warn(`${s.repo}: missing taglineEn (English tagline)`);
    }
    if (!s.mvpEn) {
      warn(`${s.repo}: missing mvpEn (English MVP description)`);
    }
    if (s.mvpEn && !s.mvpEn.startsWith("First build")) {
      warn(`${s.repo}: mvpEn doesn't start with "First build": "${s.mvpEn}"`);
    }
    if (s.taglineEn && s.taglineEn.length > 30) {
      warn(`${s.repo}: taglineEn too long (${s.taglineEn.length} chars): "${s.taglineEn}"`);
    }
    // 评分全一样(可能是 AI 偷懒)
    if (s.wow === s.useful && s.useful === s.easy && s.wow === 50) {
      warn(`${s.repo}: all three scores are 50 — possible AI laziness`);
    }
    // star 数为 0 且不是新项目
    if (!s.totalStars && !s.deltaStars) {
      warn(`${s.repo}: no star data available`);
    }
  });
}

// ── Track coverage check ──────────────────────────────────────────────────────
function validateTrackCoverage(stars) {
  const tracks = {};
  stars.forEach((s) => {
    tracks[s.track] = (tracks[s.track] || 0) + 1;
  });
  const minPerTrack = 3;
  Object.entries(tracks).forEach(([track, count]) => {
    if (count < minPerTrack) {
      warn(`Track "${track}" has only ${count} projects (minimum ${minPerTrack})`);
    }
  });
  return tracks;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🔍 Idea Coding — Data Validation\n");

  if (!fs.existsSync(STARS_FILE)) {
    error(`Stars file not found: ${STARS_FILE}`);
  } else {
    // 从 TypeScript 文件里提取 JSON (简单粗暴,不用 eval)
    const content = fs.readFileSync(STARS_FILE, "utf-8");
    const match = content.match(/export const generatedStars: StarProject\[\] = (\[[\s\S]*?\]);?$/);
    if (!match) {
      error("Could not parse generatedStars from stars.ts");
    } else {
      try {
        // 把 TypeScript 类型去掉,只留 JSON
        const jsonStr = match[1]
          .replace(/:\s*\w+\[\]/g, "")   // 去掉类型注解
          .replace(/:\s*\w+/g, "")        // 去掉字段类型
          .replace(/StarProject/g, "");
        const stars = JSON.parse(jsonStr);
        console.log(`📋 ${stars.length} projects to validate`);

        validateRequiredFields(stars);
        validateNoDuplicates(stars);
        validateContentQuality(stars);
        const tracks = validateTrackCoverage(stars);

        console.log(`\n📊 Track coverage: ${JSON.stringify(tracks)}`);
      } catch (err) {
        error(`Parse error: ${err.message}`);
      }
    }
  }

  // 输出报告
  console.log(`\n${"─".repeat(50)}`);
  if (ERRORS.length > 0) {
    console.error(`\n❌ ERRORS (${ERRORS.length}):`);
    ERRORS.forEach((e) => console.error(`  • ${e}`));
  }
  if (WARNINGS.length > 0) {
    console.warn(`\n⚠️  WARNINGS (${WARNINGS.length}):`);
    WARNINGS.forEach((w) => console.warn(`  • ${w}`));
  }

  if (ERRORS.length > 0) {
    console.error(`\n❌ Validation FAILED with ${ERRORS.length} error(s)`);
    process.exit(1);
  }

  if (WARNINGS.length > 0) {
    console.warn(`\n✅ Validation PASSED with ${WARNINGS.length} warning(s)`);
  } else {
    console.log(`\n✅ Validation PASSED`);
  }

  process.exit(0);
}

main();
