import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { getRandomArticleFromRSS } from "@/lib/rss";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

export async function GET(req: Request) {
  // 🔐 CRON SECURITY
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" });
  }

  try {
    // 🕒 IST Time Check (6AM–7PM)
    const now = new Date();
    const ist = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const hour = ist.getHours();

    if (hour < 6 || hour >= 19) {
      return NextResponse.json({ message: "Outside publishing window" });
    }

    // 📰 Get RSS Article
    const rssArticle = await getRandomArticleFromRSS();

    if (!rssArticle || !rssArticle.title) {
      return NextResponse.json({ error: "No RSS article found" });
    }

    const rssTitle = rssArticle.title.trim();

    // 🚫 Prevent duplicates
    const existing = await sanity.fetch(
      `*[_type=="post" && title==$title][0]`,
      { title: rssTitle }
    );

    if (existing) {
      return NextResponse.json({ message: "Already published" });
    }

    // 🤖 Call OpenRouter
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
  "title": "Professional headline",
  "body": "400-600 word article",
  "altText": "SEO image description"
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

    // 🧠 SAFE JSON PARSE
    let parsed;

    try {
      let cleaned = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u0000-\u001F]+/g, "")
        .trim();

      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

      if (!jsonMatch) throw new Error("No JSON found");

      parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("AI JSON ERROR:", content);
      return NextResponse.json({ error: "Invalid AI JSON format" });
    }

    // 📝 Convert to Sanity Portable Text
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

    // 💾 Save
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
      imageAlt: parsed.altText || "",
      views: 0,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ error: "Server crashed" });
  }
}