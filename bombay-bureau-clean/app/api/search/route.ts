import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) return NextResponse.json([]);

  const results = await client.fetch(
    `*[_type=="post" && title match $q + "*"] | order(publishedAt desc)[0..20]{
      title,
      slug,
      mainImage,
      "excerpt": pt::text(body)[0..120],
      "category": categories[0]->title,
      publishedAt
    }`,
    { q }
  );

  return NextResponse.json(results);
}