import { Resend } from "resend";

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Resend's current Contacts model is global. Segments replace the old
// Audience model and are optional for contact creation.
export const resendSegmentId = process.env.RESEND_SEGMENT_ID || "";

export const newsletterFrom =
  process.env.RESEND_FROM_EMAIL || "The Bombay Brief <onboarding@resend.dev>";
