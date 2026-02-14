import { NextResponse } from "next/server"
import { client } from "@/lib/sanity"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET() {
  try {

    const prompt = `
Write a breaking global news article in Reuters style.
600-800 words.
Include headline and body.
Topic: Latest world geopolitics or India.
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    })

    const text = completion.choices[0].message.content || ""

    const title = text.split("\n")[0].replace("#", "").trim()
    const body = text.replace(title, "")

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 80)

    await client.create({
      _type: "post",
      title,
      slug: { current: slug },
      body,
      publishedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    return NextResponse.json({ error: "failed" })
  }
}