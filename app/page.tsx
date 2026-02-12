import ForYou from "@/components/ForYou";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import { cache } from "react";

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source);

export const revalidate = 60;

const getPosts = cache(async () => {
  return await client.fetch(`
  {
    "all": *[_type == "post"] | order(publishedAt desc){
      title,
      slug,
      mainImage,
      body,
      views,
      publishedAt,
      "excerpt": pt::text(body)[0..160],
      "categories": categories[]->title
    },

    "mostRead": *[_type=="post" && defined(views)]
      | order(views desc, publishedAt desc)[0..5]{
      title,
      slug,
      mainImage,
      views,
      publishedAt
    },

    "trendingRaw": *[_type=="post" && defined(views)]{
      title,
      slug,
      mainImage,
      views,
      publishedAt
    } | order(publishedAt desc)[0..12],

    "india": *[_type=="post" && "India" in categories[]->title]
      | order(publishedAt desc)[0..4]{ title, slug, mainImage },

    "world": *[_type=="post" && "World" in categories[]->title]
      | order(publishedAt desc)[0..4]{ title, slug, mainImage },

    "politics": *[_type=="post" && "Politics" in categories[]->title]
      | order(publishedAt desc)[0..4]{ title, slug, mainImage },

    "opinion": *[_type=="post" && "Opinion" in categories[]->title]
      | order(publishedAt desc)[0..4]{ title, slug, mainImage },

    "business": *[_type=="post" && "Business" in categories[]->title]
      | order(publishedAt desc)[0..4]{ title, slug, mainImage },

    "technology": *[_type=="post" && "Technology" in categories[]->title]
      | order(publishedAt desc)[0..4]{ title, slug, mainImage }
  }
  `);
});

export default async function Home() {
  const data = await getPosts();
  const posts = data.all;

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

      {/* HERO + SIDEBAR */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 px-6 mt-10">

        {/* LEFT */}
        <div className="md:col-span-2">
          {posts[0] && (
            <>
              <Link href={`/article/${posts[0].slug.current}`}>
                <div className="group cursor-pointer">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={urlFor(posts[0].mainImage).width(1600).url()}
                      alt=""
                      width={1600}
                      height={900}
                      priority
                      placeholder="blur"
                      blurDataURL={`${urlFor(posts[0].mainImage).width(20).blur(50).url()}`}
                      className="transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  </div>

                  <h2 className="text-5xl font-serif mt-6 group-hover:text-gray-300 transition-colors">
                    {posts[0].title}
                  </h2>

                  <p className="text-gray-400 mt-4 text-lg max-w-2xl">
                    {posts[0].excerpt}
                  </p>
                </div>
              </Link>

              <div className="grid grid-cols-3 gap-6 mt-6">
                {posts.slice(1, 4).map((post: any) => (
                  <Link key={post.slug.current} href={`/article/${post.slug.current}`}>
                    <div className="group cursor-pointer hover:-translate-y-1 transition-all duration-300">

                      {post.mainImage && (
                        <div className="overflow-hidden rounded-lg mb-2">
                          <Image
                            src={urlFor(post.mainImage).width(600).url()}
                            alt=""
                            width={600}
                            height={400}
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL={`${urlFor(post.mainImage).width(20).blur(50).url()}`}
                            className="transition-transform duration-700 group-hover:scale-[1.06]"
                          />
                        </div>
                      )}

                      <h3 className="font-serif group-hover:text-gray-300 transition-colors">
                        {post.title}
                      </h3>

                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-12 sticky top-32 h-fit">

          {/* LATEST */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">
              Latest
            </h3>

            {posts.slice(0, 5).map((post: any, i: number) => (
              <Link key={post.slug.current} href={`/article/${post.slug.current}`}>
                <div className="group flex gap-3 py-3 border-b border-gray-800 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  <span className="text-gray-500 font-bold">{i + 1}</span>
                  <p className="group-hover:text-gray-300 transition-colors">
                    {post.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* TRENDING */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">
              Trending
            </h3>

            {trending.map((post: any, i: number) => (
              <Link key={post.slug.current} href={`/article/${post.slug.current}`}>
                <div className="group flex gap-3 py-3 border-b border-gray-800 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  <span className="text-yellow-500 font-bold">{i + 1}</span>

                  <div>
                    <p className="group-hover:text-gray-300 transition-colors">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {post.views || 0} views
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* MOST READ */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">
              Most Read
            </h3>

            {data.mostRead.map((post: any, i: number) => (
              <Link key={post.slug.current} href={`/article/${post.slug.current}`}>
                <div className="group flex gap-3 py-3 border-b border-gray-800 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  <span className="text-red-500 font-bold">{i + 1}</span>

                  <div>
                    <p className="group-hover:text-gray-300 transition-colors">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {post.views || 0} views
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </aside>
      </section>
      <ForYou posts={JSON.parse(JSON.stringify(posts))} />
            
      {/* CATEGORY SECTIONS */}
      <section className="max-w-7xl mx-auto px-6 mt-24 space-y-24">
        {[
          { title: "India", data: data.india },
          { title: "World", data: data.world },
          { title: "Politics", data: data.politics },
          { title: "Opinion", data: data.opinion },
          { title: "Business", data: data.business },
          { title: "Technology", data: data.technology },
        ].map((section) => (
          <section key={section.title}>
            <h2 className="text-2xl font-serif mb-6 border-b border-gray-800 pb-2">
              {section.title}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {section.data?.[0] && (
                <Link href={`/article/${section.data[0].slug.current}`}>
                  <div className="group cursor-pointer hover:-translate-y-1 transition-all duration-300">
                    <Image
                      src={urlFor(section.data[0].mainImage).url()}
                      alt=""
                      width={800}
                      height={450}
                      className="rounded-lg mb-4 transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    <h3 className="text-xl font-serif group-hover:text-gray-300 transition-colors">
                      {section.data[0].title}
                    </h3>
                  </div>
                </Link>
              )}

              <div className="flex flex-col gap-6">
                {section.data?.slice(1, 4).map((post: any) => (
                  <Link key={post.slug.current} href={`/article/${post.slug.current}`}>
                    <div className="flex gap-4 group hover:translate-x-1 transition-all duration-200 cursor-pointer">
                      <Image
                        src={urlFor(post.mainImage).url()}
                        alt=""
                        width={160}
                        height={100}
                        className="rounded-md transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                      <p className="font-serif group-hover:text-gray-300 transition-colors">
                        {post.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-12 text-sm text-gray-400">
          <div>
            <h2 className="text-2xl font-serif text-white mb-4">BOMBAY BUREAU</h2>
            <p className="mb-6">About Bombay Bureau</p>
          </div>

          <div>
            <h3 className="text-white mb-4 font-semibold">MOST SEARCHED CATEGORIES</h3>
            <ul className="space-y-2">
              <li>India</li>
              <li>World</li>
              <li>Opinion</li>
              <li>Politics</li>
              <li>Business</li>
              <li>Technology</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4 font-semibold">NETWORK</h3>
            <ul className="space-y-2">
              <li>About Us</li>
              <li>Advertise</li>
              <li>Contact</li>
              <li>Careers</li>
              <li>Sitemap</li>
            </ul>
          </div>
        </div>
      </footer>

    </main>
  );
}