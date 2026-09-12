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

Write a detailed, professional and factual news article based ONLY on the supplied source information.

IMPORTANT FACTUAL RULES:
- Do NOT invent facts.
- Do NOT invent quotes.
- Do NOT invent statistics.
- Do NOT invent people, places, dates or events.
- Do NOT add information that is not supported by the supplied source.
- Do NOT pretend to have personally researched, verified or witnessed anything.
- Do NOT use outside knowledge to add unsupported details.
- Rewrite the supplied information naturally in original journalistic language.
- Do NOT copy the source article word-for-word.
- Keep the article suitable for publication by a professional digital news organization.
- Maintain factual accuracy throughout the entire article.
- If the source contains conflicting or uncertain information, do not resolve it by guessing.
- Do not exaggerate or sensationalize the story.

ARTICLE LENGTH:
- Aim for approximately 900–1,200 words when the supplied source provides enough information.
- Produce substantial, informative coverage rather than a short summary.
- Develop the available facts with clear explanation and context.
- Do not repeat the same information simply to increase word count.
- If the source information is genuinely limited, write the longest accurate article possible without inventing information.

ARTICLE STRUCTURE:
1. Begin with a strong news lead explaining the most important development.
2. Explain the key facts and details of what happened.
3. Provide the relevant background contained in the source.
4. Explain the significance of the development when the source supports it.
5. Include relevant statements, reactions, decisions, developments or consequences mentioned in the source.
6. Explain the sequence of events clearly when dates or timelines are available.
7. Provide additional context from the supplied source where useful.
8. End with what is expected to happen next, but ONLY when supported by the supplied source.

WRITING STYLE:
- Professional Indian digital news publication style.
- Clear, natural and readable journalistic English.
- Use informative paragraphs with smooth transitions.
- Avoid unnecessary repetition.
- Avoid extremely short paragraphs unless needed for emphasis.
- Do not use bullet points inside the article.
- Do not use emojis.
- Do not include personal opinions.
- Do not present speculation as fact.
- Do not use unsupported analysis.
- Attribute statements to their sources when appropriate.
- Make the article engaging through clarity and useful context, not sensationalism.

CATEGORY:
Choose exactly ONE category from:
India
World
Politics
Business
Technology
Opinion

Return ONLY valid JSON in exactly this format:

{
  "title": "article headline",
  "category": "India",
  "paragraphs": [
    "paragraph 1",
    "paragraph 2",
    "paragraph 3",
    "paragraph 4",
    "paragraph 5",
    "paragraph 6",
    "paragraph 7",
    "paragraph 8"
  ]
}

The category must be exactly one of the categories listed above.
The paragraphs should contain the complete article in logical order.
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