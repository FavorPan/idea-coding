import { fetchTrending, type TrendingResult } from "@/lib/github/trending";
import { IdeaBoard } from "@/components/idea/IdeaBoard";

// Static export: trending data is resolved at build time. The live star-fetch
// path only runs when GITHUB_TOKEN is set at build; without a token it returns
// the hand-curated fallback immediately. Rebuild via GitHub Actions to refresh.
async function getTrending(): Promise<TrendingResult> {
  return fetchTrending();
}

export default async function Home() {
  const data = await getTrending();
  return (
    <IdeaBoard
      starProjects={data.projects}
      fetchedAt={data.fetchedAt}
      trendingSource={data.source}
    />
  );
}
