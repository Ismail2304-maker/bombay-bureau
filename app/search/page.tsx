import Image from "next/image";
import Link from "next/link";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
const urlFor = (src: any) => builder.image(src);

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
    `*[_type=="post"
      && title match $q
      && (!defined($category) || $category == "" || $category in categories[]->title)
    ] | order(publishedAt desc){
      title,
      slug,
      mainImage,
      "excerpt": pt::text(body)[0..140],
      "category": categories[0]->title
    }`,
    {
      q: `${q}*`,
      category,
    }
  );

  return (
    <main className="bg-black text-white min-h-screen px-6 pt-40 max-w-5xl mx-auto">

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-4 md:mb-6">
        Search results for: <span className="text-gray-400">{q}</span>
      </h1>

      {/* FILTER BAR */}
      <div className="flex gap-4 md:gap-6 overflow-x-auto md:overflow-visible whitespace-nowrap border-b border-gray-800 pb-4 mb-8 md:mb-10 text-xs md:text-sm">
        {["All","India","World","Opinion","Politics","Business","Technology"].map(c=>(
          <Link
            key={c}
            href={`/search?q=${q}${c !== "All" ? `&category=${c}` : ""}`}
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

              {post.mainImage && (
  <img
    src={urlFor(post.mainImage).width(400).url()}
    alt=""
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