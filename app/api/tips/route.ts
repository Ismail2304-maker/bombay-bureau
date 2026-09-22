import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

function validUrl(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const articleUrl = String(body?.articleUrl || "").trim();
    const message = String(body?.message || "").trim();
    const honeypot = String(body?.website || "").trim();

    if (honeypot) return NextResponse.json({ ok: true });
    if (!message || message.length < 20) return NextResponse.json({ error: "Please provide a little more detail in your tip." }, { status: 400 });
    if (message.length > 10000 || name.length > 120 || email.length > 254 || articleUrl.length > 2048) return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Please check the email address." }, { status: 400 });
    if (!validUrl(articleUrl)) return NextResponse.json({ error: "Please enter a valid article URL." }, { status: 400 });
    if (!process.env.SANITY_API_TOKEN) return NextResponse.json({ error: "The tip desk is temporarily unavailable." }, { status: 503 });

    await client.create({
      _type: "tipSubmission",
      name: name || undefined,
      email: email || undefined,
      articleUrl: articleUrl || undefined,
      message,
      status: "new",
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to send your tip right now." }, { status: 500 });
  }
}
