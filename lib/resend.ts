import { Resend } from "resend";

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Resend's current Contacts model is global. Segments replace the old
// Audience model and are optional for contact creation.
export const resendSegmentId = process.env.RESEND_SEGMENT_ID || "";

export const newsletterFrom =
  process.env.RESEND_FROM_EMAIL || "The Bombay Brief <onboarding@resend.dev>";

export async function getNewsletterSegmentId() {
  if (!resend) return null;
  if (resendSegmentId) return resendSegmentId;

  const { data, error } = await resend.segments.list({ limit: 100 });
  if (error) return null;

  const existing = data?.data?.find(
    (segment) => segment.name === "The Bombay Brief"
  );

  if (existing?.id) return existing.id;

  const created = await resend.segments.create({
    name: "The Bombay Brief",
  });

  if (created.error) return null;
  return created.data?.id || null;
}
