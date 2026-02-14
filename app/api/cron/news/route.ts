import { NextResponse } from "next/server"
import { client } from "@/lib/sanity"
import OpenAI from "openai"
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET() {
  try {
    const prompt = `
Write a professional global news article.
600 words.
Include headline and full body.
India + world geopolitics focus.
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    })

    const text = completion.choices[0].message.content || ""

    const title = text.split("\n")[0].replace("#", "").trim()
    const bodyText = text.replace(title, "").trim()

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
            { _type: "span", text: bodyText }
          ]
        }
      ],
      publishedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "failed" })
  }
}