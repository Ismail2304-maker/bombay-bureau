import UserMenu from "@/components/UserMenu";
import ListenButton from "@/components/ListenButton";
import ShareBar from "@/components/ShareBar";
import TrackView from "@/components/TrackView";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

const siteUrl = "https://bombay-bureau.vercel.app";

export const revalidate = 60;

const getArticle = cache(async (slug: string) => {
  return await client.fetch(
    `*[_type=="post" && slug.current==$slug][0]{
      _id,
      title,
      excerpt,
      "fallbackExcerpt": pt::text(body)[0..240],
      contentType,
      mainImage,
      body,
      publishedAt,
      firstPublishedAt,
      lastPublishedAt,
      publicationChangeType,
      publicationHistory[]{publishedAt,type,note},
      updateNote,
      correctionNote,
      sources[]{label,url},
      "category": categories[0]->title,
      "categories": categories[]->title,
      author->{name,slug,role,location,bio,image}
    }`,
    { slug }
  );
});

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getArticle(slug);

  if (!post) return { title: "Article not found" };

  const description =
    post.excerpt || post.fallbackExcerpt || "Read the latest reporting and analysis from Bombay Bureau.";
  const canonical = `/article/${slug}`;
  const authorSlug = post.author?.slug?.current || null;

  return {
    title: post.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: post.title,
      description,
      publishedTime: originalPublishedAt || undefined,
      modifiedTime: post.lastPublishedAt || post.firstPublishedAt || post.publishedAt || undefined,
      authors: authorSlug ? [`${siteUrl}/author/${authorSlug}`] : undefined,
      images: post.mainImage
        ? [{ url: urlFor(post.mainImage).width(1200).url(), alt: post.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.mainImage
        ? [urlFor(post.mainImage).width(1200).url()]
        : undefined,
    },
  };
}

function getReadingTime(body: any[]) {
  if (!body) return 1;
  const text = body.map((block: any) => block.children?.map((c: any) => c.text).join(" ")).join(" ");
  return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 200));
}

const getMoreArticles = cache(async (slug: string, categories: string[] = []) => {
  const candidates = await client.fetch(
    `*[
      _type=="post" &&
      slug.current != $slug &&
      defined(slug.current) &&
      !("Video" in categories[]->title) &&
      count(categories[]->title[@ in $categories]) > 0
    ] | order(publishedAt desc)[0..19]{
      title,
      slug,
      mainImage,
      publishedAt,
      "category": categories[0]->title,
      "categories": categories[]->title
    }`,
    { slug, categories }
  );

  const now = Date.now();
  return (candidates || [])
    .map((article: any) => {
      const sharedCategories = (article.categories || []).filter((c: string) =>
        categories.includes(c)
      ).length;
      const hours = Math.max(
        0,
        (now - new Date(article.publishedAt).getTime()) / 3600000
      );
      const freshness = Math.max(0, 1 - Math.min(hours, 168) / 168);
      return {
        ...article,
        relatedScore: sharedCategories * 20 + freshness * 8,
      };
    })
    .sort((a: any, b: any) => b.relatedScore - a.relatedScore)
    .slice(0, 3);
});

function formatArticleDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata",
  });
}

function formatArticleTime(date: string) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata",
  });
}

export default async function ArticlePage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const post = await getArticle(slug);
  if (!post) notFound();

  const readingTime = getReadingTime(post.body);
  const articleExcerpt = post.excerpt || post.fallbackExcerpt;
  const contentTypeLabel =
    post.contentType === "opinion"
      ? "Opinion"
      : post.contentType === "explainer"
        ? "Explainer"
        : post.contentType === "video"
          ? "Video"
          : "News";
  const articleText = post.body?.map((block: any) => block.children?.map((c: any) => c.text).join("")).join(" ") || "";
  const articleUrl = `${siteUrl}/article/${slug}`;
  const authorSlug = post.author?.slug?.current || null;
  const authorName = post.author?.name || "Bombay Bureau";
  const authorUrl = authorSlug ? `${siteUrl}/author/${authorSlug}` : siteUrl;
  const categorySlug = post.category?.toLowerCase();
  const validCategorySlugs = ["india","world","politics","business","technology","explainers"];
  const categoryHref = validCategorySlugs.includes(categorySlug) ? `/${categorySlug}` : null;
  const originalPublishedAt = post.firstPublishedAt || post.publishedAt;
  const lastPublishedAt = post.lastPublishedAt || originalPublishedAt;
  const hasMeaningfulUpdate =
    originalPublishedAt &&
    lastPublishedAt &&
    new Date(lastPublishedAt).getTime() > new Date(originalPublishedAt).getTime() + 60000;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": post.contentType === "news" ? "NewsArticle" : "Article",
    "@id": `${articleUrl}#article`,
    mainEntityOfPage: {"@type": "WebPage", "@id": articleUrl},
    headline: post.title,
    description: articleExcerpt || undefined,
    image: post.mainImage ? [urlFor(post.mainImage).width(1600).url()] : undefined,
    url: articleUrl,
    articleSection: post.category || undefined,
    inLanguage: "en",
    datePublished: originalPublishedAt || undefined,
    dateModified: lastPublishedAt || originalPublishedAt || undefined,
    author: post.author
      ? {
          "@type": "Person",
          name: authorName,
          url: authorUrl,
          jobTitle: post.author?.role || undefined,
          image: post.author?.image ? urlFor(post.author.image).width(800).url() : undefined,
          worksFor: {"@id": `${siteUrl}/#organization`},
        }
      : {"@type": "Organization", name: "BOMBAY BUREAU", url: siteUrl},
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "BOMBAY BUREAU",
      url: siteUrl,
      logo: {"@type": "ImageObject", url: `${siteUrl}/icon.png`},
    },
    isAccessibleForFree: true,
  };

  const breadcrumbItems: any[] = [
    {"@type":"ListItem", position:1, name:"Home", item:siteUrl},
  ];
  if (post.category) {
    breadcrumbItems.push({
      "@type":"ListItem",
      position:2,
      name:post.category,
      item:categoryHref ? `${siteUrl}${categoryHref}` : articleUrl,
    });
  }
  breadcrumbItems.push({
    "@type":"ListItem",
    position:post.category ? 3 : 2,
    name:post.title,
    item:articleUrl,
  });

  const more = await getMoreArticles(slug, post.categories || []);

  return (
    <main className="bg-black text-white min-h-screen">
      <TrackView slug={slug} />

      <div className="fixed top-0 left-0 w-full h-[3px] bg-gray-800 z-50">
        <div id="progressBar" className="h-full bg-white w-0" />
      </div>

      <script dangerouslySetInnerHTML={{__html: `
        const cat = ${JSON.stringify(post.category || "")};
        if(cat){
          let data = JSON.parse(localStorage.getItem("bb_read") || "{}");
          data[cat] = (data[cat] || 0) + 1;
          localStorage.setItem("bb_read", JSON.stringify(data));
        }
      `}} />

      <header className="relative z-40 border-b border-gray-800 overflow-visible bg-black">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:"url('/article-header.png')"}} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative w-full px-4 md:px-8 py-4 md:py-6 flex items-center justify-between">
          <Link href="/" className="flex flex-col items-center leading-tight">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-tight">BOMBAY BUREAU</h1>
            <p className="text-xs tracking-widest text-gray-400 mt-1 text-center">Global affairs, Indian perspective</p>
          </Link>
          <UserMenu />
        </div>
      </header>

      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(articleJsonLd)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({
        "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":breadcrumbItems
      })}} />

      <article className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-14">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-8 text-[9px] md:text-[10px] uppercase tracking-[0.22em] text-gray-500">
          <span>Bombay Bureau · Newsroom</span>
          <span>Independent digital journalism</span>
        </div>
        <div className="max-w-4xl">
        <nav aria-label="Breadcrumb" className="mb-7 text-[10px] md:text-xs uppercase tracking-[0.18em] text-gray-500">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          {post.category && <>
            <span className="mx-2 text-gray-700">/</span>
            {categoryHref ? <Link href={categoryHref} className="hover:text-white transition-colors">{post.category}</Link> : <span>{post.category}</span>}
          </>}
        </nav>

        <div className="mb-5 flex items-center gap-3">
          <span className="inline-flex items-center border border-gray-700 rounded-full px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-gray-300">
            {post.category || "News"}
          </span>
          <span className="h-px w-10 bg-gray-700" />
          <span className="text-[9px] uppercase tracking-[0.18em] text-gray-600">{contentTypeLabel}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif leading-[0.98] md:leading-[1.02] tracking-[-0.025em] mb-6 md:mb-7">
          {post.title}
        </h1>

        {articleExcerpt && (
          <p className="text-lg md:text-2xl leading-relaxed text-gray-300 max-w-4xl mb-8 border-l-2 border-gray-700 pl-4 md:pl-6">{articleExcerpt}</p>
        )}

        {post.correctionNote && (
          <aside className="mb-8 border border-gray-700 bg-gray-950 px-5 py-4">
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400">Correction</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">{post.correctionNote}</p>
          </aside>
        )}

        {post.updateNote && !post.correctionNote && (
          <aside className="mb-8 border border-gray-800 bg-gray-950 px-5 py-4">
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500">Updated</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">{post.updateNote}</p>
          </aside>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs md:text-sm text-gray-400 mb-8 md:mb-10 border-y border-gray-800 py-4">
          {authorSlug ? (
            <Link href={`/author/${authorSlug}`} className="text-white hover:text-gray-300 transition-colors">By {authorName}</Link>
          ) : (
            <span className="text-white">By {authorName}</span>
          )}
          <span aria-hidden="true">•</span>
          {originalPublishedAt && <>
            <time dateTime={originalPublishedAt}>
              Published {formatArticleDate(originalPublishedAt)} at {formatArticleTime(originalPublishedAt)} IST
            </time>
            {hasMeaningfulUpdate && <>
              <span aria-hidden="true">•</span>
              <time dateTime={lastPublishedAt}>Updated {formatArticleDate(lastPublishedAt)} at {formatArticleTime(lastPublishedAt)} IST</time>
            </>}
            <span aria-hidden="true">•</span>
          </>}
          <span>{readingTime} min read</span>
          <ListenButton text={articleText} />
        </div>

        {post.mainImage && (
          <figure className="mb-12 md:mb-14">
            <Image
              src={urlFor(post.mainImage).width(1800).url()}
              alt={post.mainImage?.alt || post.title}
              width={1800}
              height={1000}
              priority
              sizes="(max-width: 767px) 100vw, 820px"
              className="rounded-lg md:rounded-xl w-full h-auto"
            />
            {post.mainImage?.alt && <figcaption className="text-xs text-gray-500 mt-3 leading-relaxed">{post.mainImage.alt}</figcaption>}
          </figure>
        )}

        <div className="prose prose-invert max-w-none prose-base md:prose-lg leading-relaxed prose-p:leading-8 md:prose-p:leading-9">
          <PortableText
            value={post.body}
            components={{
              block:{
                normal:({children})=><p>{children}</p>,
                h2:({children})=><h2 className="font-serif text-2xl md:text-3xl text-white mt-10 mb-4">{children}</h2>,
                h3:({children})=><h3 className="font-serif text-xl md:text-2xl text-white mt-8 mb-3">{children}</h3>,
                blockquote:({children})=><blockquote className="border-l-2 border-gray-600 pl-5 my-8 text-gray-400 italic">{children}</blockquote>,
              },
              list:{
                bullet:({children})=><ul className="list-disc pl-6 my-6">{children}</ul>,
                number:({children})=><ol className="list-decimal pl-6 my-6">{children}</ol>,
              },
              marks:{
                strong:({children})=><strong className="text-white font-semibold">{children}</strong>,
                em:({children})=><em>{children}</em>,
                link:({value,children})=><a href={value?.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-gray-300">{children}</a>,
              },
            }}
          />
        </div>

        {post.publicationHistory?.length > 1 && (
          <section className="mt-16 pt-8 border-t border-gray-800">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-5">Publication history</h2>
            <ol className="space-y-5">
              {[...post.publicationHistory].reverse().map((event: any, index: number) => {
                const label =
                  event.type === "correction"
                    ? "Correction"
                    : event.type === "update"
                      ? "Update"
                      : "Initial publication";
                return (
                  <li key={event._key || `${event.publishedAt}-${index}`} className="border-l border-gray-700 pl-4">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-gray-500">
                      <span>{label}</span>
                      {event.publishedAt && <time dateTime={event.publishedAt}>{formatArticleDate(event.publishedAt)} at {formatArticleTime(event.publishedAt)} IST</time>}
                    </div>
                    {event.note && <p className="mt-2 text-sm leading-relaxed text-gray-400">{event.note}</p>}
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {post.sources?.length > 0 && (
          <section className="mt-16 pt-8 border-t border-gray-800">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">Sources &amp; References</h2>
            <ul className="space-y-2">
              {post.sources.map((source: any, index: number) => (
                <li key={`${source.url}-${index}`}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-sm text-gray-300 underline underline-offset-4 hover:text-white"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-20 pt-10 border-t border-gray-800">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Written by</p>
          <div>
            {authorSlug ? (
              <Link href={`/author/${authorSlug}`} className="text-xl font-serif hover:text-gray-300 transition-colors">{authorName}</Link>
            ) : (
              <p className="text-xl font-serif">{authorName}</p>
            )}
            {post.author?.role && <p className="mt-1 text-sm text-gray-500">{post.author.role}{post.author.location ? ` · ${post.author.location}` : ""}</p>}
            {post.author?.bio && <div className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400 prose prose-invert"><PortableText value={post.author.bio} /></div>}
          </div>
        </div>

        <ShareBar />
        <div className="mt-14 border-t border-gray-800 pt-6 text-[10px] uppercase tracking-[0.18em] text-gray-600">
          BOMBAY BUREAU · Published reporting and analysis
        </div>
        </div>
      </article>

      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16 md:pb-24">
        <h2 className="text-2xl md:text-3xl font-serif mb-8 md:mb-10 border-t border-gray-800 pt-10 md:pt-12">
          Related stories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {more.map((m:any)=>(
            <Link key={m.slug?.current || m.title} href={m.slug?.current ? `/article/${m.slug.current}` : "#"} className="group">
              <div className="cursor-pointer hover:-translate-y-1 transition-all duration-300">
                {m.mainImage && <Image src={urlFor(m.mainImage).width(400).url()} alt={m.title} loading="lazy" width={400} height={250} sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, 25vw" className="w-full h-[230px] object-cover rounded-lg mb-4 transition-transform duration-700 group-hover:scale-[1.05]" />}
                {m.category && <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 mb-2">{m.category}</p>}
                <h3 className="font-serif leading-snug group-hover:text-gray-300 transition-colors">{m.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
