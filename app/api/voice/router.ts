import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text } = await req.json();

  const res = await fetch(
    "https://api.elevenlabs.io/v1/text-to-speech/Rachel",
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.8,
        },
      }),
    }
  );

  const audio = await res.arrayBuffer();

  return new Response(audio, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}