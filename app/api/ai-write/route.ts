import OpenAI from "openai";

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

    const article = completion.choices[0].message.content;

    return new Response(article, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });

  } catch (error) {
    console.error(error);
    return new Response("Error generating article", { status: 500 });
  }
}