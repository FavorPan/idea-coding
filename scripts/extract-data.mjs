// One-shot extraction: pulls inline data constants out of src/main.js and
// writes them into lib/data/*.ts as typed TS modules. Run with: node scripts/extract-data.mjs
// Safe because it evaluates the real source (no manual retyping of ~1400 lines of project data).
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const SRC = "src/main.js";
const source = readFileSync(new URL(`../${SRC}`, import.meta.url), "utf8");

// Extract a top-level `const NAME = <literal>;` by slicing from its declaration
// to the next top-level `const ` (or end of file). Then eval the literal.
// globals lets us stub helper functions referenced by the literal (e.g. formatCount).
function extractConst(name, nextName, globals = {}) {
  const marker = `const ${name} = `;
  const start = source.indexOf(marker);
  if (start === -1) throw new Error(`${name} declaration not found`);
  let end = source.length;
  if (nextName) {
    const next = source.indexOf(`\nconst ${nextName} = `, start + marker.length);
    if (next !== -1) end = next;
  }
  const literal = source
    .slice(start + marker.length, end)
    .replace(/;\s*$/, "")
    .trim();
  const globalNames = Object.keys(globals);
  // eslint-disable-next-line no-new-func
  const fn = new Function(...globalNames, `return (${literal});`);
  return fn(...globalNames.map((k) => globals[k]));
}

const tracks = extractConst("tracks", "starTrack");
const starTrack = extractConst("starTrack", "boardTabs");
const skillCatalog = extractConst("skillCatalog", "defaultSkillIds");
const defaultSkillIds = extractConst("defaultSkillIds", "projectSkillOverrides");
const projectSkillOverrides = extractConst(
  "projectSkillOverrides",
  "projectSkillLimits",
);
const projectSkillLimits = extractConst(
  "projectSkillLimits",
  "projectSkillRules",
);
const projectGroups = extractConst("projectGroups", "projects");
// githubStarProjects in main.js is `<array>.map(p => ({...formatCount...}))`.
// Slice off the .map(...) to keep the raw array (formatting belongs in render, not data).
const githubStarProjects = (() => {
  const marker = "const githubStarProjects = ";
  const start = source.indexOf(marker) + marker.length;
  const mapIdx = source.indexOf("].map(", start);
  if (mapIdx === -1) throw new Error("githubStarProjects .map not found");
  const rawArray = source.slice(start, mapIdx + 1).trim(); // include the ]
  // eslint-disable-next-line no-new-func
  return new Function(`return (${rawArray});`)();
})();
const starterOptions = extractConst("starterOptions", "starterGroupLabels");
const starterGroupLabels = extractConst(
  "starterGroupLabels",
  "starterGroupHints",
);
const starterGroupHints = extractConst(
  "starterGroupHints",
  "starterGroupStyles",
);
const starterGroupStyles = extractConst(
  "starterGroupStyles",
  "starterLabels",
);
const starterLabels = extractConst("starterLabels", "starterState", {
  starterOptions,
});
const boardThemes = extractConst("boardThemes", "focusHeaderNotes");
const focusHeaderNotes = extractConst("focusHeaderNotes", "focusPalettes");
const focusPalettes = extractConst("focusPalettes", "app");

// projectSkillRules and projectTagRules/projectTagOverrides are arrays/objects
// that contain RegExp — JSON.stringify drops the regex source, so handle inline.
function extractRaw(name, nextName) {
  const marker = `const ${name} = `;
  const start = source.indexOf(marker);
  if (start === -1) throw new Error(`${name} declaration not found`);
  let end = source.length;
  if (nextName) {
    // Try const, then function, then async function boundaries.
    const candidates = [
      `\nconst ${nextName} = `,
      `\nfunction ${nextName}(`,
      `\nasync function ${nextName}(`,
    ];
    for (const cand of candidates) {
      const next = source.indexOf(cand, start + marker.length);
      if (next !== -1) { end = next; break; }
    }
  }
  return source.slice(start + marker.length, end).replace(/;\s*$/, "").trim();
}

const projectSkillRulesRaw = extractRaw("projectSkillRules", "projectGroups");
const projectTagOverridesRaw = extractRaw(
  "projectTagOverrides",
  "projectTagRules",
);
const projectTagRulesRaw = extractRaw("projectTagRules", "projectExperienceTags");

// --- writers ---
function header() {
  return `// AUTO-GENERATED from src/main.js by scripts/extract-data.mjs.\n// Do not edit by hand — re-run the script after changing main.js.\n`;
}

// Regex literals need to be preserved as-is in TS. For the *Rules arrays we
// embed the raw literal text directly.
writeFileSync(
  new URL("../lib/data/tracks.ts", import.meta.url),
  `${header()}import type { Track } from "./types";\n\nexport const tracks: Track[] = ${JSON.stringify(tracks, null, 2)};\n\nexport const starTrack: Track = ${JSON.stringify(starTrack, null, 2)};\n\nexport const boardTabs: Track[] = [...tracks, starTrack];\n`,
);

writeFileSync(
  new URL("../lib/data/skills.ts", import.meta.url),
  `${header()}import type { Skill, SkillId } from "./types";\n\nexport const skillCatalog: Record<SkillId, Skill> = ${JSON.stringify(skillCatalog, null, 2)};\n\nexport const defaultSkillIds: Record<string, SkillId[]> = ${JSON.stringify(defaultSkillIds, null, 2)};\n\nexport const projectSkillOverrides: Record<string, SkillId[]> = ${JSON.stringify(projectSkillOverrides, null, 2)};\n\nexport const projectSkillLimits: Record<string, number> = ${JSON.stringify(projectSkillLimits, null, 2)};\n\nexport const projectSkillRules: import("./types").ProjectSkillRule[] = ${projectSkillRulesRaw};\n`,
);

writeFileSync(
  new URL("../lib/data/projects.ts", import.meta.url),
  `${header()}import type { Project, TrackId, ProjectTagRule } from "./types";\nimport { tracks } from "./tracks";\n\nexport const projectGroups: Record<Exclude<TrackId, "stars">, Project[]> = ${JSON.stringify(projectGroups, null, 2)};\n\n// Derived: every project tagged with its track id and 1-based rank.\nexport const projects: (Project & { id: string; track: TrackId; rank: number })[] =\n  tracks\n    .filter((t) => t.id !== "stars")\n    .flatMap((track) =>\n      projectGroups[track.id as Exclude<TrackId, "stars">].map((project, index) => ({\n        id: \`\${track.id}-\${index + 1}\`,\n        track: track.id,\n        rank: index + 1,\n        ...project,\n      })),\n    );\n\nexport const projectTagOverrides: Record<string, string[]> = ${JSON.stringify(
  // re-extract the override object as JSON (it has no regex)
  (function () {
    const marker = "const projectTagOverrides = ";
    const start = source.indexOf(marker);
    const next = source.indexOf("\nconst projectTagRules = ", start);
    return Function(`return (${source.slice(start + marker.length, next).replace(/;\s*$/, "").trim()})`)();
  })(),
  null,
  2,
)};\n\nexport const projectTagRules: ProjectTagRule[] = ${projectTagRulesRaw};\n`,
);

writeFileSync(
  new URL("../lib/data/stars.ts", import.meta.url),
  `${header()}import type { StarProject } from "./types";\n\n// Hand-curated fallback used when the live GitHub Trending fetch fails or\n// before the weekly KV snapshot has a previous week to diff against.\nexport const starFallback: StarProject[] = ${JSON.stringify(githubStarProjects, null, 2)};\n`,
);

writeFileSync(
  new URL("../lib/data/starter.ts", import.meta.url),
  `${header()}import type { StarterOption, StarterState } from "./types";\n\nexport const starterOptions: Record<string, StarterOption[]> = ${JSON.stringify(starterOptions, null, 2)};\n\nexport const starterGroupLabels: Record<string, string> = ${JSON.stringify(starterGroupLabels, null, 2)};\n\nexport const starterGroupHints: Record<string, string> = ${JSON.stringify(starterGroupHints, null, 2)};\n\nexport const starterGroupStyles: Record<string, object> = ${JSON.stringify(starterGroupStyles, null, 2)};\n\nexport const starterLabels: Record<string, Record<string, string>> = ${JSON.stringify(starterLabels, null, 2)};\n\nexport const defaultStarterState: StarterState = ${JSON.stringify({ time: "weekend", goal: "fun", skill: "beginner", hardware: "none" }, null, 2)};\n`,
);

writeFileSync(
  new URL("../lib/data/board.ts", import.meta.url),
  `${header()}import type { BoardTheme, TrackId } from "./types";\n\nexport const boardThemes: Record<string, BoardTheme> = ${JSON.stringify(boardThemes, null, 2)};\n\nexport const focusHeaderNotes: Record<TrackId, string[]> = ${JSON.stringify(focusHeaderNotes, null, 2)};\n\nexport const focusPalettes: Record<TrackId, string[]> = ${JSON.stringify(focusPalettes, null, 2)};\n`,
);

console.log("extracted: tracks, skills, projects, stars, starter, board");
console.log("verifying with tsc...");
execSync("pnpm tsc --noEmit", { stdio: "inherit", cwd: process.cwd() });
console.log("done.");
