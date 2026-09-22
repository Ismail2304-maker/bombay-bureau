import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import { resend } from "@/lib/resend";

function getHeader(request: Request, ...names: string[]) {
  for (const name of names) {
    const value = request.headers.get(name);
    if (value) return value;
  }
  return "";
}

export async function POST(request: Request) {
  if (!resend || !process.env.RESEND_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  try {
    const payload = await request.text();

    const event = resend.webhooks.verify({
      payload,
      headers: {
        id: getHeader(request, "svix-id", "webhook-id"),
        timestamp: getHeader(request, "svix-timestamp", "webhook-timestamp"),
        signature: getHeader(request, "svix-signature", "webhook-signature"),
      },
      webhookSecret: process.env.RESEND_WEBHOOK_SECRET,
    });

    if (event.type === "contact.updated") {
      const email = String(event.data?.email || "").trim().toLowerCase();

      if (email) {
        const subscriberId = await client.fetch(
          `*[_type == "newsletterSubscriber" && email == $email][0]._id`,
          { email }
        );

        if (subscriberId) {
          await client
            .patch(subscriberId)
            .set({
              status: event.data?.unsubscribed ? "unsubscribed" : "active",
            })
            .commit();
        }
      }
    }

    if (event.type === "email.bounced" || event.type === "email.complained") {
      const recipients = Array.isArray(event.data?.to)
        ? event.data.to
        : [];

      for (const recipient of recipients) {
        const email = String(recipient || "").trim().toLowerCase();
        if (!email) continue;

        const subscriberId = await client.fetch(
          `*[_type == "newsletterSubscriber" && email == $email][0]._id`,
          { email }
        );

        if (subscriberId) {
          await client
            .patch(subscriberId)
            .set({ status: "unsubscribed" })
            .commit();
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid webhook." }, { status: 400 });
  }
}
