import { client } from "@/lib/sanity";

const siteUrl = "https://bombay-bureau.vercel.app";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\x27/g, "&apos;");
}

export async function GET() {
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const posts = await client.fetch(
    `*[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt >= $cutoff && !("Video" in categories[]->title)] | order(publishedAt desc)[0..999]{
      title,
      slug,
      publishedAt
    }`,
    { cutoff }
  );

  const urls = posts
    .map(
      (post: any) => `
        <url>
          <loc>${siteUrl}/article/${escapeXml(post.slug.current)}</loc>
          <news:news>
            <news:publication>
              <news:name>BOMBAY BUREAU</news:name>
              <news:language>en</news:language>
            </news:publication>
            <news:publication_date>${escapeXml(post.publishedAt)}</news:publication_date>
            <news:title>${escapeXml(post.title)}</news:title>
          </news:news>
        </url>
      `
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
>
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
