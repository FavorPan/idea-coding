# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Idea Coding is a project-discovery site for AI-coding beginners, plus a Codex Skill that recommends projects/skills/starter-prompts from inside a chat. The live site is https://ideacoding.favorhub.top. Content is in Chinese (zh-CN) by default.

The repo ships two parallel products:
- A Next.js web app (the board you browse).
- A Codex Skill at `skills/idea-coding/` (read by Skill-aware agents; has its own `SKILL.md` + `references/*.md`).

## Commands

```bash
pnpm dev          # Next.js dev server
pnpm build        # production build
pnpm test         # node --test test/project-data-quality.test.mjs (the only test suite)
node --test test/project-data-quality.test.mjs   # run the suite directly
```

This is a **static export** site (`output: "export"` in [next.config.ts](next.config.ts)). `pnpm build` emits a fully static site to `out/` — no server runtime, no edge worker. Deploy `out/` to any static host (Cloudflare Pages, GitHub Pages, Netlify, etc.).

There is **no lint script and no tsc script in package.json**. Type-checking happens implicitly during `next build`, and `scripts/extract-data.mjs` runs `pnpm tsc --noEmit` as its final step.

```bash
pnpm dev          # Next.js dev server
pnpm build        # static export → out/
pnpm test         # node --test test/project-data-quality.test.mjs
```

## Architecture

### Data flow: build-time trending → static board

`app/page.tsx` is an async Server Component that resolves trending data **at build time** (static export — no request-time execution). It calls `getTrending()`, which calls `fetchTrending()` in [lib/github/trending.ts](lib/github/trending.ts). The result (`StarBoardProject[]` + `fetchedAt` + `source`) is passed down to `<IdeaBoard>`, the top-level client component, and frozen into the prerendered HTML.

The trending strategy: read the candidate repo pool from `lib/generated/stars.ts` (committed daily by GitHub Actions; falls back to hand-curated `starFallback` when empty), fetch live `stargazers_count` for each via the GitHub REST API at build time, compute the delta against the previous-run snapshot in `lib/generated/lastSnapshot.ts`, rank by delta. Three-layer fallback:
- **No `GITHUB_TOKEN` at build** → live fetching is skipped; returns `starFallback`/generated data as-is (source: `"fallback"`). Live fetching only runs when a token is present.
- **API fails / returns nothing** → same fallback.
- **No prior snapshot** → `deltaStars` falls back to the curated value in `starFallback`.

Git is the snapshot store: each Actions run commits both the current star counts and the previous snapshot, so the next build can diff week-over-week. To refresh the board, rebuild via GitHub Actions (which also runs `data:refresh`).

### The data layer is the heart of the project

[lib/data/](lib/data/) holds ~90 curated projects across four tracks (`fun`, `useful`, `hardware`, `stars`), a skill catalog, starter-advisor options, and tag/skill-matching rules. [lib/data/types.ts](lib/data/types.ts) is the canonical type source. `BoardProject` is the unified render shape — curated projects and star projects are both normalized into it so `<IdeaBoard>` treats them uniformly (see `toStarBoardProject`).

### Pure logic, no globals

[lib/logic/projects.ts](lib/logic/projects.ts) and [lib/logic/starter.ts](lib/logic/starter.ts) are pure: callers pass `state` (track/metric/query) and `starProjects` explicitly. This is intentional so the same logic works in Server and Client Components without module cycles. When adding logic, keep it pure and take star projects as a parameter — don't reach for module-level state.

The plan dialog (`buildStarterPlan` in projects.ts) assembles the copyable Codex prompt — estimate, source URLs, recommended skills with per-skill use reasons (`SKILL_USE_REASONS` map), difficulty scale, verdict, prep checklist, risk list, and the final prompt text.

## Critical: data files are source of truth, NOT auto-generated

The files in `lib/data/*.ts` (`projects.ts`, `tracks.ts`, `skills.ts`, `stars.ts`, `starter.ts`, `board.ts`) carry `// AUTO-GENERATED from src/main.js by scripts/extract-data.mjs` headers. **This is stale.** `src/main.js` no longer exists in this repo (the static-site era is over; the repo is now Next.js-only). Running `node scripts/extract-data.mjs` will **fail** because it reads `src/main.js`.

**Edit `lib/data/*.ts` directly by hand.** Treat the "AUTO-GENERATED" headers as historical noise. Do not attempt to re-run the extract script unless you first restore a `src/main.js`. If you add/remove/rename a project, also update `projectTagOverrides` and the regex-based `projectTagRules` / `projectSkillRules` in the same file so tag and skill matching stays consistent.

(The README and `scripts/extract-data.mjs` comments referencing `index.html`, `skills.html`, `codex-uses.html`, `src/main.js`, and `python3 -m http.server` are leftover from the pre-Next.js static site and no longer apply.)

## Testing

The single test suite [test/project-data-quality.test.mjs](test/project-data-quality.test.mjs) guards data quality for the first 30 `fun` projects: it asserts specific URLs/demo links are not stale/archived, that library-like recommendations are labeled as references, and that [test/first-page-project-audit.md](test/first-page-project-audit.md) covers exactly those 30 rows. The test loads `projectGroups` by eval-ing the object literal out of `lib/data/projects.ts` (not via a TS import). When you change a `fun` project's name/url/demoUrl, expect this suite to need updating — the audit markdown must stay in lockstep with the data.

## The Codex Skill

`skills/idea-coding/SKILL.md` is self-contained: its workflow reads `references/projects.md`, `references/skills.md`, `references/starter-prompts.md`. The Skill's content is maintained separately from the web app's `lib/data/` — if you reconcile project/skill recommendations between the two, update both places.

## Static SEO content

`public/guides/` and `public/projects/` hold hand-authored static HTML topic pages for search engines and AI crawlers. `public/llms.txt`, `public/sitemap.xml`, `public/feed.xml`, `public/robots.txt` are also maintained by hand. `scripts/check-geo-seo.mjs` and `scripts/submit-indexnow.mjs` are standalone SEO helpers (IndexNow ping, geo/SEO checks), unrelated to the Next.js build.
