import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET() {
  try {
    const stats = await client.fetch(`
    {
      "totalReads": count(*[_type=="view"]),
      "todayReads": count(*[_type=="view" && _createdAt > now()-86400]),
      "topArticles": *[_type=="post"]{
        title,
        "views": count(*[_type=="view" && post._ref == ^._id])
      } | order(views desc)[0..4]
    }
    `);

    return NextResponse.json(stats);
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}