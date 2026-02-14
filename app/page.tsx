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

    "trendingRaw": *[_type=="post" && defined(views)]{
      title,
      slug,
      mainImage,
      views,
      publishedAt
    } | order(publishedAt desc)[0..12],

    "india": *[_type=="post" && "India" in categories[]->title]
| order(publishedAt desc)[0..5]{
  title,
  slug,
  mainImage,
  "excerpt": pt::text(body)[0..140],
  "caption": mainImage.alt
},

"world": *[_type=="post" && "World" in categories[]->title]
| order(publishedAt desc)[0..5]{
  title,
  slug,
  mainImage,
  "excerpt": pt::text(body)[0..140],
  "caption": mainImage.alt
},

"politics": *[_type=="post" && "Politics" in categories[]->title]
| order(publishedAt desc)[0..5]{
  title,
  slug,
  mainImage,
  "excerpt": pt::text(body)[0..140],
  "caption": mainImage.alt
},

"opinion": *[_type=="post" && "Opinion" in categories[]->title]
| order(publishedAt desc)[0..5]{
  title,
  slug,
  mainImage,
  "excerpt": pt::text(body)[0..140],
  "caption": mainImage.alt
},

"business": *[_type=="post" && "Business" in categories[]->title]
| order(publishedAt desc)[0..5]{
  title,
  slug,
  mainImage,
  "excerpt": pt::text(body)[0..140],
  "caption": mainImage.alt
},

"technology": *[_type=="post" && "Technology" in categories[]->title]
| order(publishedAt desc)[0..5]{
  title,
  slug,
  mainImage,
  "excerpt": pt::text(body)[0..140],
  "caption": mainImage.alt
},
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
      <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 px-6 mt-10 mb-10">

        {/* LEFT */}
        <div className="md:col-span-2">
          {posts[0] && posts[0].mainImage && (
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
    <div className="flex gap-3 py-3 border-b border-gray-800 hover:translate-x-1 transition cursor-pointer">

      {post.mainImage && (
        <Image
          src={urlFor(post.mainImage).width(80).url()}
          alt=""
          width={80}
          height={60}
          className="rounded-md object-cover"
        />
      )}

      <div>
        <p className="text-xs text-gray-500">{i + 1}</p>
        <p className="group-hover:text-gray-300">
          {post.title}
        </p>
      </div>

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

        </aside>
      </section>
      
      <div className="max-w-7xl mx-auto px-6 mt-20 border-t border-gray-800 pt-10">
  <ForYou posts={JSON.parse(JSON.stringify(posts))} />
</div>
            
    {/* CATEGORY SECTIONS */}
<section className="max-w-7xl mx-auto px-6 mt-24 space-y-24">

{[
  { title: "India", data: data.india },
  { title: "World", data: data.world },
  { title: "Opinion", data: data.opinion },
  { title: "Politics", data: data.politics },
  { title: "Business", data: data.business },
  { title: "Technology", data: data.technology },
].map((section) => {

  if (!section.data?.length) return null;

  const main = section.data[0];

  return (
    <section
      id={section.title.toLowerCase()}
      key={section.title}
      className="scroll-mt-52"
    >

      {/* CATEGORY LINE */}
      <Link href={`/${section.title.toLowerCase()}`}>
  <div className="mb-10 group cursor-pointer">

    {/* TOP LINE */}
    <div className="border-t border-gray-800 mb-4"></div>

    {/* TITLE ROW */}
    <div className="flex items-center gap-2 text-white">
      <h2 className="text-3xl font-serif tracking-tight group-hover:opacity-80 transition">
        {section.title}
      </h2>
      <span className="text-2xl mt-[2px]">›</span>
    </div>

  </div>
</Link>

      <div className="grid md:grid-cols-3 gap-10">

        {/* LEFT BIG STORY */}
        <div className="md:col-span-2">
          <Link href={`/article/${main.slug.current}`}>
            <div className="group cursor-pointer">

              
  {main?.mainImage ? (
  <Image
    src={urlFor(main.mainImage).width(1600).url()}
    alt=""
    width={1600}
    height={900}
    className="rounded-lg mb-5"
  />
) : (
  <div className="w-full h-[400px] bg-gray-800 rounded-lg mb-5" />
)}


              <h2 className="text-4xl font-serif group-hover:text-gray-300 transition">
                {main.title}
              </h2>

              <p className="text-gray-400 mt-4 max-w-2xl">
                {main.excerpt}
              </p>

              {/* IMAGE CAPTION */}
              <p className="text-xs text-gray-500 mt-2">
                {main.caption || ""}
              </p>

            </div>
          </Link>
        </div>

        {/* RIGHT COLUMN SMALL STORIES */}
        <div className="flex flex-col gap-8">

          {section.data.slice(1, 5).map((post: any) => (
            <Link key={post.slug.current} href={`/article/${post.slug.current}`}>
              <div className="flex gap-4 group cursor-pointer">

    {post.mainImage && (
  <Image
    src={urlFor(post.mainImage).width(300).url()}
    alt=""
    width={120}
    height={80}
    className="rounded-md"
  />
)}           <div>
                  <h3 className="font-serif group-hover:text-gray-300 transition">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    {post.excerpt}
                  </p>
                </div>

              </div>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
})}

</section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 mt-24 bg-black text-gray-300">

  <div className="max-w-7xl mx-auto px-6 py-16">

    {/* LOGO */}
    <div className="mb-8">
      <h2 className="text-3xl font-serif text-white tracking-wide">
        BOMBAY BUREAU
      </h2>
    </div>

    {/* NAV LINKS */}
    <div className="flex flex-wrap gap-6 text-sm mb-10">
      <Link href="/">Home</Link>
      <Link href="/india">India</Link>
      <Link href="/world">World</Link>
      <Link href="/politics">Politics</Link>
      <Link href="/business">Business</Link>
      <Link href="/technology">Technology</Link>
      <Link href="/opinion">Opinion</Link>
      
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
      <Link href="/terms">Terms</Link>
      <Link href="/privacy">Privacy</Link>
    </div>

    {/* SOCIAL */}
<div className="flex items-center gap-6 mb-10">

  <span className="text-sm text-gray-400 mr-4">
    Follow Bombay Bureau on:
  </span>

  {/* X */}
  <a href="#" className="hover:opacity-70 transition">
    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
      <path d="M18.244 2H21.5l-7.31 8.35L22.8 22h-6.73l-5.27-6.9L4.8 22H1.5l7.82-8.94L1 2h6.86l4.78 6.26L18.244 2Zm-2.36 18h1.88L7.1 3.9H5.08l10.8 16.1Z"/>
    </svg>
  </a>

  {/* INSTAGRAM */}
  <a href="#" className="hover:opacity-70 transition">
    <svg className="w-5 h-5 stroke-white" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="5"/>
      <circle cx="12" cy="12" r="3.5"/>
      <circle cx="17.5" cy="6.5" r="1"/>
    </svg>
  </a>

  {/* FACEBOOK */}
  <a href="#" className="hover:opacity-70 transition">
    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.4V12h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2 .2 2 .2v2.3h-1.2c-1.2 0-1.6.75-1.6 1.5V12h2.7l-.43 2.9h-2.27v7A10 10 0 0 0 22 12Z"/>
    </svg>
  </a>

  {/* LINKEDIN */}
  <a href="#" className="hover:opacity-70 transition">
    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
      <path d="M6.94 6.5A1.94 1.94 0 1 1 6.94 2.6a1.94 1.94 0 0 1 0 3.88ZM4.5 8.5h4.9V22H4.5V8.5ZM13 8.5h4.7v1.85h.07c.65-1.2 2.23-2.45 4.6-2.45 4.9 0 5.8 3.22 5.8 7.4V22h-4.9v-5.9c0-1.4-.02-3.2-2-3.2-2 0-2.3 1.5-2.3 3.1V22H13V8.5Z"/>
    </svg>
  </a>

</div>

    {/* LEGAL LINKS */}
    <div className="flex flex-wrap gap-6 text-xs text-gray-500 mb-6">
      <Link href="#">Terms of Use</Link>
      <Link href="#">Privacy Policy</Link>
      <Link href="#">Cookies</Link>
      <Link href="#">Advertise</Link>
      <Link href="#">Careers</Link>
      <Link href="#">Contact</Link>
      <Link href="#">Sitemap</Link>
    </div>

    {/* COPYRIGHT */}
    <p className="text-xs text-gray-500">
      © {new Date().getFullYear()} Bombay Bureau. All rights reserved.  
      Bombay Bureau is not responsible for the content of external sites.
    </p>

  </div>
</footer>
    </main>
  );
}