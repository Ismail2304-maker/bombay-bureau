import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET() {
  const posts = await client.fetch(`
    *[_type=="post"] | order(_createdAt desc)[0..5]{
      title,
      slug
    }
  `);

  return NextResponse.json(posts);
}