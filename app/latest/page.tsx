import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity";

const builder = imageUrlBuilder(client);
const urlFor = (src: any) => builder.image(src);

export const metadata: Metadata = {
  title: "Latest",
  description: "Browse the latest published stories from BOMBAY BUREAU.",
  alternates: { canonical: "/latest" },
};

export const revalidate = 60;

const categories = [
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
];

const types = [
  { label: "All", value: "" },
  { label: "News", value: "news" },
  { label: "Opinion", value: "opinion" },
  { label: "Explainer", value: "explainer" },
];

const PAGE_SIZE = 18;

function makeUrl(page: number, category: string, type: string) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (category) params.set("category", category);
  if (type) params.set("type", type);
  const query = params.toString();
  return query ? `/latest?${query}` : "/latest";
}

export default async function LatestPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; type?: string }>;
}) {
  const params = await searchParams;

  const requestedPage = Number.parseInt(params.page || "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const category =
    params.category && categories.slice(1).includes(params.category)
      ? params.category
      : "";

  const type = types.some((item) => item.value === params.type) ? params.type || "" : "";

  const posts = await client.fetch(
    `*[
      _type == "post" &&
      !(_id in path("drafts.**")) &&
      coalesce(workflowStatus, "published") == "published" &&
      defined(slug.current) &&
      defined(publishedAt) &&
      (!defined($category) || $category == "" || $category in categories[]->title) &&
      (!defined($type) || $type == "" || contentType == $type)
    ] | order(publishedAt desc)[0...200]{
      title,
      slug,
      mainImage,
      excerpt,
      "fallbackExcerpt": pt::text(body)[0..220],
      publishedAt,
      "category": categories[0]->title,
      contentType,
      reportingType,
      author->{name, slug}
    }`,
    { category, type }
  );

  const total = posts.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visiblePosts = posts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
        <nav aria-label="Breadcrumb" className="text-[10px] uppercase tracking-[0.18em] text-gray-500 mb-5">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2 text-gray-700">/</span>
          <span>Latest</span>
        </nav>

        <div className="border-b border-gray-800 pb-8 md:pb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">BOMBAY BUREAU</p>
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight">Latest</h1>
          <p className="mt-4 max-w-3xl text-gray-400 text-base md:text-lg leading-relaxed">
            A chronological view of the newsroom, with filters for subject and story type.
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-5 border-b border-gray-800 pb-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600 mb-3">Section</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((item) => {
                const value = item === "All" ? "" : item;
                const active = category === value;
                return (
                  <Link
                    key={item}
                    href={makeUrl(1, value, type)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] transition-colors ${
                      active
                        ? "border-white text-white"
                        : "border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300"
                    }`}
                  >
                    {item}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600 mb-3">Story type</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {types.map((item) => {
                const active = type === item.value;
                return (
                  <Link
                    key={item.label}
                    href={makeUrl(1, category, item.value)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] transition-colors ${
                      active
                        ? "border-white text-white"
                        : "border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between py-5 text-[9px] uppercase tracking-[0.18em] text-gray-600">
          <span>
            {total ? `Showing ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, total)} of ${total}` : "No stories"}
          </span>
          <Link href="/archive" className="text-gray-400 hover:text-white transition-colors">
            Browse archive →
          </Link>
        </div>

        {visiblePosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-12 pb-14 md:pb-20">
            {visiblePosts.map((post: any) => {
              const slug = post?.slug?.current;
              if (!slug) return null;

              const excerpt = post.excerpt || post.fallbackExcerpt;
              const typeLabel =
                post.contentType === "opinion"
                  ? "Opinion"
                  : post.contentType === "explainer"
                    ? "Explainer"
                    : "News";

              return (
                <article key={slug} className="group border-b border-gray-900 pb-8">
                  <Link href={`/article/${slug}`} className="block">
                    {post.mainImage && (
                      <div className="overflow-hidden rounded-lg mb-4">
                        <Image
                          src={urlFor(post.mainImage).width(900).url()}
                          alt={post.mainImage?.alt || post.title}
                          width={900}
                          height={560}
                          loading="lazy"
                          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                          className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-gray-600 mb-2">
                      <span>{post.category || "News"}</span>
                      <span className="h-1 w-1 rounded-full bg-gray-700" />
                      <span>{typeLabel}</span>
                      {post.reportingType === "original_reporting" && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-gray-700" />
                          <span>Original reporting</span>
                        </>
                      )}
                    </div>

                    <h2 className="font-serif text-xl md:text-2xl leading-snug group-hover:text-gray-300 transition-colors">
                      {post.title}
                    </h2>

                    {excerpt && (
                      <p className="mt-3 text-sm leading-relaxed text-gray-500 line-clamp-3">
                        {excerpt}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-gray-600">
                      {post.author?.name && <span>By {post.author.name}</span>}
                      {post.author?.name && <span className="h-1 w-1 rounded-full bg-gray-700" />}
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-20 border-b border-gray-800">
            <h2 className="text-2xl font-serif">No published stories match these filters.</h2>
            <p className="mt-3 text-gray-500">Try another section or story type.</p>
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label="Latest stories pagination" className="flex items-center justify-between border-t border-gray-800 py-8 mb-8">
            {safePage > 1 ? (
              <Link
                href={makeUrl(safePage - 1, category, type)}
                className="text-xs uppercase tracking-[0.16em] text-gray-400 hover:text-white transition-colors"
              >
                ← Newer stories
              </Link>
            ) : (
              <span />
            )}

            <span className="text-[9px] uppercase tracking-[0.18em] text-gray-600">
              Page {safePage} of {totalPages}
            </span>

            {safePage < totalPages ? (
              <Link
                href={makeUrl(safePage + 1, category, type)}
                className="text-xs uppercase tracking-[0.16em] text-gray-400 hover:text-white transition-colors"
              >
                Older stories →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </section>
    </main>
  );
}
