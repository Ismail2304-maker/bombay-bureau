import type { MetadataRoute } from "next";
import { client } from "@/lib/sanity";

const baseUrl = "https://bombay-bureau.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await client.fetch(`
    *[_type == "post" && defined(slug.current)]{
      "slug": slug.current,
      publishedAt,
      _updatedAt
    }
  `);

  const staticPaths = [
    "",
    "/about",
    "/contact",
    "/india",
    "/world",
    "/politics",
    "/business",
    "/markets",
    "/technology",
    "/opinion",
    "/explainers",
    "/video",
    "/privacy",
    "/terms",
    "/editorial-standards",
    "/ai-policy",
    "/corrections",
    "/author/muhammed-ismail",
  ];

  const staticUrls = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
  }));

  const postUrls = posts.map((post: any) => ({
    url: `${baseUrl}/article/${post.slug}`,
    lastModified: post._updatedAt || post.publishedAt || undefined,
  }));

  return [...staticUrls, ...postUrls];
}
