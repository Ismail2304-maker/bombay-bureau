import {writeClient} from "../sanity/lib/client.js"
import crypto from "node:crypto"

const SPORTS = [
  /\btennis\b/i, /\bcricket\b/i, /\bfootball\b/i, /\bsoccer\b/i,
  /\bbasketball\b/i, /\bhockey\b/i, /\bolympic/i, /\bwimbledon\b/i,
  /\bgrand slam\b/i, /\bipl\b/i, /\bformula 1\b/i, /\bf1\b/i,
  /\bsport(s)?\b/i,
]

const CULTURE = [
  /\bnetflix\b/i, /\bfilm\b/i, /\bmovie\b/i, /\bcinema\b/i,
  /\btelevision\b/i, /\btv show\b/i, /\bseries\b/i, /\bmusic\b/i,
  /\balbum\b/i, /\bsong\b/i, /\bactor\b/i, /\bactress\b/i,
  /\bdirector\b/i, /\bbook\b/i, /\bliterature\b/i, /\bculture\b/i,
  /\bart(s)?\b/i, /\btheatre\b/i, /\btheater\b/i,
]

const categoryDescriptions = {
  Sports: "Sports news, results, tournaments, teams and the people shaping the world of sport.",
  Culture: "Film, television, music, books, arts and the wider culture shaping public life.",
}

async function ensureCategory(title: "Sports" | "Culture") {
  const existing = await writeClient.fetch<{_id: string} | null>(
    `*[_type == "category" && title == $title][0]{_id}`,
    {title},
  )
  if (existing?._id) return existing._id

  const id = `category-${title.toLowerCase()}-${crypto.createHash("sha1").update(title).digest("hex").slice(0, 8)}`
  await writeClient.createIfNotExists({
    _id: id,
    _type: "category",
    title,
    slug: {_type: "slug", current: title.toLowerCase()},
    description: categoryDescriptions[title],
  })
  return id
}

async function run() {
  const categories = {
    Sports: await ensureCategory("Sports"),
    Culture: await ensureCategory("Culture"),
  }

  const posts = await writeClient.fetch(
    `*[_type == "post" && defined(slug.current)]{
      _id,
      title,
      slug,
      "categoryTitles": categories[]->title
    }`,
  )

  let changes = 0

  for (const post of posts) {
    const title = post.title || ""
    const target = SPORTS.some((pattern) => pattern.test(title))
      ? "Sports"
      : CULTURE.some((pattern) => pattern.test(title))
        ? "Culture"
        : null

    if (!target) continue

    const current = post.categoryTitles || []
    if (current.length === 1 && current[0] === target) continue

    console.log(`[${process.env.APPLY === "1" ? "APPLY" : "DRY-RUN"}] ${post.slug?.current} -> ${target}`)
    changes++

    if (process.env.APPLY === "1") {
      await writeClient
        .patch(post._id)
        .set({
          categories: [{
            _type: "reference",
            _ref: categories[target],
            _key: crypto.randomUUID(),
          }],
        })
        .commit()
    }
  }

  console.log(`Found ${changes} editorial categorization change(s).`)
  if (process.env.APPLY !== "1") {
    console.log("Dry run only. Re-run with APPLY=1 to write changes.")
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
