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
  try {
    const rssArticle = await getRandomArticleFromRSS();

    if (!rssArticle || !rssArticle.title) {
      return NextResponse.json({ success: false, error: "No RSS title" });
    }

    const rssTitle = rssArticle.title.trim();

    // Prevent duplicates
    const existing = await sanity.fetch(
      `*[_type=="post" && title==$title][0]`,
      { title: rssTitle }
    );

    if (existing) {
      return NextResponse.json({ success: false, message: "Already exists" });
    }

    // Call OpenRouter
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
              content:
                "Write a 500 word professional news article. Format strictly as:\nTITLE: headline\nBODY:\narticle text",
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
      return NextResponse.json({ success: false, error: "AI failed" });
    }

    const aiData = await aiRes.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ success: false, error: "AI empty" });
    }

    const titleMatch = content.match(/TITLE:\s*(.*?)\n/);
    const bodyMatch = content.match(/BODY:\s*([\s\S]*)/);

    if (!titleMatch || !bodyMatch) {
      return NextResponse.json({ success: false, error: "AI format invalid" });
    }

    const parsedTitle = titleMatch[1].trim();
    const parsedBody = bodyMatch[1].trim();

    const portableBody = parsedBody
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

    await sanity.create({
      _type: "post",
      title: parsedTitle,
      slug: {
        _type: "slug",
        current: parsedTitle
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
    return NextResponse.json({ success: false, error: "Server error" });
  }
}