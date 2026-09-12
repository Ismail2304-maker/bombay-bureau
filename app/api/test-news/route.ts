import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { writeClient } from "@/sanity/lib/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AUTHOR_ID = "0664ef92-6a72-48c3-b1bf-2e2b73ac67c9";

const CATEGORY_IDS = {
  India: "18088637-4ede-4976-b169-d55b6a298d8e",
  World: "b4863bf0-a551-4f82-b18c-33b5f76d077e",
  Politics: "fdf8818a-8773-47a9-8f4b-d38822882b69",
  Business: "4fe8a141-3319-46b8-a2c4-3667ac8ba5e7",
  Technology: "001e7baf-fe5b-44f2-9e2c-74a59c69890e",
  Opinion: "0b2d62d2-5630-4dcc-b149-e350e70bfb23",
};

const QUERY_MAP: Record<string, string> = {
  India: "India",
  World: "global OR international OR geopolitics OR US OR Europe OR China",
  Business: "business OR markets OR economy OR finance OR corporate",
  Technology: "technology OR AI OR startup OR software OR semiconductor",
  Politics: "politics OR election OR government OR policy",
};

const COUNTRY_MAP: Record<string, string[]> = {
  India: ["in"],
  World: ["us", "gb", "ca", "au"],
  Business: ["us", "in", "gb"],
  Technology: ["us", "in", "gb"],
  Politics: ["us", "in", "gb"],
};

function pickWeightedCategory(): string {
  const distribution = [
    { name: "India", weight: 30 },
    { name: "World", weight: 25 },
    { name: "Politics", weight: 15 },
    { name: "Business", weight: 15 },
    { name: "Technology", weight: 15 },
  ];

  const totalWeight = distribution.reduce(
    (sum, category) => sum + category.weight,
    0
  );

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

function pickRandomCountry(category: string): string {
  const countries = COUNTRY_MAP[category] || ["in"];

  return countries[Math.floor(Math.random() * countries.length)];
}

function createBlock(text: string) {
  return {
    _type: "block",
    _key: crypto.randomUUID(),
    children: [
      {
        _type: "span",
        _key: crypto.randomUUID(),
        text,
        marks: [],
      },
    ],
    markDefs: [],
    style: "normal",
  };
}

function createSlug(title: string) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) +
    "-" +
    Date.now().toString().slice(-6)
  );
}

function getCategoryId(category: string) {
  const normalized = category.trim().toLowerCase();

  if (normalized === "india") return CATEGORY_IDS.India;
  if (normalized === "politics") return CATEGORY_IDS.Politics;
  if (normalized === "business") return CATEGORY_IDS.Business;
  if (normalized === "technology") return CATEGORY_IDS.Technology;
  if (normalized === "opinion") return CATEGORY_IDS.Opinion;

  return CATEGORY_IDS.World;
}

async function fetchNews() {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    throw new Error("GNEWS_API_KEY is not configured");
  }

  const chosenCategory = pickWeightedCategory();
  const query = QUERY_MAP[chosenCategory];
  const country = pickRandomCountry(chosenCategory);

  const now = new Date();
  const oneDayAgo = new Date(
    now.getTime() - 24 * 60 * 60 * 1000
  );

  const response = await fetch(
    `https://gnews.io/api/v4/search?q=${encodeURIComponent(
      query
    )}&lang=en&country=${country}&max=10&sortby=publishedAt&apikey=${apiKey}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`GNews request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data?.articles?.length) {
    throw new Error("No news articles found");
  }

  const recentArticles = data.articles.filter((article: any) => {
    const published = new Date(article.publishedAt);
    return published >= oneDayAgo;
  });

  if (!recentArticles.length) {
    throw new Error("No articles within the last 24 hours");
  }

  const selected =
    recentArticles[
      Math.floor(Math.random() * recentArticles.length)
    ];

  return {
    category: chosenCategory,
    country,
    title: selected.title,
    description: selected.description || "",
    content: selected.content || "",
    source: selected.source?.name || "Unknown source",
    url: selected.url,
    publishedAt: selected.publishedAt,
  };
}

async function generateArticle(source: {
  title: string;
  description: string;
  content: string;
  source: string;
  url: string;
}) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://bombay-bureau.vercel.app",
        "X-Title": "Bombay Bureau",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "system",
            content: `
You are the senior news writer for Bombay Bureau, an Indian digital news publication.

Write a professional, factual news article based ONLY on the supplied source information.

IMPORTANT RULES:
- Do not invent facts.
- Do not invent quotes.
- Do not invent statistics.
- Do not invent people, places, dates or events.
- Do not add information that is not supported by the source.
- Do not pretend to have personally researched or verified information.
- Rewrite the supplied information naturally in original journalistic language.
- Do not copy the source article word-for-word.
- Keep the article suitable for publication by a professional digital news organization.
- Prefer clear, concise paragraphs.
- Aim for approximately 400-700 words when the source provides enough information.
- If the source information is limited, write a shorter article rather than inventing details.

Choose exactly ONE category from:
India
World
Politics
Business
Technology
Opinion

Return ONLY valid JSON in this format:

{
  "title": "article headline",
  "category": "India",
  "paragraphs": [
    "paragraph 1",
    "paragraph 2",
    "paragraph 3",
    "paragraph 4",
    "paragraph 5"
  ]
}
            `,
          },
          {
            role: "user",
            content: `
SOURCE TITLE:
${source.title}

SOURCE DESCRIPTION:
${source.description}

SOURCE CONTENT:
${source.content}

SOURCE:
${source.source}

SOURCE URL:
${source.url}
            `,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `OpenRouter request failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenRouter returned no article");
  }

  return JSON.parse(content);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const providedSecret =
      searchParams.get("secret") || searchParams.get("key");

    const expectedSecret = process.env.AUTO_NEWS_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "AUTO_NEWS_SECRET is not configured",
        },
        { status: 500 }
      );
    }

    if (providedSecret !== expectedSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    console.log("📰 Starting Bombay Bureau automatic news...");

    const source = await fetchNews();

    console.log("📰 Selected source:", source.title);

    const article = await generateArticle(source);

    if (
      !article?.title ||
      !article?.paragraphs ||
      !Array.isArray(article.paragraphs)
    ) {
      throw new Error("AI returned an invalid article format");
    }

    const doc = {
      _type: "post",
      title: article.title,
      slug: {
        _type: "slug",
        current: createSlug(article.title),
      },
      author: {
        _type: "reference",
        _ref: AUTHOR_ID,
      },
      publishedAt: new Date().toISOString(),
      body: article.paragraphs.map((paragraph: string) =>
        createBlock(paragraph)
      ),
      categories: [
        {
          _type: "reference",
          _ref: getCategoryId(article.category),
          _key: crypto.randomUUID(),
        },
      ],
      views: 0,
    };

    const created = await writeClient.create(doc);

    console.log("✅ Article published:", created._id);

    return NextResponse.json({
      success: true,
      message: "Bombay Bureau article published successfully",
      title: article.title,
      category: article.category,
      source: source.source,
      sourceUrl: source.url,
      sanityId: created._id,
    });
  } catch (error) {
    console.error("❌ Automatic News Error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}