import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

function isAuthorized(request: Request) {
  const expected = process.env.NEWSLETTER_ADMIN_TOKEN;
  const authorization = request.headers.get("authorization") || "";
  return Boolean(
    expected &&
      authorization.startsWith("Bearer ") &&
      authorization.slice(7) === expected
  );
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const issues = await client.fetch(
      `*[_type == "newsletterIssue" && status == "ready"] | order(coalesce(scheduledAt, _createdAt) desc){
        _id,
        title,
        subject,
        previewText,
        scheduledAt,
        "featuredCount": count(featuredPosts)
      }`
    );

    return NextResponse.json({ issues });
  } catch {
    return NextResponse.json(
      { error: "Unable to load newsletter issues right now." },
      { status: 500 }
    );
  }
}
