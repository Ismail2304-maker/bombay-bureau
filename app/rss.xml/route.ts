import { client } from "@/lib/sanity";

const siteUrl = "https://bombay-bureau.vercel.app";

function escapeXml(value: string) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await client.fetch(`
    *[
      _type == "post" &&
      !(_id in path("drafts.**")) &&
      coalesce(workflowStatus, "published") == "published" &&
      defined(slug.current) &&
      defined(publishedAt) &&
      coalesce(contentType, "news") == "news"
    ] | order(publishedAt desc)[0..49]{
      title,
      slug,
      publishedAt,
      excerpt,
      "fallbackExcerpt": pt::text(body)[0..240]
    }
  `);

  const items = (posts || []).map((post: any) => {
    const description = post.excerpt || post.fallbackExcerpt || "";
    const url = `${siteUrl}/article/${post.slug.current}`;
    return `<item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>BOMBAY BUREAU</title>
    <link>${siteUrl}</link>
    <description>Global affairs, Indian perspective.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
