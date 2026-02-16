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
    // 🕒 IST TIME CHECK (6 AM – 7 PM)
    const now = new Date();
    const ist = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const hour = ist.getHours();

    if (hour < 6 || hour >= 19) {
      return NextResponse.json({ message: "Outside publishing window" });
    }

    // 📰 FETCH RSS ARTICLE
    const rssArticle = await getRandomArticleFromRSS();

    if (!rssArticle || !rssArticle.title) {
      return NextResponse.json({ error: "No RSS article found" });
    }

    const rssTitle = rssArticle.title.trim();

    // 🚫 DUPLICATE CHECK
    const existing = await sanity.fetch(
      `*[_type=="post" && title==$title][0]`,
      { title: rssTitle }
    );

    if (existing) {
      return NextResponse.json({ message: "Already published" });
    }

    // 🤖 CALL OPENROUTER (STRICT JSON MODE)
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
          response_format: { type: "json_object" }, // 🔥 Forces clean JSON
          messages: [
            {
              role: "system",
              content:
                "Return ONLY valid JSON with keys: title, body, altText. No markdown. No explanation.",
            },
            {
              role: "user",
              content: `Rewrite this into a 400-600 word professional news article:\n\n${rssTitle}`,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI REQUEST FAILED:", errText);
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
      parsed = JSON.parse(content);
    } catch (error) {
      console.error("JSON Parse Error:", content);
      return NextResponse.json({ error: "JSON parsing failed" });
    }

    const bodyText = parsed.body || "";

    // 📝 Convert to Sanity Portable Text
    const portableBody = bodyText
      .split("\n")
      .filter((p: string) => p.trim() !== "")
      .map((p: string) => ({
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

    // 💾 SAVE TO SANITY
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
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ error: "Server crashed" });
  }
}