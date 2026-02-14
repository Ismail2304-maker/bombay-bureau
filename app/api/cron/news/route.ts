// news-site/app/api/cron/news/route.ts

import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@sanity/client"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.OPENAI_BASE_URL,
})

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

const AUTHOR_ID = "0664ef92-6a72-48c3-b1bf-2e2b73ac67c9"

const CATEGORY_MAP: Record<string, string> = {
  india: "18088637-4ede-4976-b169-d55b6a298d8e",
  world: "b4863bf0-a551-4f82-b18c-33b5f76d077e",
  opinion: "0b2d62d2-5630-4dcc-b149-e350e70bfb23",
  politics: "fdf8818a-8773-47a9-8f4b-d38822882b69",
  business: "4fe8a141-3319-46b8-a2c4-3667ac8ba5e7",
  technology: "001e7baf-fe5b-44f2-9e2c-74a59c69890e",
}

function detectCategory(title: string) {
  const t = title.toLowerCase()
  if (t.includes("india")) return CATEGORY_MAP.india
  if (t.includes("tech")) return CATEGORY_MAP.technology
  if (t.includes("market") || t.includes("economy")) return CATEGORY_MAP.business
  if (t.includes("election") || t.includes("policy")) return CATEGORY_MAP.politics
  return CATEGORY_MAP.world
}

export async function GET() {
  try {
    // 1️⃣ Fetch Latest Global News
    const newsRes = await fetch(
      `https://newsapi.org/v2/everything?q=(India OR World OR Politics OR Business OR Technology)&language=en&sortBy=publishedAt&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`
    )

    const newsData = await newsRes.json()

    if (!newsData.articles || newsData.articles.length === 0) {
      throw new Error("No news articles found")
    }

    const article =
      newsData.articles[Math.floor(Math.random() * newsData.articles.length)]

    // 2️⃣ AI Rewrite
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a senior journalist at Bombay Bureau.

Rewrite professionally.
Do NOT use markdown.
Return ONLY valid JSON:

{
 "title": "Clean headline",
 "body": "800 word professional article"
}
`,
        },
        {
          role: "user",
          content: `
Original Headline:
${article.title}

Original Description:
${article.description || ""}
`,
        },
      ],
      temperature: 0.7,
    })

    const parsed = JSON.parse(completion.choices[0].message.content!)

    // 3️⃣ Upload Image to Sanity (if exists)
    let imageAsset = null

    if (article.urlToImage) {
      const imageResponse = await fetch(article.urlToImage)
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())

      imageAsset = await sanity.assets.upload("image", imageBuffer)
    }

    // 4️⃣ Convert Body to Portable Text
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
            text: paragraph,
          },
        ],
      }))

    // 5️⃣ Create Post
    await sanity.create({
      _type: "post",
      title: parsed.title,
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
          _ref: detectCategory(parsed.title),
        },
      ],
      mainImage: imageAsset
        ? {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageAsset._id,
            },
          }
        : undefined,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false })
  }
}