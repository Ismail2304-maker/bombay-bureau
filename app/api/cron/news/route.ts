console.log("AUTOMATION V4 FINAL STABLE")

import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@sanity/client"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

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
  const lower = title.toLowerCase()
  if (lower.includes("india")) return CATEGORY_MAP.india
  if (lower.includes("tech")) return CATEGORY_MAP.technology
  if (lower.includes("market") || lower.includes("economy")) return CATEGORY_MAP.business
  if (lower.includes("election") || lower.includes("policy")) return CATEGORY_MAP.politics
  return Math.random() > 0.5 ? CATEGORY_MAP.india : CATEGORY_MAP.world
}

export async function GET() {
  try {
    // 🔹 Fetch real news
    const newsRes = await fetch(
      `https://newsapi.org/v2/everything?q=india OR world OR politics OR business OR technology&pageSize=5&sortBy=publishedAt&language=en&apiKey=${process.env.NEWS_API_KEY}`
    )

    const newsData = await newsRes.json()

    if (!newsData.articles?.length) {
      return NextResponse.json({ success: false, message: "No news articles found" })
    }

    const randomArticle =
      newsData.articles[Math.floor(Math.random() * newsData.articles.length)]

    const originalTitle = randomArticle.title || "Global Developments"
    const originalDescription = randomArticle.description || ""
    const imageUrl = randomArticle.urlToImage || null

    // 🔹 AI Rewrite
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a senior journalist at Bombay Bureau.
Rewrite the article professionally.
No markdown.
Return ONLY valid JSON:

{
  "title": "Clean headline",
  "body": "800 word article in plain paragraphs"
}
`,
        },
        {
          role: "user",
          content: `
Headline:
${originalTitle}

Summary:
${originalDescription}

Rewrite into a full professional article dated today.
`,
        },
      ],
      temperature: 0.7,
    })

    const raw = completion.choices[0].message.content
    if (!raw) throw new Error("No AI response")

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      throw new Error("AI returned invalid JSON")
    }

    // 🔹 Convert to Portable Text
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

    // 🔹 Upload Image (if exists)
    let imageAsset = null

    if (imageUrl) {
      try {
        const imgRes = await fetch(imageUrl)
        const imgBuffer = await imgRes.arrayBuffer()

        imageAsset = await sanity.assets.upload(
          "image",
          Buffer.from(imgBuffer),
          { filename: "news.jpg" }
        )
      } catch {
        console.log("Image upload failed — continuing without image")
      }
    }

    const categoryId = detectCategory(parsed.title)

    // 🔹 Create Post in Sanity
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
          _key: crypto.randomUUID(), // ✅ FIXED missing key
          _ref: categoryId,
        },
      ],

      mainImage: imageAsset
        ? {
            _type: "image",
            _key: crypto.randomUUID(), // ✅ key added
            asset: {
              _type: "reference",
              _ref: imageAsset._id,
            },
            alt: parsed.title, // ✅ alt text auto-filled
          }
        : undefined,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("AUTOMATION ERROR:", error)
    return NextResponse.json({ success: false })
  }
}