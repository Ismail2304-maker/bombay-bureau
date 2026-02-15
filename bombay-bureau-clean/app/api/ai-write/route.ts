import OpenAI from "openai";

export async function GET() {
  return new Response(
    JSON.stringify({ status: "API route working" }),
    { headers: { "Content-Type": "application/json" } }
  );
}