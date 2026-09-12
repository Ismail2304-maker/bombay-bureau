import { writeClient } from "../sanity/lib/client.js"
import fetch from "node-fetch"
import crypto from "node:crypto"

console.log("🟢 Bombay Bureau Auto News Running...")

/* AUTHOR */
const AUTHOR_ID = "0664ef92-6a72-48c3-b1bf-2e2b73ac67c9"

/* CATEGORY IDs */
const CATEGORY_IDS = {
  India: "18088637-4ede-4976-b169-d55b6a298d8e",
  World: "b4863bf0-a551-4f82-b18c-33b5f76d077e",
  Politics: "fdf8818a-8773-47a9-8f4b-d38822882b69",
  Business: "4fe8a141-3319-46b8-a2c4-3667ac8ba5e7",
  Technology: "001e7baf-fe5b-44f2-9e2c-74a59c69890e",
  Opinion: "0b2d62d2-5630-4dcc-b149-e350e70bfb23",
}

/* FETCH NEWS */
async function fetchNews() {
  const res = await fetch(
    "https://api.spaceflightnewsapi.net/v4/articles/?limit=5"
  )

  if (!res.ok) {
    throw new Error(`News API failed: ${res.status}`)
  }

  const data: any = await res.json()

  return data.results
}

/* BUILD ARTICLE BODY */
function buildBody(title: string, summary: string) {
  const p1 = `${title} is rapidly becoming a focal point in international discussions as fresh developments continue to unfold. ${summary} Analysts across global policy and business circles say the story reflects broader shifts in geopolitical priorities, economic momentum, and technological competition. Governments and industry leaders are closely tracking the situation as it evolves.`

  const p2 = `Observers note that developments like these rarely remain confined to a single region. Instead, they tend to ripple across markets, diplomatic channels, and security frameworks. As global supply chains and strategic alliances grow increasingly interconnected, events in one part of the world can quickly influence decision-making elsewhere. This interconnected reality has intensified the speed at which governments respond to emerging challenges.`

  const p3 = `From India’s standpoint, the situation carries particular relevance. Policymakers in New Delhi have increasingly positioned the country as both a stabilizing force and a strategic partner in international affairs. India’s expanding economic footprint, growing technology sector, and diplomatic outreach across the Global South and Western blocs mean that such developments are evaluated not only for risk but also for opportunity.`

  const p4 = `Experts believe India’s balanced approach — maintaining strong domestic growth while engaging internationally — allows it to navigate global shifts with greater flexibility. Whether through trade negotiations, technological partnerships, or regional diplomacy, India continues to emphasize stability and long-term cooperation. This positioning has enhanced its credibility among investors and governments alike.`

  const p5 = `For global audiences, the story underscores a broader transition in how power, technology, and economic influence interact. Strategic competition is no longer limited to military or political arenas; it now extends into innovation, infrastructure, and financial systems. As these dynamics continue to evolve, analysts expect sustained attention from policymakers and markets in the months ahead.`

  const p6 = `While uncertainties remain, the trajectory suggests continued engagement among major global players, with India playing an increasingly visible role in shaping conversations and outcomes. Observers say the coming period will likely bring further developments that clarify long-term implications for both regional stability and the global order.`

  return [
    block(p1),
    block(p2),
    block(p3),
    block(p4),
    block(p5),
    block(p6),
  ]
}

/* CREATE SANITY TEXT BLOCK */
function block(text: string) {
  return {
    _type: "block",
    _key: crypto.randomUUID(),
    children: [
      {
        _type: "span",
        _key: crypto.randomUUID(),
        text,
      },
    ],
  }
}

/* DETECT CATEGORY */
function detectCategory(title: string) {
  const t = title.toLowerCase()

  if (t.includes("india")) return CATEGORY_IDS.India

  if (
    t.includes("government") ||
    t.includes("election") ||
    t.includes("minister") ||
    t.includes("parliament")
  ) {
    return CATEGORY_IDS.Politics
  }

  if (
    t.includes("market") ||
    t.includes("economy") ||
    t.includes("business") ||
    t.includes("company")
  ) {
    return CATEGORY_IDS.Business
  }

  if (
    t.includes("technology") ||
    t.includes("tech") ||
    t.includes("ai") ||
    t.includes("artificial intelligence")
  ) {
    return CATEGORY_IDS.Technology
  }

  if (t.includes("opinion")) return CATEGORY_IDS.Opinion

  return CATEGORY_IDS.World
}

/* CREATE POSTS */
async function run() {
  const news = await fetchNews()

  for (const article of news) {
    const slug = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50)

    const doc: any = {
      _type: "post",

      title: article.title,

      slug: {
        _type: "slug",
        current: slug,
      },

      author: {
        _type: "reference",
        _ref: AUTHOR_ID,
      },

      publishedAt: new Date().toISOString(),

      body: buildBody(
        article.title,
        article.summary || "New developments are drawing attention as the situation continues to evolve."
      ),

      categories: [
        {
          _type: "reference",
          _ref: detectCategory(article.title),
          _key: crypto.randomUUID(),
        },
      ],

      views: 0,
    }

    /* NO AUTOMATIC IMAGE UPLOAD */
    /* You will add the article image manually in Sanity. */

    await writeClient.create(doc)

    console.log("📰 Published:", article.title)
  }

  console.log("✅ Done.")
}

run().catch((error) => {
  console.error("❌ Auto News Error:", error)
  process.exit(1)
})