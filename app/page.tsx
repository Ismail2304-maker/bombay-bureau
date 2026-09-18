import Header from "@/components/Header";
import Link from "next/link";
import MarketSnapshot from "@/components/MarketSnapshot";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import { cache } from "react";
import VideoSection from "@/components/VideoSection";

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source);

export const revalidate = 60;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatFreshness(date: string) {
  const published = new Date(date).getTime();
  const now = Date.now();
  const hours = Math.floor((now - published) / (1000 * 60 * 60));

  if (hours < 1) return "JUST IN";
  if (hours < 24) return `${hours} HOUR${hours === 1 ? "" : "S"} AGO`;
  if (hours < 48) return "YESTERDAY";

  return formatDate(date);
}

const getPosts = cache(async () => {
  return await client.fetch(`
  {
    "all": *[
  _type == "post" &&
  defined(slug.current) &&
  !("Opinion" in categories[]->title) &&
  !("Explainers" in categories[]->title) &&
  !("Video" in categories[]->title)
] | order(publishedAt desc){
      title,
      slug,
      mainImage,
      body,
      views,
      publishedAt,
      "excerpt": pt::text(body)[0..160],
      "categories": categories[]->title
    },

    "trendingRaw": *[_type=="post" && defined(views) && defined(slug.current)]{
      title,
      slug,
      mainImage,
      views,
      publishedAt
    } | order(publishedAt desc)[0..12],

   "india": *[_type=="post" && defined(slug.current) && "India" in categories[]->title]
    | order(publishedAt desc)[0..5]{
      title,
      slug,
      mainImage,
      "excerpt": pt::text(body)[0..140],
      "caption": mainImage.alt,
      publishedAt
    },

    "world": *[_type=="post" && defined(slug.current) && "World" in categories[]->title]
    | order(publishedAt desc)[0..5]{
      title,
      slug,
      mainImage,
      "excerpt": pt::text(body)[0..140],
      "caption": mainImage.alt,
      publishedAt
    },

    "politics": *[_type=="post" && defined(slug.current) && "Politics" in categories[]->title]
    | order(publishedAt desc)[0..5]{
      title,
      slug,
      mainImage,
      "excerpt": pt::text(body)[0..140],
      "caption": mainImage.alt,
      publishedAt
    },

    "business": *[_type=="post" && defined(slug.current) && "Business" in categories[]->title]
    | order(publishedAt desc)[0..5]{
      title,
      slug,
      mainImage,
      "excerpt": pt::text(body)[0..140],
      "caption": mainImage.alt,
      publishedAt
    },

    "technology": *[_type=="post" && defined(slug.current) && "Technology" in categories[]->title]
    | order(publishedAt desc)[0..5]{
      title,
      slug,
      mainImage,
      "excerpt": pt::text(body)[0..140],
      "caption": mainImage.alt,
      publishedAt
    },

    "opinion": *[_type=="post" && defined(slug.current) && "Opinion" in categories[]->title]
    | order(publishedAt desc)[0..7]{
      title,
      slug,
      mainImage,
      "excerpt": pt::text(body)[0..140],
      "caption": mainImage.alt,
      publishedAt
    },

    "explainers": *[_type=="post" && defined(slug.current) && "Explainers" in categories[]->title]
    | order(publishedAt desc)[0..7]{
      title,
      slug,
      mainImage,
      "excerpt": pt::text(body)[0..140],
      "caption": mainImage.alt,
      publishedAt
    },

    "video": *[_type=="post" && defined(slug.current) && "Video" in categories[]->title]
| order(publishedAt desc)[0..9]{
  title,
  slug,
  mainImage,
  "excerpt": pt::text(body)[0..140],
  "caption": mainImage.alt,
  publishedAt,
  duration,
  "videoUrl": coalesce(
    videoFile.asset->url,
    videoUrl
  ),
  "videoMimeType": coalesce(
    videoFile.asset->mimeType,
    videoMimeType
  )
}
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

  const mainSections = [
    { title: "India", data: data.india },
    { title: "World", data: data.world },
    { title: "Politics", data: data.politics },
    { title: "Business", data: data.business },
    { title: "Technology", data: data.technology },
  ];

  return (
    <main className="bg-black text-white min-h-screen">

      <Header />

      {/* =========================================================
          HERO + SIDEBAR
      ========================================================= */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 md:gap-10 px-4 md:px-6 mt-6 md:mt-10 mb-6 md:mb-10">

        {/* LEFT */}
        <div className="md:col-span-2">
          {posts[0] && (
            <>
              <Link
  href={
    posts[0]?.slug?.current
      ? `/article/${posts[0].slug.current}`
      : "/"
  }
>
                <div className="group cursor-pointer">

                  <div className="overflow-hidden rounded-lg">
                    {posts[0]?.mainImage && (
                      <img
                        src={urlFor(posts[0].mainImage).width(1600).url()}
                        alt=""
                        className="w-full rounded-lg transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-5 md:mt-6 text-[10px] md:text-xs uppercase tracking-[0.18em] text-gray-500">
                    <span>
                      {posts[0].categories?.[0] || "Top Story"}
                    </span>

                    <span className="w-1 h-1 rounded-full bg-gray-700"></span>

                    <span>
                      {formatFreshness(posts[0].publishedAt)}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-medium leading-[1.05] tracking-[-0.02em] mt-3 group-hover:text-gray-300 transition-colors">
                    {posts[0].title}
                  </h2>

                  <p className="text-gray-400 mt-3 md:mt-4 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
                    {posts[0].excerpt}
                  </p>

                  <div className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-gray-600">
                    <span>Bombay Bureau</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                    <span>News</span>
                  </div>

                </div>
              </Link>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
                {posts.slice(1, 4).map((post: any) => (
                  <Link
                    key={post.slug.current}
                    href={`/article/${post.slug.current}`}
                  >
                    <div className="group cursor-pointer border-t border-gray-800 pt-4 hover:-translate-y-1 transition-all duration-300">

                      {post.mainImage && (
                        <div className="overflow-hidden rounded-lg mb-3">
                          <img
                            src={urlFor(post.mainImage).width(600).url()}
                            alt=""
                            className="w-full rounded-lg transition-transform duration-700 group-hover:scale-[1.06]"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-gray-600 mb-2">
                        <span>
                          {post.categories?.[0] || "News"}
                        </span>

                        <span className="w-1 h-1 rounded-full bg-gray-700"></span>

                        <span>
                          {formatDate(post.publishedAt)}
                        </span>
                      </div>

                      <h3 className="font-serif text-base md:text-lg leading-snug group-hover:text-gray-300 transition-colors">
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
        <aside className="space-y-8 md:space-y-12 md:sticky md:top-32 h-fit">

          {/* LATEST */}
          <div>
            <div className="flex items-end justify-between border-b border-gray-800 pb-2 mb-2">
              <h3 className="text-lg font-bold tracking-tight">
                Latest
              </h3>

              <span className="text-[9px] uppercase tracking-[0.18em] text-gray-600">
                News
              </span>
            </div>

            {posts.slice(0, 5).map((post: any, i: number) => (
              <Link
                key={post.slug.current}
                href={`/article/${post.slug.current}`}
              >
                <div className="group flex gap-3 py-4 border-b border-gray-800 hover:translate-x-1 transition cursor-pointer">

                  {post?.mainImage && (
                    <img
                      src={urlFor(post.mainImage).width(80).url()}
                      alt=""
                      className="w-[80px] h-[60px] object-cover rounded-md"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[10px] font-serif text-gray-600">
                        {String(i + 1).padStart(2, "0")}
                      </p>

                      {post.categories?.[0] && (
                        <p className="text-[9px] uppercase tracking-[0.12em] text-gray-600 truncate">
                          {post.categories[0]}
                        </p>
                      )}

                      <p className="text-[9px] uppercase tracking-[0.12em] text-gray-700 mt-1">
                        {formatFreshness(post.publishedAt)}
                      </p>
                    </div>

                    <p className="text-sm leading-snug group-hover:text-gray-300 transition-colors">
                      {post.title}
                    </p>
                  </div>

                </div>
              </Link>
            ))}
          </div>

          {/* TRENDING */}
          <div>
            <div className="flex items-end justify-between border-b border-gray-800 pb-2 mb-2">
              <h3 className="text-lg font-bold tracking-tight">
                Trending
              </h3>

              <span className="text-[9px] uppercase tracking-[0.18em] text-gray-600">
                Most Read
              </span>
            </div>

            {trending.map((post: any, i: number) => (
              <Link
                key={post.slug.current}
                href={`/article/${post.slug.current}`}
              >
                <div className="group flex gap-4 py-4 border-b border-gray-800 hover:translate-x-1 transition-all duration-200 cursor-pointer">

                  <span className="text-2xl md:text-3xl font-serif text-gray-700 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <p className="text-sm leading-snug group-hover:text-gray-300 transition-colors">
                      {post.title}
                    </p>

                    <p className="text-[10px] uppercase tracking-[0.12em] text-gray-600 mt-2">
                      {post.views || 0} views
                    </p>
                  </div>

                </div>
              </Link>
            ))}
          </div>

        </aside>
      </section>

      {/* =========================================================
          MARKET SNAPSHOT
      ========================================================= */}
      <MarketSnapshot />

      {/* =========================================================
          INDIA / WORLD / POLITICS / BUSINESS / TECHNOLOGY
          EXISTING LARGE EDITORIAL SECTIONS
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-20 md:mt-24 space-y-20 md:space-y-24">

        {mainSections.map((section) => {

          if (!section.data?.length) return null;

          const main = section.data[0];

          return (
            <section
  id={section.title.toLowerCase()}
  key={section.title}
  className="scroll-mt-[210px] md:scroll-mt-[250px]"
>

              {/* CATEGORY HEADER */}
              <Link href={`/${section.title.toLowerCase()}`}>
                <div className="mb-8 md:mb-10 group cursor-pointer">

                  <div className="border-t border-gray-800 mb-4"></div>

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2 text-white">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-tight group-hover:opacity-80 transition">
                        {section.title}
                      </h2>

                      <span className="text-2xl mt-[2px] group-hover:translate-x-1 transition-transform">
                        ›
                      </span>
                    </div>

                    <span className="hidden sm:block text-[9px] uppercase tracking-[0.2em] text-gray-600">
                      Latest
                    </span>

                  </div>
                </div>
              </Link>

              {/* MAIN GRID */}
              <div className="grid md:grid-cols-3 gap-6 md:gap-10">

                {/* MAIN STORY */}
                <div className="md:col-span-2">
                  <Link href={`/article/${main.slug.current}`}>
                    <div className="group cursor-pointer">

                      {main?.mainImage && (
                        <div className="overflow-hidden rounded-lg">
                          <img
                            src={urlFor(main.mainImage).width(1600).url()}
                            alt=""
                            className="w-full rounded-lg transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-3 mt-4 text-[10px] uppercase tracking-[0.18em] text-gray-600">
                        <span>{section.title}</span>

                        <span className="w-1 h-1 rounded-full bg-gray-700"></span>

                        {main.publishedAt && (
                          <span>{formatDate(main.publishedAt)}</span>
                        )}
                      </div>

                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium leading-[1.08] mt-3 group-hover:text-gray-300 transition">
                        {main.title}
                      </h2>

                      <p className="text-gray-400 mt-4 max-w-2xl leading-relaxed">
                        {main.excerpt}
                      </p>

                      <p className="text-xs text-gray-600 mt-3 italic">
                        {main.caption || ""}
                      </p>

                    </div>
                  </Link>
                </div>

                {/* SMALL STORIES */}
                <div className="flex flex-col gap-0">

                  {section.data.slice(1, 5).map((post: any) => (
                    <Link
                      key={post.slug.current}
                      href={`/article/${post.slug.current}`}
                    >
                      <div className="flex gap-4 group cursor-pointer py-5 border-t border-gray-800 first:border-t-0">

                        {post?.mainImage && (
                          <div className="shrink-0 overflow-hidden rounded-md">
                            <img
                              src={urlFor(post.mainImage).width(300).url()}
                              alt=""
                              className="w-[120px] h-[80px] object-cover rounded-md transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                          </div>
                        )}

                        <div>

                          <div className="text-[9px] uppercase tracking-[0.15em] text-gray-600 mb-1">
                            {section.title}
                          </div>

                          <h3 className="font-serif text-base leading-snug group-hover:text-gray-300 transition">
                            {post.title}
                          </h3>

                          <p className="text-sm text-gray-400 mt-1 leading-relaxed line-clamp-2">
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

      {/* =========================================================
          OPINION
          SMALL EDITORIAL CARD GRID
      ========================================================= */}
      <section
  id="opinion"
  className="max-w-7xl mx-auto px-4 md:px-6 mt-20 md:mt-24 scroll-mt-[210px] md:scroll-mt-[250px]"
>

        <div className="border-t border-gray-800 pt-5 mb-7">

          <div className="flex items-center justify-between">

            <a href="/#opinion" className="group">
              <h2 className="text-lg md:text-xl font-bold tracking-tight group-hover:text-gray-400 transition">
                Opinion
              </h2>
            </a>

            <a
              href="/#opinion"
              className="text-[9px] uppercase tracking-[0.18em] text-gray-500 hover:text-white transition"
            >
              Explore More
            </a>

          </div>

        </div>

        {data.opinion?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {data.opinion.slice(0, 4).map((post: any) => (
              <Link
                key={post.slug.current}
                href={`/article/${post.slug.current}`}
              >
                <article className="group cursor-pointer">

                  {post.mainImage && (
                    <div className="overflow-hidden rounded-md aspect-[4/3]">
                      <img
                        src={urlFor(post.mainImage).width(700).url()}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                  )}

                  <div className="mt-3">

                    <p className="text-[9px] uppercase tracking-[0.16em] text-gray-600 mb-2">
                      Opinion
                    </p>

                    <h3 className="font-serif text-base md:text-lg font-medium leading-snug group-hover:text-gray-300 transition-colors">
                      {post.title}
                    </h3>

                  </div>

                </article>
              </Link>
            ))}

          </div>
        ) : (
          <div className="border border-gray-800 rounded-lg py-12 text-center">
            <p className="text-gray-500 text-sm">
              Opinion stories will appear here.
            </p>
          </div>
        )}

      </section>

      {/* =========================================================
          EXPLAINERS
          SMALL EDITORIAL CARD GRID
      ========================================================= */}
      <section
  id="explainers"
  className="max-w-7xl mx-auto px-4 md:px-6 mt-20 md:mt-24 scroll-mt-[210px] md:scroll-mt-[250px]"
>

        <div className="border-t border-gray-800 pt-5 mb-7">

          <div className="flex items-center justify-between">

            <Link href="/explainers" className="group">
              <h2 className="text-lg md:text-xl font-bold tracking-tight group-hover:text-gray-400 transition">
                Explainers
              </h2>
            </Link>

            <Link
              href="/explainers"
              className="text-[9px] uppercase tracking-[0.18em] text-gray-500 hover:text-white transition"
            >
              Explore More
            </Link>

          </div>

        </div>

        {data.explainers?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {data.explainers.slice(0, 4).map((post: any) => (
              <Link
                key={post.slug.current}
                href={`/article/${post.slug.current}`}
              >
                <article className="group cursor-pointer">

                  {post.mainImage && (
                    <div className="overflow-hidden rounded-md aspect-[4/3]">
                      <img
                        src={urlFor(post.mainImage).width(700).url()}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                  )}

                  <div className="mt-3">

                    <p className="text-[9px] uppercase tracking-[0.16em] text-gray-600 mb-2">
                      Explainers
                    </p>

                    <h3 className="font-serif text-base md:text-lg font-medium leading-snug group-hover:text-gray-300 transition-colors">
                      {post.title}
                    </h3>

                  </div>

                </article>
              </Link>
            ))}

          </div>
        ) : (
          <div className="border border-gray-800 rounded-lg py-12 text-center">
            <p className="text-gray-500 text-sm">
              Explainer stories will appear here.
            </p>
          </div>
        )}

      </section>

      {/* =========================================================
    VIDEO / WATCH
========================================================= */}
<VideoSection
  videos={data.video || []}
/>
      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-gray-800 mt-24 bg-black text-gray-300">

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">

          {/* LOGO */}
          <div className="mb-8">
            <div className="flex items-center gap-3">

              <img
                src="/icon.png"
                alt="Bombay Bureau"
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
              />

              <h2 className="text-3xl font-serif text-white tracking-wide">
                BOMBAY BUREAU
              </h2>

            </div>
          </div>

          {/* NAV LINKS */}
          <div className="flex flex-wrap gap-6 text-sm mb-10">

            <Link href="/">Home</Link>
            <Link href="/#india">India</Link>
            <Link href="/#world">World</Link>
            <Link href="/#politics">Politics</Link>
            <Link href="/#business">Business</Link>
            <Link href="/#technology">Technology</Link>
            <Link href="/#markets">Markets</Link>
            <Link href="/#opinion">Opinion</Link>
            <Link href="/#explainers">Explainers</Link>
            <Link href="/#video">Video</Link>

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
              <svg
                className="w-5 h-5 stroke-white"
                fill="none"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
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

            <Link href="/terms">Terms of Use</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <span>Cookies</span>
            <a href="mailto:editor@bombaybureau.com">Advertise</a>
            <a href="mailto:editor@bombaybureau.com">Careers</a>
            <Link href="/contact">Contact</Link>
            <a href="/sitemap.xml">Sitemap</a>

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