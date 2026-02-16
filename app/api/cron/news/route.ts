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

export async function GET(req: Request) {
  // 🔐 CRON SECURITY
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" });
  }

  try {
    const now = new Date();
    const ist = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const hour = ist.getHours();

    if (hour < 6 || hour >= 19) {
      return NextResponse.json({ message: "Outside publishing window" });
    }

    // 🎯 FETCH RSS
    const feedUrl =
      RSS_FEEDS[Math.floor(Math.random() * RSS_FEEDS.length)];
    const rssRes = await fetch(feedUrl);

    if (!rssRes.ok) {
      return NextResponse.json({ error: "RSS fetch failed" });
    }

    const xml = await rssRes.text();

    const matches = [...xml.matchAll(/<title>(.*?)<\/title>/g)];
    if (!matches || matches.length < 2) {
      return NextResponse.json({ error: "No RSS title found" });
    }

    const rssTitle = matches[1][1]
      .replace(/<!\[CDATA\[(.*?)\]\]>/, "$1")
      .trim();

    // 🛑 CHECK DUPLICATE
    const existing = await sanity.fetch(
      `*[_type=="post" && title==$title][0]`,
      { title: rssTitle }
    );

    if (existing) {
      return NextResponse.json({ message: "Already published" });
    }

    // 🤖 CALL OPENROUTER
    const aiRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct",
          messages: [
            {
              role: "system",
              content: `Return ONLY valid JSON:
{
  "title": "Headline",
  "body": "Article body text",
  "altText": "Image alt description"
}`,
            },
            {
              role: "user",
              content: rssTitle,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    if (!aiRes.ok) {
      return NextResponse.json({ error: "AI request failed" });
    }

    const aiData = await aiRes.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "AI returned empty content" });
    }

    // 🧠 SAFER JSON PARSE (clean AI output first)
let parsed;

try {
  const cleaned = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/[\u0000-\u001F]+/g, "") // remove control characters
    .trim();

  parsed = JSON.parse(cleaned);

} catch (error) {
  console.error("AI JSON Parse Failed:");
  console.error(content);
  return NextResponse.json({ error: "Invalid AI JSON format" });
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
    return NextResponse.json({ error: "Server crashed" });
  }
}