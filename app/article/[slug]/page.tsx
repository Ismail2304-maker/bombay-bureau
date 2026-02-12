import TrackView from "@/components/TrackView";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";
import Image from "next/image";
import { cache } from "react";
export async function generateMetadata({ params }: any) {
  const slug = params.slug;

  const post = await client.fetch(
    `*[_type=="post" && slug.current==$slug][0]{
      title,
      "excerpt": pt::text(body)[0..160],
      mainImage
    }`,
    { slug }
  );

  if (!post) return {};

  const image = post.mainImage
    ? urlFor(post.mainImage).width(1200).url()
    : "";

  return {
    title: post.title + " | Bombay Bureau",
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
  };
}
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export const revalidate = 60;

const getArticle = cache(async (slug: string) => {
  return await client.fetch(
    `*[_type=="post" && slug.current==$slug][0]{
      title,
      "excerpt": pt::text(body)[0..160],
      mainImage,
      body,
      publishedAt,
      "category": categories[0]->title
    }`,
    { slug }
  );
});

const getMorePosts = cache(async () => {
  return await client.fetch(
    `*[_type=="post"] | order(publishedAt desc)[0..4]{
      title,
      slug,
      mainImage
    }`
  );
});
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
export default async function ArticlePage({ params }: any) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const post = await getArticle(slug);
  const readingTime = getReadingTime(post.body);
  const more = await getMorePosts();

  if (!post) {
    return <div className="text-white p-10">Article not found</div>;
  }

  return (
    <main className="bg-black text-white min-h-screen">
     <TrackView slug={slug} />
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
      {/* HEADER BAR */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <Link href="/" className="text-center">
            <h1 className="text-2xl font-serif">BOMBAY BUREAU</h1>
            <p className="text-[11px] tracking-wide text-gray-400">
              Global affairs, Indian perspective
            </p>
          </Link>

          <Link href="/signin">
            <button className="bg-white text-black px-5 py-2 rounded-full font-semibold">
              Sign in
            </button>
          </Link>

        </div>
      </header>

      {/* ARTICLE CONTAINER */}
      <article className="max-w-4xl mx-auto px-6 py-12">

        {/* CATEGORY */}
        {post.category && (
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
            {post.category}
          </p>
        )}

        {/* HEADLINE */}
        <h1 className="text-5xl md:text-6xl font-serif leading-tight mb-6">
          {post.title}
        </h1>

        {/* SUBHEADLINE */}
        {post.excerpt && (
          <p className="text-xl text-gray-300 mb-8 max-w-3xl">
            {post.excerpt}
          </p>
        )}

        {/* META */}
        <div className="flex items-center justify-between border-y border-gray-800 py-4 mb-10 text-sm text-gray-400">
  <span>
    {new Date(post.publishedAt).toDateString()} • {readingTime} min read
  </span>

          {/* SHARE */}
          <div className="flex gap-4">
            <button className="hover:text-white">Twitter</button>
            <button className="hover:text-white">Facebook</button>
            <button className="hover:text-white">Copy</button>
          </div>
        </div>

        {/* HERO IMAGE */}
        {post.mainImage && (
          <div className="mb-10">
              <Image
              src={urlFor(post.mainImage).width(1800).url()}
              alt=""
              width={1800}
              height={1000}
              priority
              placeholder="blur"
              blurDataURL={`${urlFor(post.mainImage).width(20).blur(50).url()}`}
              className="rounded-xl"
            />
          </div>
        )}

        {/* BODY */}
        <div className="prose prose-invert max-w-none prose-lg leading-relaxed">
          {post.body?.map((block: any, i: number) => {
            if (block._type === "block") {
              return (
                <p key={i}>
                  {block.children.map((child: any) => child.text).join("")}
                </p>
              );
            }
            return null;
          })}
        </div>

      </article>

      {/* RELATED STORIES */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-serif mb-8 border-t border-gray-800 pt-10">
          More from BOMBAY BUREAU
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {more.map((m: any) => (
            <Link key={m.slug.current} href={`/article/${m.slug.current}`}>
              <div className="group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                {m.mainImage && (
                  <Image
                    src={urlFor(m.mainImage).width(400).url()}
                    alt=""
                    width={400}
                    height={250}
                    className="rounded-lg mb-3 transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                )}
                <h3 className="font-serif transition-colors group-hover:text-gray-300">
                
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