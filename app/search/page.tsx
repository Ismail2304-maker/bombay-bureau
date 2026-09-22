import Link from "next/link";
import { client } from "@/lib/sanity";
import type { Metadata } from "next";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
const urlFor = (src: any) => builder.image(src);
const hasImageAsset = (src: any) => Boolean(src?.asset?._ref || src?.asset?._id);

export const metadata: Metadata = {
  title: "Search",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {

  // 🔥 IMPORTANT (Next 16 fix)
  const params = await searchParams;

  const q = params.q || "";
  const category = params.category || "";

  if (!q) {
    return (
      <main className="bg-black text-white min-h-screen px-4 md:px-6 pt-28 md:pt-40 max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif">Search</h1>
        <p className="text-gray-500 mt-4">Type something to search.</p>
      </main>
    );
  }

  const posts = await client.fetch(
    `*[
      _type == "post" &&
      !(_id in path("drafts.**")) &&
      coalesce(workflowStatus, "published") == "published" &&
      defined(slug.current) &&
      (
        title match text::query($q) ||
        excerpt match text::query($q) ||
        pt::text(body) match text::query($q) ||
        author->name match text::query($q) ||
        categories[]->title match text::query($q)
      ) &&
      (!defined($category) || $category == "" || $category in categories[]->title)
    ]
    | score(
        boost(title match text::query($q), 5),
        boost(excerpt match text::query($q), 2),
        boost(pt::text(body) match text::query($q), 1),
        boost(author->name match text::query($q), 3),
        boost(categories[]->title match text::query($q), 2),
        boost(publishedAt > now() - 60*60*24*30, 0.5)
      )
    | order(_score desc, publishedAt desc)
    [0...40]{
      title,
      slug,
      mainImage,
      excerpt,
      "fallbackExcerpt": pt::text(body)[0..220],
      publishedAt,
      "category": categories[0]->title,
      "categories": categories[]->title,
      "author": author->name,
      contentType,
      reportingType,
      _score
    }`,
    {
      q,
      category,
    }
  );

  return (
  <main className="relative bg-black text-white min-h-screen px-6 pt-40 max-w-5xl mx-auto">

    {/* 🔙 BACK TO HOME */}
    <Link
      href="/"
      className="fixed top-8 left-6 text-white hover:opacity-70 transition-all duration-200 z-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </Link>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-4 md:mb-6">
        Search results for: <span className="text-gray-400">{q}</span>
      </h1>

      {/* FILTER BAR */}
      <div className="flex gap-4 md:gap-6 overflow-x-auto md:overflow-visible whitespace-nowrap border-b border-gray-800 pb-4 mb-8 md:mb-10 text-xs md:text-sm">
        {["All","India","World","Politics","Business","Technology","Sports","Culture","Opinion","Explainers"].map(c=>(
          <Link
            key={c}
            href={c === "All" ? `/search?q=${encodeURIComponent(q)}` : `/search?q=${encodeURIComponent(q)}&category=${encodeURIComponent(c)}`}
            className={`hover:text-white ${
              category===c || (!category && c==="All")
                ? "text-white font-semibold"
                : "text-gray-400"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      {/* RESULTS */}
      <div className="space-y-10">
        {posts.length === 0 && (
          <p className="text-gray-500">No results found.</p>
        )}

        {posts.map((post:any)=>(
          <Link key={post.slug.current} href={`/article/${post.slug.current}`}>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 border-b border-gray-900 pb-6 md:pb-8 group">

              {hasImageAsset(post.mainImage) && (
  <img
    src={urlFor(post.mainImage).width(400).url()}
    alt={post.title}
    className="w-full sm:w-[220px] h-[200px] sm:h-[140px] object-cover rounded-md"
  />
)}

              <div>
                <p className="text-xs text-gray-400 uppercase mb-1">
                  {post.category}
                </p>

                <h2 className="text-lg sm:text-xl md:text-2xl font-serif group-hover:text-gray-300">
                  {post.title}
                </h2>

                <p className="text-gray-400 mt-2 max-w-xl">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </main>
  );
}