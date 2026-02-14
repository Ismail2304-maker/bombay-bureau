import { NextResponse } from "next/server"
import { client } from "@/lib/sanity"
import OpenAI from "openai"

export const runtime = "nodejs"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function GET() {
  try {

    const prompt = `
Write a professional global news article.
Tone: international but India-aware.
Length: 500-700 words.
Include headline and body.
Topic: latest geopolitics, India, world affairs or economy.
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    })

    const text = completion.choices[0].message.content || ""

    const title = text.split("\n")[0].replace("#", "").trim()

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 80)

    await client.create({
      _type: "post",
      title,
      slug: { current: slug },
      body: [
        {
          _type: "block",
          children: [
            {
              _type: "span",
              text,
            },
          ],
        },
      ],
      publishedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })

  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: "failed" })
  }
}