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

// 🌍 Country distribution per category
const COUNTRY_MAP: Record<string, string[]> = {
  India: ["in"],
  World: ["us", "gb", "ca", "au"],
  Business: ["us", "in", "gb"],
  Technology: ["us", "in", "gb"],
  Politics: ["us", "in", "gb"],
};

// 🎯 Weighted category picker (30/25/15/15/15)
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

  return "India";
}

// 🌎 Random country based on category
function pickRandomCountry(category: string): string {
  const countries = COUNTRY_MAP[category];
  return countries[Math.floor(Math.random() * countries.length)];
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

    // ✅ Pick category + country
    const chosenCategory = pickWeightedCategory();
    const query = QUERY_MAP[chosenCategory];
    const country = pickRandomCountry(chosenCategory);

    // 🕒 Strict last 24 hours filter
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const response = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(
        query
      )}&lang=en&country=${country}&max=10&sortby=publishedAt&apikey=${apiKey}`
    );

    const data = await response.json();

    if (!data?.articles?.length) {
      return NextResponse.json(
        { error: "No articles found" },
        { status: 404 }
      );
    }

    // 🔥 Only articles from last 24 hours
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
      country,
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