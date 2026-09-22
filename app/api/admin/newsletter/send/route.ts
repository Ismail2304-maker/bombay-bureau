import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import { getNewsletterSegmentId, newsletterFrom, resend } from "@/lib/resend";
import { renderNewsletterHtml } from "@/lib/newsletter";

function isAuthorized(request: Request) {
  const expected = process.env.NEWSLETTER_ADMIN_TOKEN;
  const authorization = request.headers.get("authorization") || "";
  return Boolean(
    expected &&
      authorization.startsWith("Bearer ") &&
      authorization.slice(7) === expected
  );
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!resend) {
    return NextResponse.json({ error: "Resend is not configured." }, { status: 503 });
  }

  if (!process.env.SANITY_API_TOKEN) {
    return NextResponse.json({ error: "Sanity write access is not configured." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const issueId = String(body?.issueId || "").trim();

    if (!issueId) {
      return NextResponse.json({ error: "Newsletter issue ID is required." }, { status: 400 });
    }

    const issue = await client.fetch(
      `*[_type == "newsletterIssue" && _id == $issueId][0]{
        _id,
        title,
        subject,
        previewText,
        intro,
        body,
        status,
        resendBroadcastId,
        featuredPosts[]->{
          title,
          slug,
          excerpt,
          workflowStatus
        }
      }`,
      { issueId }
    );

    if (!issue) {
      return NextResponse.json({ error: "Newsletter issue not found." }, { status: 404 });
    }

    if (issue.status !== "ready") {
      return NextResponse.json(
        { error: "Only newsletter issues marked Ready can be sent." },
        { status: 409 }
      );
    }

    if (issue.resendBroadcastId) {
      return NextResponse.json(
        { error: "This issue already has a Resend Broadcast ID." },
        { status: 409 }
      );
    }

    const segmentId = await getNewsletterSegmentId();

    if (!segmentId) {
      return NextResponse.json(
        { error: "The Bombay Brief Resend segment is not available yet." },
        { status: 503 }
      );
    }

    const html = renderNewsletterHtml(issue);

    const { data, error } = await resend.broadcasts.create({
      segmentId,
      from: newsletterFrom,
      subject: issue.subject,
      html,
      send: true,
    });

    if (error || !data?.id) {
      return NextResponse.json(
        { error: error?.message || "Resend could not create the broadcast." },
        { status: 502 }
      );
    }

    await client
      .patch(issueId)
      .set({
        status: "sent",
        sentAt: new Date().toISOString(),
        resendBroadcastId: data.id,
      })
      .commit();

    return NextResponse.json({
      ok: true,
      broadcastId: data.id,
      message: "The Bombay Brief broadcast was sent to the newsletter segment.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to send the newsletter issue right now." },
      { status: 500 }
    );
  }
}
