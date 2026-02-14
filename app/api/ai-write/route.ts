import OpenAI from "openai";
import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a global news journalist. Write a professional breaking news article.",
        },
        {
          role: "user",
          content:
            "Write a 600 word global politics news article with headline and body.",
        },
      ],
    });

    const text = completion.choices[0].message.content || "";

    // Split headline + body
    const lines = text.split("\n");
    const title = lines[0];
    const body = lines.slice(1).join("\n");

    // Save to Sanity
    await client.create({
      _type: "post",
      title,
      slug: {
        _type: "slug",
        current: title.toLowerCase().replace(/\s+/g, "-").slice(0, 90),
      },
      body,
      publishedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI failed" });
  }
}