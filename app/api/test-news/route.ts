import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const QUERY_MAP: Record<string, string> = {
  India: "India",
  World: "global OR international OR geopolitics",
  Business: "business OR markets OR economy OR finance OR corporate",
  Technology: "technology OR AI OR startup OR software OR semiconductor",
  Politics: "politics OR election OR government OR policy",
};

export async function GET() {
  try {
    const apiKey = process.env.GNEWS_API_KEY;
    const categories = ["India", "World", "Business", "Technology", "Politics"];

    const chosenCategory =
      categories[Math.floor(Math.random() * categories.length)];

    const query = QUERY_MAP[chosenCategory];

    if (!apiKey) {
      return NextResponse.json({ error: "Missing GNews API key" }, { status: 500 });
    }

    const now = new Date();
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const response = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(
        query
      )}&lang=en&max=10&apikey=${apiKey}`
    );

    const data = await response.json();

    if (!data?.articles?.length) {
      return NextResponse.json({ error: "No articles found" }, { status: 404 });
    }

    const recentArticles = data.articles.filter((article: any) =>
  new Date(article.publishedAt) >= oneDayAgo
);

    if (!recentArticles.length) {
      return NextResponse.json(
        { error: "No recent articles within 3 days" },
        { status: 404 }
      );
    }

    const selected =
      recentArticles[Math.floor(Math.random() * recentArticles.length)];

    return NextResponse.json({
      success: true,
      category: chosenCategory,
      headline: selected.title,
      summary: selected.description,
      source: selected.source?.name,
      link: selected.url,
      publishedAt: selected.publishedAt,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}