"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { BoardProject, StarBoardProject } from "@/lib/logic/projects";
import {
  filteredProjects,
  projectById,
  projectExperienceTags,
  projectPrimaryActionLabel,
  projectPrimaryUrl,
  projectsForTrack,
  recommendedSkills,
  scoreLabel,
  trackById,
  buildStarterPlan,
  skillUseReason,
  type BoardState,
} from "@/lib/logic/projects";
import type { StarterState } from "@/lib/data/types";
import { starterRecommendations, starterReason } from "@/lib/logic/starter";
import { starterOptions, starterGroupLabels, starterGroupHints, starterGroupStyles, starterLabels } from "@/lib/data/starter";
import { boardThemes, focusHeaderNotes, focusPalettes } from "@/lib/data/board";
import { tracks, boardTabs } from "@/lib/data/tracks";
import { formatCount, formatUpdatedDate } from "@/lib/logic/format";
import { projects as allCuratedProjects } from "@/lib/data/projects";
import { PlanDialog } from "./PlanDialog";

interface IdeaBoardProps {
  starProjects: StarBoardProject[];
  fetchedAt: string;
  trendingSource: "live" | "fallback";
}

const DEFAULT_STARTER: StarterState = {
  time: "weekend",
  goal: "fun",
  skill: "beginner",
  hardware: "none",
};

export function IdeaBoard({ starProjects, fetchedAt, trendingSource }: IdeaBoardProps) {
  const [track, setTrack] = useState<BoardState["track"]>("all");
  const [metric, setMetric] = useState<BoardState["metric"]>("wow");
  const [query, setQuery] = useState("");
  const [starter, setStarter] = useState<StarterState>(DEFAULT_STARTER);
  const [planProjectId, setPlanProjectId] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [pendingQuery, setPendingQuery] = useState(query);

  // Hydrate state from URL on mount (mirrors hydrateStateFromUrl).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("track");
    const m = params.get("metric");
    const q = params.get("q");
    if (t === "all" || boardTabs.some((item) => item.id === t)) setTrack(t as BoardState["track"]);
    if (m && ["wow", "useful", "easy"].includes(m)) setMetric(m as BoardState["metric"]);
    if (q) {
      setQuery(q);
      setPendingQuery(q);
    }
  }, []);

  // Sync state to URL (mirrors syncUrlState).
  const syncUrl = useCallback((next: Partial<BoardState>) => {
    const params = new URLSearchParams(window.location.search);
    if (next.track !== undefined) {
      if (next.track === "all") params.delete("track");
      else params.set("track", next.track);
    }
    if (next.metric !== undefined) {
      if (next.metric === "wow") params.delete("metric");
      else params.set("metric", next.metric);
    }
    if (next.query !== undefined) {
      if (next.query) params.set("q", next.query);
      else params.delete("q");
    }
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, []);

  // Debounced search render, IME-safe (mirrors scheduleSearchRender).
  useEffect(() => {
    if (isComposing) return;
    if (pendingQuery === query) return;
    const t = window.setTimeout(() => {
      setQuery(pendingQuery);
      syncUrl({ query: pendingQuery });
    }, 320);
    return () => window.clearTimeout(t);
  }, [pendingQuery, isComposing, query, syncUrl]);

  const state: BoardState = { track, metric, query };
  const visible = useMemo(
    () => filteredProjects(state, starProjects),
    [state, starProjects],
  );
  const theme = track === "all" ? boardThemes.all : boardThemes[track] ?? boardThemes.all;
  const isFocusedBoard = track !== "all";

  const pool = useMemo<BoardProject[]>(
    () => [...allCuratedProjects, ...starProjects],
    [starProjects],
  );
  const recommendations = useMemo(() => starterRecommendations(starter, pool), [starter, pool]);

  function selectFilter(next: BoardState["track"]) {
    setTrack(next);
    syncUrl({ track: next });
    document.querySelector("#board")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function selectStarter(key: keyof StarterState, value: string) {
    setStarter((s) => ({ ...s, [key]: value }));
    document.querySelector("#starter")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const planProject = planProjectId ? projectById(planProjectId, starProjects) : undefined;

  return (
    <>
      <section className="hero">
        {/* Background Image with Gradient Mask */}
        <div className="hero-bg" />

        <header className="topbar">
          <div className="topbar-inner">
            <a className="brand" href="#top" aria-label="Idea Coding">
              <span className="brand-mark"></span>
              <span>Idea Coding</span>
            </a>
            <nav className="topnav" aria-label="榜单分组">
              {boardTabs.map((t) => (
                <button
                  key={t.id}
                  className={`nav-pill ${track === t.id ? "active" : ""}`}
                  data-track={t.id}
                  onClick={() => selectFilter(t.id as BoardState["track"])}
                >
                  {t.nav ?? t.short}
                </button>
              ))}
            </nav>
          </div>
        </header>

        <div className="hero-shell">
          <div className="hero-grid" id="top">
            {/* LEFT COLUMN */}
            <div className="hero-copy">
              {/* Badge */}
              <div className="animate-fade-in delay-100">
                <div className="hero-badge">
                  <span>Beginner-Friendly</span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>

              {/* Heading */}
              <h1 className="animate-fade-in delay-200">
                <span>Crafting</span>
                <span>Digital</span>
                <br />
                <span className="gradient-text">Experiences</span>
                <br />
                <span>That</span>
                <span>Inspire</span>
              </h1>

              {/* Description */}
              <p className="hero-lede animate-fade-in delay-300">
                给刚开始 Coding 的新手，把好玩、好用、好搓（硬件）三条路线整理成一张 90 项可分享榜单：
                每个项目都有 MVP、体验标签、参考来源和三维评分。现在还能按时间、目标和经验生成适合你的开工清单。
              </p>

              {/* Update Schedule */}
              <div className="update-schedule animate-fade-in delay-400" aria-label="更新时间">
                <span>每天 CNT11:00 更新</span>
                <strong>趣味项目库清单</strong>
                <strong>{pool.length}+ 项目</strong>
              </div>

              {/* CTA Buttons */}
              <div className="hero-actions animate-fade-in delay-400">
                <a className="primary-link" href="#starter">适合我的项目</a>
                <a className="secondary-link" href="#board">查看榜单</a>
                <a className="secondary-link" href="#star-projects">明星项目</a>
              </div>
            </div>

            {/* RIGHT COLUMN - Stats Card */}
            <aside className="hero-panel animate-fade-in delay-500" aria-label="榜单概览">
              {/* Card Glow Effect */}
              <div className="panel-glow" />

              <div className="panel-head">
                <span>Selection Index</span>
                <strong>{pool.length}</strong>
              </div>

              {/* Progress Bar Section */}
              <div className="progress-section">
                <div className="progress-item">
                  <div className="progress-header">
                    <span>趣味项目</span>
                    <strong>30+</strong>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "97%" }}></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-header">
                    <span>实用工具</span>
                    <strong>25+</strong>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "91%" }}></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-header">
                    <span>硬件项目</span>
                    <strong>15+</strong>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "88%" }}></div>
                  </div>
                </div>
              </div>

              <div className="panel-divider" />

              {/* Mini Stats Grid */}
              <div className="mini-stats-grid">
                <div className="stat-item">
                  <span className="stat-value">3+1</span>
                  <span className="stat-label">Tracks</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <span className="stat-value">98</span>
                  <span className="stat-label">Top Score</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <span className="stat-value">1-7d</span>
                  <span className="stat-label">MVP Span</span>
                </div>
              </div>

              {/* Tag Pills */}
              <div className="tag-pills">
                <div className="tag-pill tag-pill-active">
                  <span className="pulse-dot"></span>
                  ACTIVE
                </div>
                <div className="tag-pill">
                  <svg className="w-3 h-3 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  PREMIUM
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <StarShowcase starProjects={starProjects} onSelectTrack={selectFilter} />

      <StarterAdvisor
        recommendations={recommendations}
        starter={starter}
        onSelectStarter={selectStarter}
        poolCount={pool.length}
        onOpenPlan={setPlanProjectId}
      />

      <section
        className={`section-shell board-shell ${isFocusedBoard ? `board-focus board-${track}` : "board-all"}`}
        id="board"
        style={{
          "--mode-primary": theme.primary,
          "--mode-soft": theme.soft,
          "--mode-shadow": theme.shadow,
        } as React.CSSProperties}
      >
        <div className="control-row">
          <div>
            <p className="section-kicker">Project Board</p>
            <h2>按你的目标挑项目</h2>
          </div>
          <div className="controls" aria-label="榜单筛选">
            <div className="segmented" role="tablist" aria-label="分组">
              <button
                data-filter="all"
                className={track === "all" ? "active" : ""}
                onClick={() => selectFilter("all")}
              >
                全部
              </button>
              {boardTabs.map((t) => (
                <button
                  key={t.id}
                  data-filter={t.id}
                  className={track === t.id ? "active" : ""}
                  onClick={() => selectFilter(t.id as BoardState["track"])}
                >
                  {t.nav ?? t.short}
                </button>
              ))}
            </div>
            <label className="search-field">
              <span>Search</span>
              <input
                id="searchInput"
                name="project-search"
                autoComplete="off"
                type="search"
                value={pendingQuery}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={(e) => {
                  setIsComposing(false);
                  setPendingQuery((e.target as HTMLInputElement).value);
                }}
                onChange={(e) => setPendingQuery(e.target.value)}
                placeholder="搜 AI、ESP32、财务…"
              />
            </label>
            <div className="rank-mode" aria-label={track === "all" ? "全品类分列" : "当前榜单顺序"}>
              <span>{track === "all" ? "Layout" : "Order"}</span>
              <strong>{track === "all" ? "三列分榜" : `1 → ${visible.length}`}</strong>
            </div>
          </div>
        </div>

        {isFocusedBoard && trackById(track) && (
          <FocusHeader trackId={track} count={visible.length} />
        )}

        {track === "all" ? (
          <TrackColumns query={query} onOpenPlan={setPlanProjectId} />
        ) : (
          <div className="project-grid" aria-live="polite">
            {visible.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onOpenPlan={setPlanProjectId}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="site-footer" aria-label="网站备案信息">
        <div className="footer-container">
          <p className="footer-sources-label">发现渠道</p>
          <div className="footer-sources">
            <a href="https://github.com/topics/creative-coding" target="_blank" rel="noreferrer">GitHub · creative-coding</a>
            <a href="https://github.com/topics/game-development" target="_blank" rel="noreferrer">GitHub · game-development</a>
            <a href="https://github.com/topics/webgl" target="_blank" rel="noreferrer">GitHub · WebGL</a>
            <a href="https://github.com/topics/canvas" target="_blank" rel="noreferrer">GitHub · Canvas</a>
            <a href="https://github.com/topics/web-audio" target="_blank" rel="noreferrer">GitHub · Web Audio</a>
            <a href="https://github.com/topics/self-hosted" target="_blank" rel="noreferrer">GitHub · self-hosted</a>
            <a href="https://github.com/topics/ai-agents" target="_blank" rel="noreferrer">GitHub · AI agents</a>
            <a href="https://github.com/topics/rag" target="_blank" rel="noreferrer">GitHub · RAG</a>
            <a href="https://github.com/topics/esp32" target="_blank" rel="noreferrer">GitHub · ESP32</a>
            <a href="https://github.com/topics/raspberry-pi" target="_blank" rel="noreferrer">GitHub · Raspberry Pi</a>
            <a href="https://github.com/topics/home-automation" target="_blank" rel="noreferrer">GitHub · home-automation</a>
            <a href="https://github.com/topics/3d-printing" target="_blank" rel="noreferrer">GitHub · 3D printing</a>
            <a href="https://github.com/topics/home-assistant" target="_blank" rel="noreferrer">GitHub · Home Assistant</a>
            <a href="https://github.com/awesome-selfhosted/awesome-selfhosted" target="_blank" rel="noreferrer">Awesome · self-hosted</a>
            <a href="https://github.com/trending?since=weekly" target="_blank" rel="noreferrer">GitHub · Trending weekly</a>
          </div>
          <p className="footer-brand">Idea Coding · Project Discovery for AI Coding Beginners</p>
        </div>
      </footer>

      {planProject && (
        <PlanDialog project={planProject} onClose={() => setPlanProjectId(null)} />
      )}
    </>
  );
}

// --- Star showcase ---

function StarShowcase({
  starProjects,
  onSelectTrack,
}: {
  starProjects: StarBoardProject[];
  onSelectTrack: (t: BoardState["track"]) => void;
}) {
  const lead = starProjects[0];
  const rest = starProjects.slice(1, 6);
  return (
    <section className="star-band" id="star-projects">
      <div className="section-shell star-shell">
        <div className="star-showcase-head">
          <div>
            <p className="section-kicker">Rising This Week</p>
            <h2>明星项目</h2>
            <p>
              本周增长最快的 GitHub 项目，来自 GitHub Trending weekly 候选池，并按 “stars this week” 重新排序。
            </p>
          </div>
          <div className="star-actions">
            <button
              className="star-tab-button"
              type="button"
              onClick={() => onSelectTrack("stars")}
            >
              增长最快的 GitHub 项目
            </button>
            <a href="https://github.com/trending?since=weekly" target="_blank" rel="noreferrer">查看 GitHub 源</a>
          </div>
        </div>
        <div className="star-showcase-grid" aria-label="明星项目展示">
          {lead && <StarCard project={lead} lead />}
          <div className="star-mini-grid">
            {rest.map((p) => (
              <StarCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StarCard({ project, lead }: { project: StarBoardProject; lead?: boolean }) {
  return (
    <a
      className={`star-card ${lead ? "star-card-lead" : ""}`}
      href={project.url}
      target="_blank"
      rel="noreferrer"
    >
      <div className="star-card-top">
        <span>#{project.rank}</span>
        <em>+{formatCount(project.weeklyStars)} / week</em>
      </div>
      <strong>{project.name}</strong>
      <p>{project.tagline}</p>
      <div className="star-card-meta">
        {projectExperienceTags(project, 3).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </a>
  );
}

// --- Starter advisor ---

function StarterAdvisor({
  recommendations,
  starter,
  onSelectStarter,
  poolCount,
  onOpenPlan,
}: {
  recommendations: { project: BoardProject; score: number }[];
  starter: StarterState;
  onSelectStarter: (key: keyof StarterState, value: string) => void;
  poolCount: number;
  onOpenPlan: (id: string) => void;
}) {
  return (
    <section className="section-shell starter-section" id="starter">
      <div className="starter-head">
        <div>
          <p className="section-kicker">Starter Picker</p>
          <h2>先挑 3 个最适合你开工的项目</h2>
        </div>
        <p>选一下时间、目标和硬件意愿，idea 会从 {poolCount} 个候选里给出 3 个更适合现在动手的项目。</p>
      </div>
      <div className="starter-layout">
        <div className="starter-picker" aria-label="新手项目选择器">
          <StarterOrb starter={starter} onSelect={onSelectStarter} />
        </div>
        <div className="starter-results" aria-live="polite">
          {recommendations.map(({ project, score }, index) => (
            <StarterResult
              key={project.id}
              project={project}
              score={score}
              index={index}
              starter={starter}
              onOpenPlan={onOpenPlan}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StarterOrb({
  starter,
  onSelect,
}: {
  starter: StarterState;
  onSelect: (key: keyof StarterState, value: string) => void;
}) {
  return (
    <div className="starter-orb-wrap">
      <div className="starter-orb" role="group" aria-label="气泡标签选择器">
        <div className="starter-orb-core">
          <span>4 组气泡</span>
          <strong>实时推荐</strong>
        </div>
        {(Object.entries(starterOptions) as [keyof StarterState, typeof starterOptions[keyof StarterState]][]).map(
          ([key, options], groupIndex) => (
            <StarterGroup
              key={key}
              groupKey={key}
              options={options}
              groupIndex={groupIndex}
              starter={starter}
              onSelect={onSelect}
            />
          ),
        )}
      </div>
      <div className="starter-active-tags" aria-label="已选标签">
        {(Object.entries(starter) as [keyof StarterState, string][]).map(([key, value]) => (
          <span key={key}>
            <em>{starterGroupLabels[key]}</em>
            <strong>{starterLabels[key][value]}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

function StarterGroup({
  groupKey,
  options,
  groupIndex,
  starter,
  onSelect,
}: {
  groupKey: keyof StarterState;
  options: { id: string; label: string; description: string }[];
  groupIndex: number;
  starter: StarterState;
  onSelect: (key: keyof StarterState, value: string) => void;
}) {
  const style = starterGroupStyles[groupKey] as {
    x: number; y: number; width: number; height: number;
    label: { x: number; y: number };
    tone: string;
    positions: { x: number; y: number }[];
  };
  return (
    <section
      className={`starter-tag-zone starter-tag-zone-${groupKey}`}
      style={{
        "--zone-x": `${style.x}%`,
        "--zone-y": `${style.y}%`,
        "--zone-width": `${style.width}%`,
        "--zone-height": `${style.height}%`,
        "--head-x": `${style.label.x}%`,
        "--head-y": `${style.label.y}%`,
        "--zone-tone": style.tone,
        "--zone-delay": `${groupIndex * -0.8}s`,
      } as React.CSSProperties}
      aria-label={`${starterGroupLabels[groupKey]}选项`}
    >
      <div className="starter-zone-head">
        <strong>{starterGroupLabels[groupKey]}</strong>
        <span>{starterGroupHints[groupKey]}</span>
      </div>
      {options.map((option, index) => {
        const active = starter[groupKey] === option.id;
        const position = style.positions[index % style.positions.length];
        const drift = 3 + ((index + groupIndex) % 3);
        const delay = -0.4 * index - 0.7 * groupIndex;
        return (
          <button
            key={option.id}
            type="button"
            className={`starter-tag ${active ? "active" : ""}`}
            style={{
              "--tag-x": `${position.x}%`,
              "--tag-y": `${position.y}%`,
              "--tag-tone": style.tone,
              "--drift": `${drift}px`,
              "--delay": `${delay}s`,
            } as React.CSSProperties}
            data-starter-key={groupKey}
            data-starter-option={option.id}
            aria-pressed={active}
            aria-label={`${starterGroupLabels[groupKey]}：${option.label}。${option.description}`}
            onClick={() => onSelect(groupKey, option.id)}
          >
            <span className="starter-tag-bubble">
              <strong>{option.label}</strong>
            </span>
          </button>
        );
      })}
    </section>
  );
}

function StarterResult({
  project,
  score,
  index,
  starter,
  onOpenPlan,
}: {
  project: BoardProject;
  score: number;
  index: number;
  starter: StarterState;
  onOpenPlan: (id: string) => void;
}) {
  const t = trackById(project.track);
  return (
    <article className="starter-result-card" style={{ "--track": t?.accent } as React.CSSProperties}>
      <div className="starter-result-top">
        <span>#{index + 1}</span>
        <em>{t?.title}</em>
        <strong>{Math.round(score)}</strong>
      </div>
      <h3>{project.name}</h3>
      <p>{starterReason(project, starter)}</p>
      <div className="feature-list">
        {projectExperienceTags(project, 3).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="starter-result-actions">
        <button
          type="button"
          className="plan-button action-tile"
          onClick={() => onOpenPlan(project.id)}
        >
          <span>能不能搓</span>
          <em>体检 + Prompt</em>
        </button>
        <a className="source-link action-tile" href={project.url} target="_blank" rel="noreferrer">
          <span>看来源</span>
          <em>{project.source}</em>
        </a>
      </div>
    </article>
  );
}

// --- Board sections ---

function FocusHeader({ trackId, count }: { trackId: BoardState["track"]; count: number }) {
  const t = trackById(trackId);
  if (!t) return null;
  return (
    <div className="track-focus-head" style={{ "--track": t.accent } as React.CSSProperties}>
      <div className="focus-mark">
        <span>{t.eyebrow}</span>
        <strong>{t.short}</strong>
      </div>
      <div className="focus-copy">
        <h3>{t.title}</h3>
        <p>{t.summary}</p>
      </div>
      <div className="focus-notes">
        {focusHeaderNotes[t.id].map((note) => (
          <span key={note}>{note}</span>
        ))}
      </div>
      <div className="focus-count" aria-label="当前榜单顺序">
        <span>Order</span>
        <strong>#1 → #{count}</strong>
      </div>
    </div>
  );
}

function TrackColumns({
  query,
  onOpenPlan,
}: {
  query: string;
  onOpenPlan: (id: string) => void;
}) {
  return (
    <div className="project-columns" aria-live="polite">
      {tracks.map((t) => {
        const columnProjects = projectsForTrack(t.id, query);
        return (
          <section
            key={t.id}
            className="project-column"
            style={{ "--track": t.accent } as React.CSSProperties}
            aria-label={t.title}
          >
            <div className="project-column-head">
              <span>{t.eyebrow}</span>
              <strong>{t.title}</strong>
              <em>#1 → #{columnProjects.length}</em>
            </div>
            <div className="project-column-list">
              {columnProjects.length ? (
                columnProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    compact
                    displayRank={project.rank}
                    onOpenPlan={onOpenPlan}
                  />
                ))
              ) : (
                <div className="empty-column">暂无匹配项目</div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ProjectCard({
  project,
  index,
  compact,
  displayRank,
  onOpenPlan,
}: {
  project: BoardProject;
  index: number;
  compact?: boolean;
  displayRank?: number;
  onOpenPlan: (id: string) => void;
}) {
  const t = trackById(project.track);
  const rank = displayRank ?? project.rank;
  const skillCount = recommendedSkills(project, compact ? 2 : 3).length;
  const footerLabel = project.track === "stars" ? "Weekly" : "Skills";
  const footerValue =
    project.track === "stars"
      ? `+${formatCount(project.weeklyStars ?? 0)}`
      : `${skillCount} 个`;
  const skills = recommendedSkills(project, compact ? 2 : 3);
  return (
    <article
      className={`project-card ${compact ? "project-card-compact" : ""} ${project.track === "stars" ? "project-card-star" : ""}`}
      style={{ "--track": t?.accent } as React.CSSProperties}
    >
      <div className="card-topline">
        <span className="rank">#{rank}</span>
        <span className="track-label">{t?.title}</span>
        <span className="grade">{scoreLabel(project)}</span>
      </div>
      <h3>{project.name}</h3>
      <p className="tagline">{project.tagline}</p>
      <div className="feature-list">
        {projectExperienceTags(project, compact ? 3 : 5).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="mvp">
        <span>{compact ? "演示" : "MVP"}</span>
        <p>{project.mvp}</p>
      </div>
      <SkillKit project={project} skills={skills} />
      <footer className="card-footer">
        <div className="card-stat">
          <span>{footerLabel}</span>
          <strong>{footerValue}</strong>
        </div>
        <div className="card-actions">
          <button
            type="button"
            className="plan-button action-tile"
            onClick={() => onOpenPlan(project.id)}
          >
            <span>一键开工</span>
            <em>体检 + Prompt</em>
          </button>
          <a
            className="source-link action-tile"
            href={projectPrimaryUrl(project)}
            target="_blank"
            rel="noreferrer"
          >
            <span>{projectPrimaryActionLabel(project)}</span>
            <em>{project.source}</em>
          </a>
        </div>
      </footer>
    </article>
  );
}

function SkillKit({
  project,
  skills,
}: {
  project: BoardProject;
  skills: { id: string; name: string; signal: string; url: string }[];
}) {
  return (
    <div className="skill-kit">
      <div className="skill-kit-head">
        <span>推荐开工 Skill</span>
      </div>
      <div className="skill-chip-list">
        {skills.map((skill) => (
          <a
            key={skill.id}
            className="skill-chip"
            href={skill.url}
            target="_blank"
            rel="noreferrer"
          >
            <strong>{skill.name}</strong>
            <em>{skill.signal}</em>
          </a>
        ))}
      </div>
    </div>
  );
}
