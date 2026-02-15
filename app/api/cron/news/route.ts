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

export async function GET() {
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

    const titleMatch = xml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
    if (!titleMatch) return NextResponse.json({ error: "No RSS title" });

    const rssTitle = titleMatch[1];

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
            content: "Rewrite into a professional 500-word news article. Return ONLY JSON with { title, body }"
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
    const content = aiData.choices[0].message.content;
    const parsed = JSON.parse(content);

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
        current: parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 96),
      },
      publishedAt: new Date().toISOString(),
      body: portableBody,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}