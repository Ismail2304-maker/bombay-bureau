import UserButton from "@/components/UserButton";
import AdminEditButton from "@/components/AdminEditButton";
import ListenButton from "@/components/ListenButton";
import ShareBar from "@/components/ShareBar";
import TrackView from "@/components/TrackView";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";
import Image from "next/image";
import { cache } from "react";

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => {
  try {
    if (!source?.asset?._ref) {
      return {
        width: () => ({
          url: () => "",
        }),
      };
    }

    return builder.image(source);
  } catch {
    return {
      width: () => ({
        url: () => "",
      }),
    };
  }
};

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
      "category": categories[0]->title
    }`,
    { slug }
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

const getMoreArticles = cache(async (slug: string) => {
  return await client.fetch(
    `*[_type=="post" && slug.current != $slug] 
     | order(publishedAt desc)[0..3]{
      title,
      slug,
      mainImage
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
    return <div className="text-white p-10">Article not found</div>;
  }

  
  const readingTime = getReadingTime(post.body);

// 🔊 TEXT FOR AI VOICE
const articleText =
  post.body?.map((block:any)=>
    block.children?.map((c:any)=>c.text).join("")
  ).join(" ") || "";
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
      <header className="border-b border-gray-800">
        <div className="w-full px-8 py-6 flex items-center justify-between">
          <Link href="/" className="flex flex-col items-center leading-tight">
  <h1 className="text-4xl font-serif tracking-tight">
    BOMBAY BUREAU
  </h1>

  <p className="text-xs tracking-widest text-gray-400 mt-1 text-center">
    Global affairs, Indian perspective
  </p>
</Link>

          <UserButton />
        </div>
      </header>

      {/* ARTICLE */}
      <article className="max-w-[820px] mx-auto px-6 py-14">

  {/* CATEGORY + DATE */}
  <div className="mb-6">
    {post.category && (
      <span className="text-xs uppercase tracking-[0.25em] text-gray-400">
        {post.category}
      </span>
    )}
  </div>

  {/* HEADLINE */}
  <h1 className="text-4xl md:text-6xl font-serif leading-[1.1] tracking-tight mb-6">
    {post.title}
  </h1>

  {/* META LINE */}
  <div className="flex items-center gap-3 text-sm text-gray-400 mb-8">
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
  {(() => {
  const imageBuilder = urlFor(post.mainImage);
  return imageBuilder ? (
    <figure className="mb-10">
      <Image
        src={imageBuilder.width(1800).url()}
        alt={post.mainImage?.alt || post.title || ""}
        width={1800}
        height={1000}
        priority
        className="rounded-xl"
      />

      {post.mainImage?.alt && (
        <figcaption className="text-xs text-gray-500 mt-3">
          {post.mainImage.alt}
        </figcaption>
      )}
    </figure>
  ) : null;
})()}

     
  {/* ARTICLE BODY */}
  <div className="prose prose-invert max-w-none prose-lg leading-relaxed">

    {post.body?.map((block: any, i: number) => {
      if (block._type === "block") {
        const text = block.children
          .map((child: any) => child.text)
          .join("");

        // DROP CAP FIRST PARAGRAPH
        if (i === 0) {
          return (
            <p
              key={i}
              className="first-letter:text-7xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:leading-none"
            >
              {text}
            </p>
          );
        }

        return <p key={i}>{text}</p>;
      }

      return null;
    })}
  </div>

  {/* AUTHOR */}
  <div className="mt-20 pt-10 border-t border-gray-800">
    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
      Written by
    </p>
    <h3 className="text-lg font-serif">Bombay Bureau</h3>
  </div>

  <ShareBar />

</article>

      {/* RELATED */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-serif mb-10 border-t border-gray-800 pt-12">
          More from BOMBAY BUREAU
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {more.map((m: any) => (
            <Link key={m.slug.current} href={`/article/${m.slug.current}`}>
              <div className="group cursor-pointer hover:-translate-y-1 transition-all duration-300">

                {(() => {
  const imageBuilder = urlFor(m.mainImage);
  return imageBuilder ? (
    <Image
      src={imageBuilder.width(400).url()}
      alt={m.title || ""}
      width={400}
      height={250}
      className="rounded-lg mb-4 transition-transform duration-700 group-hover:scale-[1.05]"
    />
  ) : null;
})()}

                <h3 className="font-serif leading-snug group-hover:text-gray-300 transition-colors">
                  {m.title}
                </h3>

              </div>
            </Link>
          ))}
        </div>
      </section>
      <AdminEditButton postId={post._id} />
    </main>
  );
}