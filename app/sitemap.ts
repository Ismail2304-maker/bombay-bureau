import { client } from "@/lib/sanity"

export default async function sitemap() {
  const posts = await client.fetch(`
    *[_type=="post"]{
      "slug": slug.current,
      _updatedAt
    }
  `)

  const baseUrl = "https://bombay-bureau.vercel.app"

  const postUrls = posts.map((post:any) => ({
    url: `${baseUrl}/article/${post.slug}`,
    lastModified: post._updatedAt,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...postUrls,
  ]
}