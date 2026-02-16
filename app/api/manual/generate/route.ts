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

const CATEGORIES = ["India", "World", "Politics", "Business", "Technology"];

const CATEGORY_MAP: Record<string, string> = {
  India: "18088637-4ede-4976-b169-d55b6a298d8e",
  World: "b4863bf0-a551-4f82-b18c-33b5f76d077e",
  Politics: "fdf8818a-8773-47a9-8f4b-d38822882b69",
  Business: "4fe8a141-3319-46b8-a2c4-3667ac8ba5e7",
  Technology: "001e7baf-fe5b-44f2-9e2c-74a59c69890e",
};

function getRandomCategories() {
  const shuffled = [...CATEGORIES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 2) + 1);
}

export async function GET(request: Request) {
  try {

    // 🔐 SECRET CHECK
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    if (secret !== process.env.PUBLISH_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const selectedCategories = getRandomCategories();

    const aiRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct",
          max_tokens: 1600,
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content: `
You are a professional newsroom journalist.

Return your response EXACTLY in this format:

TITLE:
<Headline here>

BODY:
<500-600 word detailed article here>

No markdown.
No extra commentary.
              `,
            },
            {
              role: "user",
              content:
                "Write a realistic current breaking news article related to: " +
                selectedCategories.join(", "),
            },
          ],
        }),
      }
    );

    if (!aiRes.ok) {
      const err = await aiRes.text();
      console.log("AI error:", err);
      return NextResponse.json({ success: false, error: "AI failed" });
    }

    const data = await aiRes.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      return NextResponse.json({ success: false, error: "AI empty" });
    }

    const cleaned = text.replace(/[\u0000-\u001F]+/g, "").trim();

    const titleMatch = cleaned.match(/TITLE:\s*([\s\S]*?)\s*BODY:/);
const bodyMatch = cleaned.match(/BODY:\s*([\s\S]*)/);

   const bodyIndex = cleaned.indexOf("BODY:");

if (bodyIndex === -1) {
  console.log("Format mismatch:", cleaned);
  return NextResponse.json({ success: false, error: "Format incorrect" });
}

const title = cleaned
  .substring(0, bodyIndex)
  .replace("TITLE:", "")
  .replace(/\*\*/g, "")  // removes ** bold
  .replace(/\*/g, "")    // removes stray *
  .trim();

const bodyText = cleaned
  .substring(bodyIndex + 5) // skip "BODY:"
  .trim();

const wordCount = bodyText.split(/\s+/).length;

if (wordCount < 450) {
  return NextResponse.json({
    success: false,
    error: "Article too short",
  });
}

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

    const categoryRefs = selectedCategories.map((cat) => ({
      _type: "reference",
      _key: crypto.randomUUID(),
      _ref: CATEGORY_MAP[cat],
    }));

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 96);

    await sanity.create({
      _type: "post",
      title,
      slug: { current: slug },
      body: portableBody,
      categories: categoryRefs,
      author: {
        _type: "reference",
        _ref: "0664ef92-6a72-48c3-b1bf-2e2b73ac67c9",
      },
      imageAlt: `News related to ${selectedCategories.join(", ")}`,
      publishedAt: new Date().toISOString(),
      views: 0,
    });

    return NextResponse.json({
      success: true,
      words: wordCount,
      categories: selectedCategories,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
