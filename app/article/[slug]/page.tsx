import ForYou from "@/components/ForYou";
import Header from "@/components/Header";
import Link from "next/link";
import { client } from "@/lib/sanity";
import { cache } from "react";

export const revalidate = 60;

const getPosts = cache(async () => {
  return await client.fetch(`
  {
    "all": *[_type == "post"] | order(publishedAt desc){
      title,
      slug,
      body,
      views,
      publishedAt,
      "excerpt": pt::text(body)[0..160],
      "categories": categories[]->title
    },

    "trendingRaw": *[_type=="post" && defined(views)]{
      title,
      slug,
      views,
      publishedAt
    } | order(publishedAt desc)[0..12],

    "india": *[_type=="post" && "India" in categories[]->title]
      | order(publishedAt desc)[0..5]{
        title,
        slug,
        "excerpt": pt::text(body)[0..140]
      },

    "world": *[_type=="post" && "World" in categories[]->title]
      | order(publishedAt desc)[0..5]{
        title,
        slug,
        "excerpt": pt::text(body)[0..140]
      }
  }
  `);
});

export default async function Home() {
  const data = await getPosts();
  const posts = data.all || [];

  const trending = (data.trendingRaw || [])
    .map((p: any) => {
      const hours =
        (Date.now() - new Date(p.publishedAt).getTime()) / 3600000;
      const recencyBoost = Math.max(0, 48 - hours);
      const score = (p.views || 0) + recencyBoost * 5;
      return { ...p, score };
    })
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 5);

  return (
    <main className="bg-black text-white min-h-screen">
      <Header />

      <section className="max-w-7xl mx-auto px-6 mt-16 space-y-16">

        {posts.map((post: any) => (
          <Link key={post.slug.current} href={`/article/${post.slug.current}`}>
            <div className="border-b border-gray-800 pb-10 cursor-pointer hover:opacity-80 transition">
              <h2 className="text-4xl font-serif mb-4">
                {post.title}
              </h2>

              <p className="text-gray-400">
                {post.excerpt}
              </p>

              <p className="text-xs text-gray-500 mt-3">
                {post.publishedAt &&
                  new Date(post.publishedAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          </Link>
        ))}

      </section>

      <div className="max-w-7xl mx-auto px-6 mt-20 border-t border-gray-800 pt-10">
        <ForYou posts={JSON.parse(JSON.stringify(posts))} />
      </div>

    </main>
  );
}