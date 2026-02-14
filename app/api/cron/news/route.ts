// news-site/app/api/cron/news/route.ts

import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@sanity/client"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
})

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

// 🔥 Your real Author ID
const AUTHOR_ID = "0664ef92-6a72-48c3-b1bf-2e2b73ac67c9"

// 🔥 Your category IDs
const CATEGORY_MAP: Record<string, string> = {
  india: "18088637-4ede-4976-b169-d55b6a298d8e",
  world: "b4863bf0-a551-4f82-b18c-33b5f76d077e",
  opinion: "0b2d62d2-5630-4dcc-b149-e350e70bfb23",
  politics: "fdf8818a-8773-47a9-8f4b-d38822882b69",
  business: "4fe8a141-3319-46b8-a2c4-3667ac8ba5e7",
  technology: "001e7baf-fe5b-44f2-9e2c-74a59c69890e",
}

function detectCategory(title: string) {
  const lower = title.toLowerCase()

  if (lower.includes("india")) return CATEGORY_MAP.india
  if (lower.includes("tech")) return CATEGORY_MAP.technology
  if (lower.includes("market") || lower.includes("economy"))
    return CATEGORY_MAP.business
  if (lower.includes("election") || lower.includes("policy"))
    return CATEGORY_MAP.politics

  // Default bias India & World
  return Math.random() > 0.5
    ? CATEGORY_MAP.india
    : CATEGORY_MAP.world
}

export async function GET() {
  try {
    console.log("🚀 AUTOMATION V2 RUNNING")

    // 1️⃣ Fetch real news
    const newsRes = await fetch(
      `https://newsapi.org/v2/top-headlines?country=in&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`
    )

    const newsData = await newsRes.json()

    if (!newsData.articles || newsData.articles.length === 0) {
      throw new Error("No news articles found")
    }

    const randomArticle =
      newsData.articles[
        Math.floor(Math.random() * newsData.articles.length)
      ]

    const originalTitle = randomArticle.title
    const originalDescription = randomArticle.description || ""

    // 2️⃣ Rewrite using AI (strict JSON)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
You are a senior journalist at Bombay Bureau.

Rewrite the provided news professionally.
Make it analytical and human.
Do not copy sentences.
No markdown.
No formatting symbols.
Return ONLY valid JSON:

{
  "title": "Clean rewritten headline",
  "body": "Full rewritten article in paragraph format"
}
`,
        },
        {
          role: "user",
          content: `
Original Headline:
${originalTitle}

Original Summary:
${originalDescription}

Rewrite into a full 800-word professional article dated today.
`,
        },
      ],
    })

    const raw = completion.choices[0].message.content
    if (!raw) throw new Error("No AI response")

    const parsed = JSON.parse(raw)

    const categoryId = detectCategory(parsed.title)

    // 3️⃣ Convert to Portable Text
    const portableBody = parsed.body
      .split("\n")
      .filter((p: string) => p.trim() !== "")
      .map((paragraph: string) => ({
        _type: "block",
        _key: crypto.randomUUID(),
        children: [
          {
            _type: "span",
            _key: crypto.randomUUID(),
            text: paragraph.trim(),
          },
        ],
      }))

    // 4️⃣ Save to Sanity
    await sanity.create({
      _type: "post",
      title: parsed.title.trim(),
      slug: {
        _type: "slug",
        current: parsed.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .slice(0, 96),
      },
      publishedAt: new Date().toISOString(),
      body: portableBody,
      views: 0,
      author: {
        _type: "reference",
        _ref: AUTHOR_ID,
      },
      categories: [
        {
          _type: "reference",
          _ref: categoryId,
        },
      ],
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
  console.error("AUTOMATION ERROR:", error)
  return NextResponse.json({
    success: false,
    message: error?.message || "Unknown error"
  })
}
}