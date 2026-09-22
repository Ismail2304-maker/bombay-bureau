# Phase A — Production Activation

Phase A engineering is complete. The remaining work is account-level activation and final verification.

## Vercel

Set these Production environment variables:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL=The Bombay Brief <onboarding@resend.dev>` for testing
- `SANITY_API_TOKEN`
- `NEWSLETTER_ADMIN_TOKEN`
- `RESEND_WEBHOOK_SECRET`

Optional:

- `RESEND_SEGMENT_ID`

## Resend

1. Keep the API key server-side.
2. Use the test sender while validating the workflow.
3. Create a webhook pointing to:
   `https://bombay-bureau.vercel.app/api/webhooks/resend`
4. Subscribe the webhook to contact updates and email delivery failure events used by the application.
5. Copy the webhook signing secret into `RESEND_WEBHOOK_SECRET`.
6. For branded production sending, verify `bombaybureau.com` and replace the test sender with a verified address.

Resend's current model uses global Contacts and Segments. The application does not require the deprecated Audience ID model.

## Firebase

Enable Firestore and publish `firestore.rules` for the `bombay-bureau` project.

The rules allow each authenticated reader to access only their own:

- `readerProfiles/{uid}`
- `savedArticles/{uid}/items/{slug}`

## Final verification

After the next production deployment:

1. Join The Bombay Brief from the homepage.
2. Confirm the subscriber appears in Sanity.
3. Confirm the contact appears in Resend.
4. Create a Newsletter Issue in Sanity.
5. Mark it Ready.
6. Open Admin → Newsletter Desk.
7. Load Ready Issues.
8. Send the test issue.
9. Confirm the Resend Broadcast ID and Sent status in Sanity.
10. Confirm the email arrives.
11. Test unsubscribe/bounce handling.
12. Sign in on two devices and verify saved stories sync.

Do not mark Phase A production-verified until these checks pass.
