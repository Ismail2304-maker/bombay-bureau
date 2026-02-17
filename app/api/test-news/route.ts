import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const QUERY_MAP: Record<string, string> = {
  India: "India",
  World: "global OR international OR geopolitics OR US OR Europe OR China",
  Business: "business OR markets OR economy OR finance OR corporate",
  Technology: "technology OR AI OR startup OR software OR semiconductor",
  Politics: "politics OR election OR government OR policy",
};

// 🎯 Weighted category picker
function pickWeightedCategory(): string {
  const distribution = [
    { name: "India", weight: 30 },
    { name: "World", weight: 25 },
    { name: "Politics", weight: 15 },
    { name: "Business", weight: 15 },
    { name: "Technology", weight: 15 },
  ];

  const totalWeight = distribution.reduce((sum, c) => sum + c.weight, 0);
  const random = Math.random() * totalWeight;

  let cumulative = 0;

  for (const category of distribution) {
    cumulative += category.weight;
    if (random < cumulative) {
      return category.name;
    }
  }

  return "India"; // fallback
}

export async function GET() {
  try {
    const apiKey = process.env.GNEWS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GNews API key" },
        { status: 500 }
      );
    }

    // ✅ Pick category properly
    const chosenCategory = pickWeightedCategory();
    const query = QUERY_MAP[chosenCategory];

    // 🕒 Only last 24 hours
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const response = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(
        query
      )}&lang=en&max=10&sortby=publishedAt&apikey=${apiKey}`
    );

    const data = await response.json();

    if (!data?.articles?.length) {
      return NextResponse.json(
        { error: "No articles found" },
        { status: 404 }
      );
    }

    // 🔥 Strict 24-hour filter
    const recentArticles = data.articles.filter((article: any) => {
      const published = new Date(article.publishedAt);
      return published >= oneDayAgo;
    });

    if (!recentArticles.length) {
      return NextResponse.json(
        { error: "No articles within last 24 hours" },
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
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}