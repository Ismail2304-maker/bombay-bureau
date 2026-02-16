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

const CATEGORY_MAP: Record<string, string> = {
  India: "18088637-4ede-4976-b169-d55b6a298d8e",
  World: "b4863bf0-a551-4f82-b18c-33b5f76d077e",
  Politics: "fdf8818a-8773-47a9-8f4b-d38822882b69",
  Business: "4fe8a141-3319-46b8-a2c4-3667ac8ba5e7",
  Technology: "001e7baf-fe5b-44f2-9e2c-74a59c69890e",
};

function detectCategory(title: string) {
  const lower = title.toLowerCase();

  if (/\b(india|andhra pradesh|arunachal pradesh|assam|bihar|chhattisgarh|goa|gujarat|haryana|himachal pradesh|jharkhand|karnataka|kerala|madhya pradesh|maharashtra|manipur|meghalaya|mizoram|nagaland|odisha|punjab|rajasthan|sikkim|tamil nadu|telangana|tripura|uttar pradesh|uttarakhand|west bengal|andaman|chandigarh|dadra|daman|delhi|jammu|kashmir|ladakh|lakshadweep|puducherry)\b/.test(lower))
    return "India";

  if (/\b(election|parliament|minister|government|policy|senate|congress|vote|assembly|bill|cabinet)\b/.test(lower))
    return "Politics";

  if (/\b(stock|gdp|fund|market|investment|economy|private equity|firm|company|corporate|earnings|revenue|ipo|acquisition|merger|finance|bank|industry|inflation|trade)\b/.test(lower))
    return "Business";

  if (/\b(artificial intelligence|technology|software|startup|chip|digital|ai|data|cyber|robot|semiconductor|cloud|app|platform)\b/.test(lower))
    return "Technology";

  return "World";
}

export async function GET() {
  try {
    const apiKey = process.env.GNEWS_API_KEY;
    const aiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey || !aiKey) {
      return NextResponse.json({ error: "Missing API keys" }, { status: 500 });
    }

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const response = await fetch(
      `https://gnews.io/api/v4/search?q=India OR Business OR Technology OR World&lang=en&max=10&apikey=${apiKey}`
    );

    const data = await response.json();

    if (!data?.articles?.length) {
      return NextResponse.json({ error: "No articles found" }, { status: 404 });
    }

    const recentArticles = data.articles.filter((article: any) =>
      new Date(article.publishedAt) >= threeDaysAgo
    );

    if (!recentArticles.length) {
      return NextResponse.json(
        { error: "No recent articles within 3 days" },
        { status: 404 }
      );
    }

    const selected =
      recentArticles[Math.floor(Math.random() * recentArticles.length)];

    // ---------------- AI REWRITE ----------------

    const aiRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${aiKey}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct",
          temperature: 0.7,
          max_tokens: 1600,
          messages: [
            {
              role: "system",
              content: `
You are a professional newsroom journalist.

Rewrite the provided news into a detailed article.

STRICT REQUIREMENTS:
- Target 400–700 words, but ensure article remains between 400 and 700 words.
- Maintain factual accuracy.
- No fake quotes.
- No dramatic tone.
- First line must be headline only.
- No markdown.
`,
            },
            {
              role: "user",
              content: `
Original Headline:
${selected.title}

Description:
${selected.description}

Source:
${selected.source?.name}

Published:
${selected.publishedAt}
`,
            },
          ],
        }),
      }
    );

    const aiData = await aiRes.json();
    const aiText = aiData?.choices?.[0]?.message?.content;

    if (!aiText) {
      return NextResponse.json({ error: "AI failed" }, { status: 500 });
    }

    const lines = aiText.split("\n");
    let title = lines[0]?.trim() || "";
    let body = lines.slice(1).join("\n").trim();
    let wordCount = body.split(/\s+/).length;

    if (wordCount < 400 || wordCount > 700) {
      return NextResponse.json(
        { error: "AI word count unstable" },
        { status: 400 }
      );
    }

    // ---------------- Portable Text ----------------

    const portableBody = body
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

    const categoryName = detectCategory(title);
    const categoryId = CATEGORY_MAP[categoryName];

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 96);

    // ---------------- SAFE IMAGE UPLOAD ----------------

    let mainImageField = undefined;

    if (selected.image) {
      try {
        const imageRes = await fetch(selected.image);
        const buffer = await imageRes.arrayBuffer();

        const asset = await sanity.assets.upload(
          "image",
          Buffer.from(buffer),
          { filename: "news-image.jpg" }
        );

        mainImageField = {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        };
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    }

    // ---------------- Publish ----------------

    await sanity.create({
      _type: "post",
      title,
      slug: { current: slug },
      body: portableBody,
      categories: [
        {
          _type: "reference",
          _key: crypto.randomUUID(),
          _ref: categoryId,
        },
      ],
      author: {
        _type: "reference",
        _ref: "0664ef92-6a72-48c3-b1bf-2e2b73ac67c9",
      },
      mainImage: mainImageField,
      imageAlt: `News related to ${categoryName}`,
      publishedAt: new Date().toISOString(),
      views: 0,
    });

    return NextResponse.json({
      success: true,
      title,
      category: categoryName,
      wordCount,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}