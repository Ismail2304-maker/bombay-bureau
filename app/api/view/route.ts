import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function POST(req: Request) {
  const { slug } = await req.json();

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" });
  }

  const post = await client.fetch(
    `*[_type=="post" && slug.current==$slug][0]{_id, views}`,
    { slug }
  );

  if (!post) {
    return NextResponse.json({ error: "Not found" });
  }

  await client
    .patch(post._id)
    .setIfMissing({ views: 0 })
    .inc({ views: 1 })
    .commit();

  return NextResponse.json({ success: true });
}