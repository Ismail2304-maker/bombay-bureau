import OpenAI from "openai"
import { client } from "@/lib/sanity"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a global newsroom journalist writing for a professional news site called Bombay Bureau.",
        },
        {
          role: "user",
          content:
            "Write a breaking global news article with headline and 600 words body. Professional tone.",
        },
      ],
    })

    const text = completion.choices[0].message.content

    console.log(text)

    return Response.json({
      success: true,
      article: text,
    })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "AI failed" })
  }
}