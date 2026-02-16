import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { getRandomArticleFromRSS } from "@/lib/rss";

export const runtime = "nodejs";

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const count = Number(url.searchParams.get("count") || 1);

  let created = 0;

  for (let i = 0; i < count; i++) {
    const rssArticle = await getRandomArticleFromRSS();

    if (!rssArticle?.title) continue;

    const existing = await sanity.fetch(
      `*[_type=="post" && title==$title][0]`,
      { title: rssArticle.title }
    );

    if (existing) continue;

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
              content: rssArticle.title,
            },
          ],
        }),
      }
    );

    if (!aiRes.ok) continue;

    const aiData = await aiRes.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) continue;

    const titleMatch = content.match(/TITLE:\s*(.*?)\n/);
    const bodyMatch = content.match(/BODY:\s*([\s\S]*)/);

    if (!titleMatch || !bodyMatch) continue;

    const parsedTitle = titleMatch[1].trim();
    const parsedBody = bodyMatch[1].trim();

    const portableBody = parsedBody
      .split("\n")
      .filter((p: string) => p.trim() !== "")
.map((p: string) => ({
        _type: "block",
        children: [{ _type: "span", text: p }],
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

    created++;
  }

  return NextResponse.json({ success: true, created });
}