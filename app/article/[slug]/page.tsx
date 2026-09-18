import UserMenu from "@/components/UserMenu";
import AdminEditButton from "@/components/AdminEditButton";
import ListenButton from "@/components/ListenButton";
import ShareBar from "@/components/ShareBar";
import TrackView from "@/components/TrackView";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { cache } from "react";

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export const revalidate = 60;

const getArticle = cache(async (slug: string) => {
  return await client.fetch(
    `*[_type=="post" && slug.current==$slug][0]{
  _id,
      title,
      "excerpt": pt::text(body)[0..160],
      mainImage,
      body,
      publishedAt,
      _updatedAt,
      "category": categories[0]->title,
      author->{
        name,
        slug,
        role,
        location,
        bio
      }
    }`,
    { slug }
  );
});

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getArticle(slug);

  if (!post) {
    return { title: "Article not found" };
  }

  const description =
    post.excerpt || "Read the latest reporting and analysis from Bombay Bureau.";
  const canonical = `/article/${slug}`;

  return {
    title: post.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: post.title,
      description,
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post._updatedAt || post.publishedAt || undefined,
      authors: [`https://bombay-bureau.vercel.app/author/muhammed-ismail`],
      images: post.mainImage
        ? [{ url: urlFor(post.mainImage).width(1200).url() }]
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

  const text = body
    .map((block: any) =>
      block.children?.map((c: any) => c.text).join(" ")
    )
    .join(" ");

  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

const getMoreArticles = cache(async (slug: string) => {
  return await client.fetch(
    `*[_type=="post" && slug.current != $slug] 
     | order(publishedAt desc)[0..3]{
      title,
      slug,
      mainImage,
      publishedAt,
      "category": categories[0]->title
    }`,
    { slug }
  );
});

export default async function ArticlePage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  const post = await getArticle(slug);

  if (!post) {
    notFound();
  }

  
  const readingTime = getReadingTime(post.body);

// 🔊 TEXT FOR AI VOICE
const articleText =
  post.body?.map((block:any)=>
    block.children?.map((c:any)=>c.text).join("")
  ).join(" ") || "";
  const articleUrl = `https://bombay-bureau.vercel.app/article/${slug}`;
  const authorSlug = post.author?.slug?.current || "muhammed-ismail";
  const authorName = post.author?.name || "Muhammed Ismail";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${articleUrl}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.mainImage
      ? [urlFor(post.mainImage).width(1600).url()]
      : undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post._updatedAt || post.publishedAt || undefined,
    author: {
      "@type": "Person",
      name: authorName,
      url: `https://bombay-bureau.vercel.app/author/${authorSlug}`,
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://bombay-bureau.vercel.app/#organization",
      name: "BOMBAY BUREAU",
      url: "https://bombay-bureau.vercel.app",
      logo: {
        "@type": "ImageObject",
        url: "https://bombay-bureau.vercel.app/icon.png",
      },
    },
    isAccessibleForFree: true,
  };

  // Fetch more articles for the related section
  const more = await getMoreArticles(slug);

  return (
    <main className="bg-black text-white min-h-screen">
      <TrackView slug={slug} />

      {/* READING BAR */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-gray-800 z-50">
        <div id="progressBar" className="h-full bg-white w-0" />
      </div>

      {/* CATEGORY TRACK */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          const cat = "${post.category || ""}";
          if(cat){
            let data = JSON.parse(localStorage.getItem("bb_read") || "{}");
            data[cat] = (data[cat] || 0) + 1;
            localStorage.setItem("bb_read", JSON.stringify(data));
          }
        `,
        }}
      />
      {/* HEADER */}
      <header className="relative z-40 border-b border-gray-800 overflow-visible bg-black">
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('/article-header.png')" }}
  />
  <div className="absolute inset-0 bg-black/70" />

  <div className="relative w-full px-4 md:px-8 py-4 md:py-6 flex items-center justify-between">
          <Link href="/" className="flex flex-col items-center leading-tight">
  <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-tight">
    BOMBAY BUREAU
  </h1>

  <p className="text-xs tracking-widest text-gray-400 mt-1 text-center">
    Global affairs, Indian perspective
  </p>
</Link>

          <UserMenu />
        </div>
      </header>

      {/* ARTICLE */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="max-w-[820px] mx-auto px-4 md:px-6 py-8 md:py-14">

  {/* CATEGORY + DATE */}
  <div className="mb-6">
    {post.category && (
      <span className="text-xs uppercase tracking-[0.25em] text-gray-400">
        {post.category}
      </span>
    )}
  </div>

  {/* HEADLINE */}
 <h1 className="text-2xl sm:text-3xl md:text-6xl font-serif leading-tight md:leading-[1.1] tracking-tight mb-4 md:mb-6">
    {post.title}
  </h1>

  {/* META LINE */}
  <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-400 mb-6 md:mb-8">
    <ListenButton text={articleText} />
    <span>•</span>

    {post.publishedAt && (
      <>
        <span>
          {new Date(post.publishedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        <span>•</span>
      </>
    )}

    <span>{readingTime} min read</span>
  </div>

  {/* HERO IMAGE */}
  {post.mainImage && (
    <figure className="mb-10">
      <img
  src={urlFor(post.mainImage).width(1800).url()}
  alt={post.mainImage?.alt || post.title}
  className="rounded-lg md:rounded-xl w-full"
/>

      {/* CAPTION */}
      {post.mainImage?.alt && (
        <figcaption className="text-xs text-gray-500 mt-3">
          {post.mainImage.alt}
        </figcaption>
      )}
    </figure>
  )}

  {/* ARTICLE BODY */}
<div className="prose prose-invert max-w-none prose-base md:prose-lg leading-relaxed">
  <PortableText
    value={post.body}
    components={{
      block: {
        normal: ({ children }) => (
          <p>{children}</p>
        ),
        h2: ({ children }) => (
          <h2 className="font-serif text-2xl md:text-3xl text-white mt-10 mb-4">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="font-serif text-xl md:text-2xl text-white mt-8 mb-3">
            {children}
          </h3>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-gray-600 pl-5 my-8 text-gray-400 italic">
            {children}
          </blockquote>
        ),
      },
      list: {
        bullet: ({ children }) => (
          <ul className="list-disc pl-6 my-6">
            {children}
          </ul>
        ),
        number: ({ children }) => (
          <ol className="list-decimal pl-6 my-6">
            {children}
          </ol>
        ),
      },
      marks: {
        strong: ({ children }) => (
          <strong className="text-white font-semibold">
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em>{children}</em>
        ),
        link: ({ value, children }) => (
          <a
            href={value?.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-gray-300"
          >
            {children}
          </a>
        ),
      },
    }}
  />
</div>

  {/* AUTHOR */}
  <div className="mt-20 pt-10 border-t border-gray-800">
    <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
      Written by
    </p>

    <div className="flex items-start gap-4">
      <div>
        <h3 className="text-xl font-serif">
          {post.author?.name || "Muhammed Ismail"}
        </h3>

        {post.author?.role && (
          <p className="mt-1 text-sm text-gray-500">
            {post.author.role}
            {post.author.location ? ` · ${post.author.location}` : ""}
          </p>
        )}

        {post.author?.slug?.current && (
          <Link
            href={`/author/${post.author.slug.current}`}
            className="inline-block mt-3 text-sm text-gray-300 underline underline-offset-4 hover:text-white"
          >
            View author profile →
          </Link>
        )}
      </div>
    </div>
  </div>

  <ShareBar />

</article>

      {/* RELATED */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-serif mb-10 border-t border-gray-800 pt-12">
          More from BOMBAY BUREAU
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {more.map((m: any) => (
            <Link
  key={m.slug?.current || m.title}
  href={m.slug?.current ? `/article/${m.slug.current}` : "#"}
>
              <div className="group cursor-pointer hover:-translate-y-1 transition-all duration-300">

                {m?.mainImage && (
  <img
    src={urlFor(m.mainImage).width(400).url()}
    alt={m.title}
    className="w-full h-[250px] object-cover rounded-lg mb-4 transition-transform duration-700 group-hover:scale-[1.05]"
  />
)}

                <h3 className="font-serif leading-snug group-hover:text-gray-300 transition-colors">
                  {m.title}
                </h3>

              </div>
            </Link>
          ))}
        </div>
      </section>
      
    </main>
  );
}
