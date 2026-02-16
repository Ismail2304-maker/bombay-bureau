import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

const RSS_FEEDS = [
  "https://feeds.bbci.co.uk/news/world/rss.xml",
  "https://feeds.bbci.co.uk/news/india/rss.xml",
];

function detectCategory(title: string) {
  const lower = title.toLowerCase();

  if (lower.includes("india")) return "India";
  if (lower.includes("tech")) return "Technology";
  if (lower.includes("market")) return "Business";
  if (lower.includes("election")) return "Politics";

  return "World";
}

export async function GET(req: Request) {

  // 🔐 CRON SECURITY CHECK
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false });
  }

  try {
    const now = new Date();
    const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const hour = ist.getHours();

    if (hour < 6 || hour >= 19) {
      return NextResponse.json({ message: "Outside publishing window" });
    }

    // Fetch RSS
    const feedUrl = RSS_FEEDS[Math.floor(Math.random() * RSS_FEEDS.length)];
    const rssRes = await fetch(feedUrl);
    const xml = await rssRes.text();

   const items = xml.match(/<item>([\s\S]*?)<\/item>/g);

if (!items || items.length === 0) {
  return NextResponse.json({ error: "No RSS items found" });
}

const randomItem = items[Math.floor(Math.random() * items.length)];

const titleMatch = randomItem.match(/<title>(<!\[CDATA\[)?(.*?)(\]\]>)?<\/title>/);

if (!titleMatch) {
  return NextResponse.json({ error: "No RSS title found" });
}

const rssTitle = titleMatch[2];

    // Call OpenRouter
    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          {
            role: "system",
            content: `
Rewrite into a professional 400-600 word news article.

Return ONLY valid JSON in this exact format:

{
  "title": "Clean headline",
  "body": "Full article body text",
  "altText": "SEO optimized descriptive alt text for the article image"
}
`
          },
          {
            role: "user",
            content: rssTitle
          }
        ],
        temperature: 0.7,
      }),
    });

    const aiData = await aiRes.json();

if (!aiData.choices || !aiData.choices.length) {
  console.error("OpenRouter error:", aiData);
  return NextResponse.json({ success: false });
}

const content = aiData.choices[0].message.content;

if (!content) {
  return NextResponse.json({ success: false });
}

let parsed;

try {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in AI response");

  parsed = JSON.parse(jsonMatch[0]);
} catch (err) {
  console.error("AI JSON parsing failed:", content);
  return NextResponse.json({ success: false, error: "Invalid AI JSON" });
}

    const portableBody = parsed.body.split("\n").map((p: string) => ({
      _type: "block",
      _key: crypto.randomUUID(),
      children: [
        {
          _type: "span",
          _key: crypto.randomUUID(),
          text: p,
        },
      ],
    }));

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
});

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}