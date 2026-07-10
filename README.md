<div align="center">

<p>
  <a href="README.md">English</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="README.zh-CN.md">简体中文</a>
</p>

<img src="public/logo.png" alt="Idea Coding logo" width="120" />

# Idea Coding

Project discovery for AI-coding beginners — plus a Codex Skill that recommends projects, skills, and starter prompts from inside a chat.

**Live site:** [https://ideacoding.favorhub.top](https://ideacoding.favorhub.top)

</div>

Idea Coding helps you find a project worth building, see what makes it interesting, match the skills and tools you'll need, and copy a starter prompt you can hand straight to Codex, Cursor, or Claude Code.

- **Web app** — a Next.js board with four tracks: Fun / Useful / Hands-on (hardware) / Fastest-growing GitHub projects.
- **Skill** — a project-recommendation pack that drops into Codex and recommends projects, skills, and starter prompts from inside a conversation.

## What this repo is

One repo, two products:

- A browsable, shareable Next.js board showcasing ~90 hand-curated projects, a skill catalog, and a starter advisor.
- A standalone Codex Skill (`skills/idea-coding/`) that provides the same recommendations inside a chat.

```
components/idea/      # Board UI (IdeaBoard / IdeaCanvas advisor / PlanDialog starter dialog)
lib/data/             # Curated data layer: ~90 projects, four tracks, skill catalog, advisor options
lib/generated/        # Auto-generated data layer (refreshed daily by GitHub Actions — do not edit by hand)
lib/logic/            # Filtering, skill matching, starter-prompt assembly
lib/github/trending.ts  # Star-project data layer
scripts/              # Data-refresh pipeline: discover / ai-evaluate / validate
skills/idea-coding/   # Codex Skill version
public/               # Static SEO topic pages and site files
```

## The four tracks

The board splits every project into one of four tracks, each answering a different flavor of "is this worth building?":

| Track | Focus |
|---|---|
| **Fun** (`fun`) | Instant feedback, highly interactive — something you can ship to show friends in a day. |
| **Useful** (`useful`) | Enters your daily workflow once done; prioritizes info, docs, finance, personal knowledge management. |
| **Hands-on** (`hardware`) | Runs on a small budget with clear hardware feedback — start from ESP32 or Raspberry Pi. |
| **Stars** (`stars`) | GitHub projects with the fastest recent star growth — track open-source releases that are taking off. |

The first three are hand-curated (~90 projects, see `lib/data/`); the Stars track is refreshed daily by GitHub Actions (see `lib/generated/`). All four render uniformly on the board, and each project carries three scores.

## Three scoring dimensions

Every project has three 0–5 scores that help beginners quickly judge "is this worth building?":

- **wow** — surprise / flashiness. Does the finished project make people go "whoa" and want to share it?
- **useful** — practicality. Will it actually enter daily use once built?
- **easy** — beginner-friendliness. Are the steps clear, is there trap-avoidance, is the environment complex?

The board sorts by any dimension and filters by track, so you can pinpoint fast. For example, "Fun + sort by wow" surfaces the flashiest demos; "Useful + sort by useful" surfaces the tools most worth keeping long-term.

## Where the data comes from: the auto-refresh pipeline

The Stars track updates automatically every day. `.github/workflows/data-refresh.yml` runs daily at 11:00 Beijing time in three steps — all must succeed before a commit lands:

1. **Discover** — `scripts/discover-topics.mjs` queries the Search API across 13 GitHub Topics (`creative-coding` / `ai-agents` / `esp32`, etc., hard-mapped onto the `fun` / `useful` / `hardware` tracks), filters out repos with star < 100 or no updates in 12 months, and outputs a candidate list.
2. **Evaluate** — `scripts/ai-evaluate.mjs` reads each candidate's README and issue area, hands them to Agnes AI (`agnes-2.0-flash`) to generate `tagline` / `mvp` / `wow·useful·easy` scores / skill recommendations, and keeps the Top 30 per track.
3. **Validate** — `scripts/validate-data.mjs` runs data-quality checks; on failure it aborts the workflow so the data is never polluted.

On success the results are committed to `lib/generated/`: `stars.ts` (evaluation results), `lastSnapshot.ts` (star snapshot from the previous refresh), and `metadata.ts` (refresh timestamp). **Do not hand-edit this directory** — everything here is script-written.

### How the Stars track is computed

1. The candidate pool comes from the Top projects that passed AI evaluation (carrying pre-filled wow/useful/easy scores and a tagline).
2. At each build, live `stargazers_count` for these repos is fetched concurrently, and the delta is computed as `current total − previous snapshot`, then ranked by delta.
3. The previous snapshot lives in git — Actions runs daily, writing that day's star counts into `lib/generated/lastSnapshot.ts` and committing them. The next build diffs against this snapshot, so the "delta" is really "growth since the last daily refresh".

In other words, the Stars track's "ranking" is computed at build time, and freshness depends on the last build. If no `GITHUB_TOKEN` is configured, star counts are not refreshed live and only the snapshot committed to `lib/generated/` is used.

## Commands

```bash
pnpm dev          # local development
pnpm build        # build (outputs to out/, fully static)
pnpm test         # data-quality tests

pnpm data:refresh # run the data-refresh pipeline once (discover + evaluate + validate)
```

Deployment is split: GitHub Actions only refreshes data and commits `lib/generated/` back to main; after the push to main, the hosting platform's Git integration pulls the code, builds, and deploys. Actions does not build or deploy.

Required environment variables:

- `GITHUB_TOKEN` — used by the data-refresh pipeline to fetch candidate repos (provided automatically by Actions); also used at build time to fetch live star counts. Without it, the Stars track's star counts will not refresh.
- `AGNES_API_KEY` — used for AI evaluation, only needed inside the data-refresh pipeline.

## Starter advisor

The board's "Starter advisor" (IdeaCanvas) is a four-dimension mini-questionnaire that narrows the field for beginners who don't know what to build:

- **Time** — 2 hours today / a 1–2 day weekend / a week, take it slow
- **Goal** — show friends / use daily / build a device / chase the frontier
- **Skill level** — just starting / know a bit / willing to tinker
- **Hardware** — buy nothing / tens of bucks is fine / already have devices

After the four dimensions are picked, the board recommends the best-matched project and generates a **starter prompt** — including the project source links, recommended skills with a per-skill use reason, difficulty estimate, risk list, and prep checklist, assembled into a prompt you can paste straight into Codex / Cursor / Claude Code. This is the project's core deliverable: not just "recommend a project", but "give a beginner a starting point they can act on immediately".

## Skill recommendations

Each project is matched with several skills and tools worth pairing (e.g. an HTML/CSS skill for web projects, a scripting skill for automation). Matching rules live in `lib/data/` and match on project track and tech stack via regex. The starter prompt explains, skill by skill, "where this skill is used in this project", rather than dumping a bare list of tool names.

## Data layer

`lib/data/` is the curated data layer: ~90 projects, four-track definitions, a skill catalog, starter-advisor options, and tag and skill matching rules. Edit these `.ts` files directly by hand — the `AUTO-GENERATED` header at the top is a historical leftover; there is no generator script anymore. When adding, removing, or renaming a project, remember to update `projectTagOverrides` and `projectTagRules` / `projectSkillRules` in the same file, or tags and skill matching will drift out of sync.

## Codex Skill

`skills/idea-coding/SKILL.md` is self-contained: its workflow reads `references/projects.md`, `references/skills.md`, `references/starter-prompts.md`. The Skill's content is **maintained separately** from the web app's `lib/data/` — if you reconcile project / skill recommendations between the two, update both.

Built-in Skill path:

```text
skills/idea-coding/
```

You can install this directory into Codex's Skills directory, or have a Skill-aware agent read it directly.

### Invocation examples

```text
Use Idea Coding to find 5 fun beginner-friendly Vibe Coding projects.
For each: why it's worth building, recommended skills/tools, GitHub or source links, and a starter prompt to copy into Codex.
```

```text
I want to build a small AI web page I can share on social — find me a project and give me a starter prompt.
```

```text
I'm working on web / slides / deployment / automation — what skills are worth installing?
```

## Static SEO content

`public/guides/` and `public/projects/` are hand-authored static HTML topic pages aimed at search engines and AI crawlers. `public/llms.txt`, `public/sitemap.xml`, `public/feed.xml`, and `public/robots.txt` are also hand-maintained. `scripts/check-geo-seo.mjs` and `scripts/submit-indexnow.mjs` are standalone SEO helpers (IndexNow ping, geo/SEO checks), unrelated to the Next.js build.

## Testing

The single test suite [test/project-data-quality.test.mjs](test/project-data-quality.test.mjs) guards data quality for the first 30 `fun` projects: it asserts specific URLs / demo links are not stale or archived, that library-like recommendations are labeled as references, and that [test/first-page-project-audit.md](test/first-page-project-audit.md) covers exactly those 30 rows. The test loads `projectGroups` by eval-ing the object literal out of `lib/data/projects.ts` (not via a TS import). When you change a `fun` project's name / url / demoUrl, expect this suite and the audit markdown to need updating in lockstep.

## Good for

- Finding a Vibe Coding project suited to beginners.
- Finding a project that's fun, useful, deployable, shareable, or weekend-friendly.
- Finding skills / tools suited to AI-coding beginners.
- Generating a starter prompt for a project that you can paste straight into Codex.
- Maintaining your own project board, skill list, or AI-coding resource site.

## License

Code, Skill workflow, prompt templates, and the project-curation format use the MIT License.

The `Idea Coding` name, the `ideacoding.favorhub.top` domain, and the project's visual identity are not covered by the MIT license. You may fork, modify, and remix, but please use a different name for any public derivative and do not imply official affiliation. See [TRADEMARK.md](TRADEMARK.md).

## Contributing

Contributions welcome:

- New Vibe Coding project sources.
- More accurate GitHub / demo links.
- Skill / tool recommendations better suited to beginners.
- Clearer starter-prompt templates.
- Improvements to layout, accessibility, and mobile experience.

Please include project sources, GitHub links, demo links, or evidence of community traction where possible.
