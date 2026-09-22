import { Resend } from "resend";

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const resendAudienceId = process.env.RESEND_AUDIENCE_ID || "";

export const newsletterFrom =
  process.env.RESEND_FROM_EMAIL || "The Bombay Brief <onboarding@resend.dev>";
