// Core domain types for Idea Coding.
// These mirror the inline data shapes in the original src/main.js.

export type TrackId = "fun" | "useful" | "hardware" | "stars";

export interface Track {
  id: TrackId;
  eyebrow: string;
  title: string;
  short: string;
  nav?: string;
  accent: string;
  summary: string;
  eyebrowEn?: string;
  titleEn?: string;
  shortEn?: string;
  navEn?: string;
  summaryEn?: string;
}

// A curated project in one of the fun/useful/hardware tracks.
export interface Project {
  name: string;
  tagline: string;
  stack: string[];
  mvp: string;
  nameEn?: string;
  taglineEn?: string;
  mvpEn?: string;
  wow: number;
  useful: number;
  easy: number;
  source: string;
  url: string;
  demoUrl?: string;
}

// Derived at module load: project plus its track placement.
export interface RankedProject extends Project {
  id: string;
  track: TrackId;
  rank: number;
}

// A GitHub Trending star project (weekly snapshot) — the raw fields stored
// in starFallback / fetched from the GitHub API. The render layer augments
// these with the same id/track/rank/source/stack shape as curated projects
// (see BoardProject), so the board can treat both uniformly.
export interface StarProject {
  repo: string;
  name: string;
  tagline: string;
  language: string;
  totalStars: number;
  deltaStars: number;
  trendingRank: number;
  mvp: string;
  taglineEn?: string;
  mvpEn?: string;
  wow: number;
  useful: number;
  easy: number;
  url: string;
}

// A star project augmented with the same board-placement fields as a
// RankedProject, so the board can render curated + star projects uniformly.
export interface RankedStarProject extends StarProject {
  id: string;
  track: "stars";
  rank: number;
  source: string;
  stack: string[];
}

// The unified shape the board uses to render any project (curated or star).
export interface BoardProject {
  id: string;
  track: TrackId;
  rank: number;
  name: string;
  tagline: string;
  stack: string[];
  mvp: string;
  nameEn?: string;
  taglineEn?: string;
  mvpEn?: string;
  wow: number;
  useful: number;
  easy: number;
  source: string;
  url: string;
  demoUrl?: string;
  // Star-only fields, present when track === "stars".
  repo?: string;
  language?: string;
  totalStars?: number;
  deltaStars?: number;
  trendingRank?: number;
}

export interface Skill {
  name: string;
  signal: string;
  url: string;
  description: string;
  nameEn?: string;
  descriptionEn?: string;
}

export type SkillId = string;

export interface StarterOption {
  id: string;
  label: string;
  description: string;
  labelEn?: string;
  descriptionEn?: string;
}

export type StarterDimension = "time" | "goal" | "skill" | "hardware";

export interface StarterState {
  time: string;
  goal: string;
  skill: string;
  hardware: string;
}

export interface BoardTheme {
  primary: string;
  soft: string;
  shadow: string;
}

export type MetricId = "wow" | "useful" | "easy";

export interface ProjectSkillRule {
  tracks: TrackId[];
  match: RegExp;
  skills: SkillId[];
}

export interface ProjectTagRule {
  match: RegExp;
  tags: string[];
}
