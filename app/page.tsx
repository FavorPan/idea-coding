import { cacheLife } from "next/cache";
import { fetchTrending, pickKV, type TrendingResult } from "@/lib/github/trending";
import { IdeaBoard } from "@/components/idea/IdeaBoard";

// Cached data fetch: revalidated on the `minutes` profile in dev for fast
// iteration. The live path only runs when GITHUB_TOKEN is set; without a
// token it returns the hand-curated fallback immediately.
async function getTrending(): Promise<TrendingResult> {
  "use cache";
  cacheLife("minutes");
  const token = process.env.GITHUB_TOKEN;
  const kv = pickKV();
  return fetchTrending(kv, token);
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
