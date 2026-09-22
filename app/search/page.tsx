import Link from "next/link";
import { client } from "@/lib/sanity";
import type { Metadata } from "next";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

type SearchPost = {
  title?: string;
  slug?: { current?: string };
  mainImage?: any;
  excerpt?: string;
  fallbackExcerpt?: string;
  publishedAt?: string;
  category?: string;
  categories?: string[];
  author?: string;
  contentType?: string;
  reportingType?: string;
};

const hasImageAsset = (src: any) =>
  Boolean(src?.asset?._ref || src?.asset?._id);

const safeImageUrl = (src: any) => {
  if (!hasImageAsset(src)) return null;
  try {
    return builder.image(src).width(400).url();
  } catch {
    return null;
  }
};

const normalizeText = (value: unknown) =>
  typeof value === "string" ? value.toLowerCase() : "";

const scorePost = (post: SearchPost, query: string) => {
  const q = normalizeText(query).trim();
  const title = normalizeText(post.title);
  const excerpt = normalizeText(post.excerpt || post.fallbackExcerpt);
  const author = normalizeText(post.author);
  const categories = normalizeText((post.categories || []).join(" "));
  const haystack = `${title} ${excerpt} ${author} ${categories}`;

  let score = 0;

  if (title === q) score += 100;
  if (title.includes(q)) score += 50;
  if (excerpt.includes(q)) score += 20;
  if (author.includes(q)) score += 15;
  if (categories.includes(q)) score += 12;

  for (const term of q.split(/\\s+/).filter(Boolean)) {
    if (title.includes(term)) score += 12;
    if (excerpt.includes(term)) score += 4;
    if (author.includes(term)) score += 3;
    if (categories.includes(term)) score += 3;
    if (haystack.includes(term)) score += 1;
  }

  if (post.publishedAt) {
    const ageDays =
      (Date.now() - new Date(post.publishedAt).getTime()) /
      (1000 * 60 * 60 * 24);

    if (Number.isFinite(ageDays) && ageDays >= 0) {
      score += Math.max(0, 10 - Math.min(ageDays, 10));
    }
  }

  return score;
};

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
  const params = await searchParams;
  const q = (params.q || "").trim();
  const category = params.category || "";

  if (!q) {
    return (
      <main className="bg-black text-white min-h-screen px-4 md:px-6 pt-28 md:pt-40 max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif">Search</h1>
        <p className="text-gray-500 mt-4">Type something to search.</p>
      </main>
    );
  }

  let posts: SearchPost[] = [];

  try {
    posts = await client.fetch(
      `*[
        _type == "post" &&
        !(_id in path("drafts.**")) &&
        coalesce(workflowStatus, "published") == "published" &&
        defined(slug.current) &&
        defined(publishedAt) &&
        (
          title match $q ||
          excerpt match $q ||
          pt::text(body) match $q ||
          author->name match $q ||
          categories[]->title match $q
        ) &&
        ($category == "" || $category in categories[]->title)
      ][0...100]{
        title,
        slug,
        mainImage,
        excerpt,
        "fallbackExcerpt": pt::text(body)[0...220],
        publishedAt,
        "category": categories[0]->title,
        "categories": categories[]->title,
        "author": author->name,
        contentType,
        reportingType
      }`,
      { q, category }
    );
  } catch (error) {
    console.error("Search query failed:", error);
  }

  const rankedPosts = [...(posts || [])]
    .filter((post) => Boolean(post?.slug?.current))
    .sort((a, b) => scorePost(b, q) - scorePost(a, q))
    .slice(0, 40);

  return (
    <main className="relative bg-black text-white min-h-screen px-6 pt-40 max-w-5xl mx-auto">
      <Link
        href="/"
        className="fixed top-8 left-6 text-white hover:opacity-70 transition-all duration-200 z-50"
        aria-label="Back to home"
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

      <div className="flex gap-4 md:gap-6 overflow-x-auto md:overflow-visible whitespace-nowrap border-b border-gray-800 pb-4 mb-8 md:mb-10 text-xs md:text-sm">
        {[
          "All",
          "India",
          "World",
          "Politics",
          "Business",
          "Technology",
          "Sports",
          "Culture",
          "Opinion",
          "Explainers",
        ].map((c) => (
          <Link
            key={c}
            href={
              c === "All"
                ? `/search?q=${encodeURIComponent(q)}`
                : `/search?q=${encodeURIComponent(q)}&category=${encodeURIComponent(c)}`
            }
            className={`hover:text-white ${
              category === c || (!category && c === "All")
                ? "text-white font-semibold"
                : "text-gray-400"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="space-y-10">
        {rankedPosts.length === 0 && (
          <p className="text-gray-500">
            No results found. Try a different search term.
          </p>
        )}

        {rankedPosts.map((post) => {
          const slug = post.slug?.current;
          if (!slug) return null;

          const imageUrl = safeImageUrl(post.mainImage);
          const excerpt = post.excerpt || post.fallbackExcerpt;

          return (
            <Link key={slug} href={`/article/${slug}`}>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 border-b border-gray-900 pb-6 md:pb-8 group">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={post.title || "BOMBAY BUREAU story"}
                    className="w-full sm:w-[220px] h-[200px] sm:h-[140px] object-cover rounded-md"
                  />
                )}

                <div>
                  <p className="text-xs text-gray-400 uppercase mb-1">
                    {post.category || "News"}
                  </p>

                  <h2 className="text-lg sm:text-xl md:text-2xl font-serif group-hover:text-gray-300">
                    {post.title || "Untitled story"}
                  </h2>

                  {excerpt && (
                    <p className="text-gray-400 mt-2 max-w-xl">{excerpt}</p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
