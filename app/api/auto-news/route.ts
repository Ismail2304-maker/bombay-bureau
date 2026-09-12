import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { writeClient } from "@/sanity/lib/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* AUTHOR */
const AUTHOR_ID = "0664ef92-6a72-48c3-b1bf-2e2b73ac67c9";

/* CATEGORY IDs */
const CATEGORY_IDS = {
  India: "18088637-4ede-4976-b169-d55b6a298d8e",
  World: "b4863bf0-a551-4f82-b18c-33b5f76d077e",
  Politics: "fdf8818a-8773-47a9-8f4b-d38822882b69",
  Business: "4fe8a141-3319-46b8-a2c4-3667ac8ba5e7",
  Technology: "001e7baf-fe5b-44f2-9e2c-74a59c69890e",
  Opinion: "0b2d62d2-5630-4dcc-b149-e350e70bfb23",
};

/* GET RECENT NEWS FROM GNEWS */
async function fetchNews() {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    throw new Error("GNEWS_API_KEY is not configured");
  }

  const query =
    "India OR politics OR business OR technology OR world";

  const response = await fetch(
    `https://gnews.io/api/v4/search?q=${encodeURIComponent(
      query
    )}&lang=en&max=10&apikey=${apiKey}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`GNews failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data?.articles?.length) {
    throw new Error("No news articles found");
  }

  /* Only use articles from the last 24 hours */
  const oneDayAgo = new Date(
    Date.now() - 24 * 60 * 60 * 1000
  );

  const recentArticles = data.articles.filter(
    (article: any) =>
      article.publishedAt &&
      new Date(article.publishedAt) >= oneDayAgo
  );

  if (!recentArticles.length) {
    throw new Error("No recent news articles found");
  }

  /* Pick one article */
  return recentArticles[
    Math.floor(Math.random() * recentArticles.length)
  ];
}

/* GENERATE ARTICLE WITH OPENROUTER */
async function generateArticle(
  title: string,
  description: string,
  source: string
) {
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
      },

      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",

        temperature: 0.5,

        max_tokens: 2200,

        messages: [
          {
            role: "system",

            content: `
You are the senior journalist for Bombay Bureau, an Indian digital news publication.

Write a factual, professional news article using ONLY the information provided by the source.

STRICT RULES:

- Do not invent facts.
- Do not invent quotes.
- Do not invent statistics.
- Do not invent names, locations or events.
- Do not exaggerate.
- Do not use clickbait.
- Do not mention that AI was used.
- Write naturally like a professional Indian newsroom.
- Give India appropriate importance when the story genuinely involves India.
- Do not force an India connection when there isn't one.
- The article should be approximately 400–700 words.
- Return ONLY valid JSON.

Choose exactly ONE category:

India
World
Politics
Business
Technology
Opinion

Return:

{
  "title": "headline",
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
SOURCE HEADLINE:
${title}

SOURCE DESCRIPTION:
${description}

SOURCE:
${source}
`,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `OpenRouter failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  const content =
    data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenRouter returned no article");
  }

  try {
    return JSON.parse(content);
  } catch {
    throw new Error(
      "OpenRouter returned invalid JSON"
    );
  }
}

/* CREATE SANITY BLOCK */
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

/* CREATE SLUG */
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

/* CATEGORY */
function getCategoryId(category: string) {
  const value = category
    ?.trim()
    .toLowerCase();

  if (value === "india") {
    return CATEGORY_IDS.India;
  }

  if (value === "politics") {
    return CATEGORY_IDS.Politics;
  }

  if (value === "business") {
    return CATEGORY_IDS.Business;
  }

  if (value === "technology") {
    return CATEGORY_IDS.Technology;
  }

  if (value === "opinion") {
    return CATEGORY_IDS.Opinion;
  }

  return CATEGORY_IDS.World;
}

/* TRIGGER */
export async function GET(request: Request) {
  try {
    /* SECURITY */
    const { searchParams } =
      new URL(request.url);

    const providedKey =
      searchParams.get("key");

    const secret =
      process.env.AUTO_NEWS_SECRET;

    if (!secret) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AUTO_NEWS_SECRET is not configured",
        },
        { status: 500 }
      );
    }

    if (providedKey !== secret) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    console.log(
      "🟢 Bombay Bureau Auto News triggered"
    );

    /* FETCH NEWS */
    const source = await fetchNews();

    console.log(
      "📰 Source:",
      source.title
    );

    /* GENERATE ARTICLE */
    const article =
      await generateArticle(
        source.title,
        source.description || "",
        source.source?.name || "GNews"
      );

    /* SANITY DOCUMENT */
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

      publishedAt:
        new Date().toISOString(),

      body: article.paragraphs.map(
        (paragraph: string) =>
          createBlock(paragraph)
      ),

      categories: [
        {
          _type: "reference",
          _ref: getCategoryId(
            article.category
          ),
          _key: crypto.randomUUID(),
        },
      ],

      views: 0,

      /*
        IMPORTANT:
        mainImage is intentionally NOT included.

        You will manually add the image
        inside Sanity.
      */
    };

    /* PUBLISH */
    const created =
      await writeClient.create(doc);

    console.log(
      "✅ Published:",
      article.title
    );

    console.log(
      "Sanity ID:",
      created._id
    );

    return NextResponse.json({
      success: true,

      message:
        "Bombay Bureau article published successfully",

      title: article.title,

      category: article.category,

      sanityId: created._id,

      image:
        "Manual upload required",
    });
  } catch (error) {
    console.error(
      "❌ Auto News Error:",
      error
    );

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