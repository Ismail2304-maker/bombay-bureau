import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import { resend, resendSegmentId } from "@/lib/resend";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const honeypot = String(body?.website || "").trim();

    if (honeypot) return NextResponse.json({ ok: true });
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (email.length > 254) {
      return NextResponse.json({ error: "Email address is too long." }, { status: 400 });
    }
    if (!process.env.SANITY_API_TOKEN) {
      return NextResponse.json({ error: "Newsletter signup is temporarily unavailable." }, { status: 503 });
    }

    const existing = await client.fetch(
      `count(*[_type == "newsletterSubscriber" && email == $email])`,
      { email }
    );

    if (existing === 0) {
      await client.create({
        _type: "newsletterSubscriber",
        email,
        status: "active",
        source: "website",
        subscribedAt: new Date().toISOString(),
      });
    }

    // Resend now uses global Contacts. The old audienceId parameter is
    // deprecated. A contact can optionally be added to one or more Segments.
    // Sanity remains the newsroom-facing mirror.
    if (resend) {
      const { error } = await resend.contacts.create({
        email,
        unsubscribed: false,
        ...(resendSegmentId
          ? { segments: [{ id: resendSegmentId }] }
          : {}),
      });

      if (error) {
        return NextResponse.json(
          { error: "We saved your signup, but the email delivery service is not ready yet." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json({
      ok: true,
      message: "You're on the list.",
      deliveryReady: Boolean(resend),
      segmented: Boolean(resend && resendSegmentId),
    });
  } catch {
    return NextResponse.json({ error: "Unable to process your signup right now." }, { status: 500 });
  }
}
