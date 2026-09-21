import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import { cache } from "react";
import VideoSection from "@/components/VideoSection";

const builder = imageUrlBuilder(client);
const urlFor = (source: any) =>
  builder.image(source).auto("format").quality(75);

export const revalidate = 60;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatToday() {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date());
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
] | order(publishedAt desc)[0..19]{
      title,
      slug,
      mainImage,
      publishedAt,
      "excerpt": pt::text(body)[0..160],
      "categories": categories[]->title
    },

    "trendingRaw": *[_type=="post" && defined(views) && defined(slug.current) && defined(publishedAt) && !("Video" in categories[]->title)]{
      title,
      slug,
      views,
      publishedAt
    } | order(views desc)[0..149],

   "india": *[_type=="post" && defined(slug.current) && "India" in categories[]->title]
    | order(publishedAt desc)[0..11]{
      title,
      slug,
      mainImage,
      "excerpt": pt::text(body)[0..140],
      "caption": mainImage.alt,
      publishedAt
    },

    "world": *[_type=="post" && defined(slug.current) && "World" in categories[]->title]
    | order(publishedAt desc)[0..11]{
      title,
      slug,
      mainImage,
      "excerpt": pt::text(body)[0..140],
      "caption": mainImage.alt,
      publishedAt
    },

    "politics": *[_type=="post" && defined(slug.current) && "Politics" in categories[]->title]
    | order(publishedAt desc)[0..11]{
      title,
      slug,
      mainImage,
      "excerpt": pt::text(body)[0..140],
      "caption": mainImage.alt,
      publishedAt
    },

    "business": *[_type=="post" && defined(slug.current) && "Business" in categories[]->title]
    | order(publishedAt desc)[0..11]{
      title,
      slug,
      mainImage,
      "excerpt": pt::text(body)[0..140],
      "caption": mainImage.alt,
      publishedAt
    },

    "technology": *[_type=="post" && defined(slug.current) && "Technology" in categories[]->title]
    | order(publishedAt desc)[0..11]{
      title,
      slug,
      mainImage,
      "excerpt": pt::text(body)[0..140],
      "caption": mainImage.alt,
      publishedAt
    },

    "sports": *[_type=="post" && defined(slug.current) && "Sports" in categories[]->title]
    | order(publishedAt desc)[0..11]{
      title,
      slug,
      mainImage,
      "excerpt": pt::text(body)[0..140],
      "caption": mainImage.alt,
      publishedAt
    },

    "culture": *[_type=="post" && defined(slug.current) && "Culture" in categories[]->title]
    | order(publishedAt desc)[0..11]{
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
  const videos = (data.video || []).map((video: any) => ({
    ...video,
    posterUrl: video.mainImage
      ? urlFor(video.mainImage).width(600).url()
      : null,
  }));

  // Deterministic editorial curation prevents the same story from filling
  // multiple major homepage slots on the same render.
  const usedSlugs = new Set<string>();

  const takeFresh = (items: any[] = [], count: number) => {
    const selected: any[] = [];
    for (const item of items) {
      const slug = item?.slug?.current;
      if (!slug || usedSlugs.has(slug)) continue;
      usedSlugs.add(slug);
      selected.push(item);
      if (selected.length === count) break;
    }
    return selected;
  };

  const hero = posts[0];
  if (hero?.slug?.current) usedSlugs.add(hero.slug.current);

  const latestSecondary = takeFresh(posts.slice(1), 3);
  const latestSidebar = takeFresh(posts.slice(4), 5);

  const trending = (data.trendingRaw || [])
    .filter((p: any) => p?.slug?.current && !usedSlugs.has(p.slug.current))
    .map((p: any) => {
      const hours = Math.max(0, (Date.now() - new Date(p.publishedAt).getTime()) / 3600000);
      const freshness = Math.max(0, 1 - Math.min(hours, 72) / 72);
      const popularity = Math.log1p(Math.max(0, p.views || 0));
      return { ...p, score: popularity * 10 + freshness * 14 };
    })
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 5);

  trending.forEach((p: any) => {
    if (p?.slug?.current) usedSlugs.add(p.slug.current);
  });

  // Each major section gets up to five of its own stories.
  // We prefer stories not already used elsewhere, but fall back to the
  // category's own stories so a section never disappears or becomes sparse
  // merely because a post has multiple category tags.
  const takeSectionStories = (items: any[] = [], count: number) => {
    const fresh = takeFresh(items, count);
    if (fresh.length >= count) return fresh;

    const selectedSlugs = new Set(fresh.map((item: any) => item?.slug?.current));
    for (const item of items) {
      const slug = item?.slug?.current;
      if (!slug || selectedSlugs.has(slug)) continue;
      selectedSlugs.add(slug);
      fresh.push(item);
      if (fresh.length === count) break;
    }
    return fresh;
  };

  const mainSections = [
    { title: "India", data: takeSectionStories(data.india, 5) },
    { title: "World", data: takeSectionStories(data.world, 5) },
    { title: "Politics", data: takeSectionStories(data.politics, 5) },
    { title: "Business", data: takeSectionStories(data.business, 5) },
    { title: "Technology", data: takeSectionStories(data.technology, 5) },
    { title: "Sports", data: takeSectionStories(data.sports, 5) },
    { title: "Culture", data: takeSectionStories(data.culture, 5) },
  ];

  const opinion = takeFresh(data.opinion || [], 4);
  const explainers = takeFresh(data.explainers || [], 4);

  return (
    <main className="bg-black text-white min-h-screen">

      <Header />

      <section className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="font-serif text-lg md:text-xl text-white">India, explained with clarity.</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-gray-600">
              Independent digital journalism · Global affairs, Indian perspective
            </p>
          </div>
          <time className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-gray-600">
            {formatToday()}
          </time>
        </div>
      </section>

      {/* =========================================================
          HERO + SIDEBAR
      ========================================================= */}
      <section
        id="latest"
        className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 md:gap-10 px-4 md:px-6 mt-6 md:mt-10 mb-6 md:mb-10 scroll-mt-[210px] md:scroll-mt-[250px]"
      >

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
                      <Image
                        src={urlFor(posts[0].mainImage).width(1600).url()}
                        alt={posts[0].title}
                        width={1600}
                        height={900}
                        priority
                        sizes="(max-width: 767px) 100vw, 66vw"
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
                    <span>Lead story</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                    <span>Published {formatFreshness(posts[0].publishedAt)}</span>
                  </div>

                </div>
              </Link>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
                {latestSecondary.map((post: any) => (
                  <Link
                    key={post.slug.current}
                    href={`/article/${post.slug.current}`}
                  >
                    <div className="group cursor-pointer border-t border-gray-800 pt-4 hover:-translate-y-1 transition-all duration-300">

                      {post.mainImage && (
                        <div className="overflow-hidden rounded-lg mb-3">
                          <Image
                            src={urlFor(post.mainImage).width(600).url()}
                            loading="lazy"
                            alt={post.title}
                            width={600}
                            height={400}
                            sizes="(max-width: 639px) 100vw, 33vw"
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

            {latestSidebar.map((post: any, i: number) => (
              <Link
                key={post.slug.current}
                href={`/article/${post.slug.current}`}
              >
                <div className="group flex gap-3 py-4 border-b border-gray-800 hover:translate-x-1 transition cursor-pointer">

                  {post?.mainImage && (
                    <Image
                      src={urlFor(post.mainImage).width(80).url()}
                      loading="lazy"
                      alt={post.title}
                      width={80}
                      height={60}
                      sizes="80px"
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

                  </div>

                </div>
              </Link>
            ))}
          </div>

        </aside>
      </section>


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
                          <Image
                            src={urlFor(main.mainImage).width(1600).url()}
                            loading="lazy"
                            alt={main.title}
                            width={1600}
                            height={900}
                            sizes="(max-width: 767px) 100vw, 66vw"
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
                            <Image
                              src={urlFor(post.mainImage).width(300).url()}
                              loading="lazy"
                              alt={post.title}
                              width={120}
                              height={80}
                              sizes="120px"
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

            <Link href="/opinion" className="group">
              <h2 className="text-lg md:text-xl font-bold tracking-tight group-hover:text-gray-400 transition">
                Opinion
              </h2>
            </Link>

            <Link
              href="/opinion"
              className="text-[9px] uppercase tracking-[0.18em] text-gray-500 hover:text-white transition"
            >
              Explore More
            </Link>

          </div>

        </div>

        {opinion.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {opinion.map((post: any) => (
              <Link
                key={post.slug.current}
                href={`/article/${post.slug.current}`}
              >
                <article className="group cursor-pointer">

                  {post.mainImage && (
                    <div className="relative overflow-hidden rounded-md aspect-[4/3]">
                      <Image
                        src={urlFor(post.mainImage).width(700).url()}
                        loading="lazy"
                        alt={post.title}
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
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

        {explainers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {explainers.map((post: any) => (
              <Link
                key={post.slug.current}
                href={`/article/${post.slug.current}`}
              >
                <article className="group cursor-pointer">

                  {post.mainImage && (
                    <div className="relative overflow-hidden rounded-md aspect-[4/3]">
                      <Image
                        src={urlFor(post.mainImage).width(700).url()}
                        alt={post.title}
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
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
  videos={videos}
/>
      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-gray-800 mt-24 bg-black text-gray-300">

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">

          {/* LOGO */}
          <div className="mb-8">
            <div className="flex items-center gap-3">

              <Image
                src="/icon.png"
                alt="Bombay Bureau"
                width={40}
                height={40}
                sizes="40px"
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
            <Link href="/india">India</Link>
            <Link href="/world">World</Link>
            <Link href="/politics">Politics</Link>
            <Link href="/business">Business</Link>
            <Link href="/technology">Technology</Link>
            <Link href="/sports">Sports</Link>
            <Link href="/culture">Culture</Link>
            <Link href="/opinion">Opinion</Link>
            <Link href="/explainers">Explainers</Link>
            <Link href="/#video">Video</Link>
            <Link href="/archive">Archive</Link>
            <Link href="/rss.xml">RSS</Link>
            <Link href="/saved">Saved</Link>

            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/newsroom">Newsroom</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>

          </div>

          {/* SOCIAL */}
          <div className="mb-10 border-y border-gray-800 py-5">
            <p className="text-sm text-gray-400">Official social channels will be linked here once they are established and verified.</p>
          </div>

          {/* LEGAL LINKS */}
          <div className="flex flex-wrap gap-6 text-xs text-gray-500 mb-6">

            <Link href="/terms">Terms of Use</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/cookies">Cookies</Link>
            <a href="mailto:editor@bombaybureau.com">Advertise</a>
            <a href="mailto:editor@bombaybureau.com">Careers</a>
            <Link href="/contact">Contact</Link>
            <Link href="/newsroom">Newsroom</Link>
            <Link href="/archive">Archive</Link>
            <a href="/rss.xml">RSS</a>
            <a href="/sitemap.xml">Sitemap</a>

          </div>

          {/* COPYRIGHT */}
          {/* Deployment trigger: keep production build aligned with main. */}
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Bombay Bureau. All rights reserved.
            Bombay Bureau is not responsible for the content of external sites.
          </p>

        </div>

      </footer>

    </main>
  );
}
