import { NextResponse } from "next/server";
import OpenAI from "openai";
import { client } from "@/lib/sanity";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
    baseURL: process.env.OPENAI_BASE_URL,
});

export async function GET() {
  try {
    console.log("AUTO NEWS RUNNING");

    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "user",
          content:
            "Write a 700 word professional news article about India or global politics. Include headline.",
        },
      ],
    });

    const text = completion.choices[0].message.content || "";

    const title = text.split("\n")[0].replace("#", "").trim();
    const body = text.replace(title, "").trim();

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 80);

    await client.create({
      _type: "post",
      title,
      slug: { current: slug },
      body: [
        {
          _type: "block",
          children: [{ _type: "span", text: body }],
        },
      ],
      publishedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "failed" });
  }
}