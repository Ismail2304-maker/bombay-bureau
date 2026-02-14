import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a global news journalist.",
        },
        {
          role: "user",
          content:
            "Write a 500 word professional global politics breaking news article with headline.",
        },
      ],
    });

    const text = completion.choices[0].message.content;

    return new Response(text || "No content", {
      status: 200,
    });
  } catch (error) {
    return new Response("AI ERROR", { status: 500 });
  }
}