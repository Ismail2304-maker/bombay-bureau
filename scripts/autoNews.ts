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
  Sports: "category-sports",
  Culture: "category-culture",
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

  if (/tennis|cricket|football|soccer|basketball|hockey|olympic|f1|formula 1|grand slam|wimbledon|us open|australian open|french open|ipl|sports/.test(t)) return "Sports"
  if (/netflix|film|movie|cinema|television|tv show|series|music|album|song|actor|actress|director|book|author|literature|art|culture|theatre|theater/.test(t)) return "Culture"
  if (t.includes("india")) return "India"
  if (t.includes("government") || t.includes("election") || t.includes("minister") || t.includes("parliament")) return "Politics"
  if (t.includes("market") || t.includes("economy") || t.includes("business") || t.includes("company")) return "Business"
  if (t.includes("technology") || t.includes("tech") || t.includes(" ai ") || t.includes("artificial intelligence")) return "Technology"
  if (t.includes("opinion")) return "Opinion"
  return "World"
}

async function ensureCategory(title: keyof typeof CATEGORY_IDS) {
  const id = CATEGORY_IDS[title]
  const existing = await writeClient.fetch<{_id:string} | null>(
    `*[_type == "category" && title == $title][0]{_id}`,
    {title}
  )
  if (existing?._id) return existing._id

  await writeClient.createIfNotExists({
    _id: id,
    _type: "category",
    title,
    slug: {_type: "slug", current: title.toLowerCase()},
    description:
      title === "Sports"
        ? "Sports news, results, tournaments, teams and the people shaping the world of sport."
        : "Film, television, music, books, arts and the wider culture shaping public life.",
  })
  return id
}

async function uniqueSlug(base: string, sourceId: string | number) {
  const clean = base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70)
  const collisions = await writeClient.fetch<number>(
    `count(*[_type == "post" && slug.current == $slug])`,
    {slug: clean}
  )
  if (!collisions) return clean

  // Keep collision handling deterministic and tied to the source article,
  // rather than generating arbitrary numeric suffixes.
  const stableSuffix = crypto.createHash("sha1").update(String(sourceId)).digest("hex").slice(0, 6)
  return `${clean}-${stableSuffix}`
}

/* CREATE POSTS */
async function run() {
  const news = await fetchNews()

  for (const article of news) {
    const categoryTitle = detectCategory(article.title) as keyof typeof CATEGORY_IDS
    const categoryId = await ensureCategory(categoryTitle)
    const slug = await uniqueSlug(article.title, article.id ?? article.url ?? article.title)

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
          _ref: categoryId,
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