import Link from "next/link";
import Header from "@/components/Header";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
const urlFor = (src: any) => builder.image(src);

export const revalidate = 60;

export default async function OpinionPage() {
  const posts = await client.fetch(`
    *[
      _type == "post" &&
      "Opinion" in categories[]->title
    ]
    | order(publishedAt desc)[0...20] {
      title,
      slug,
      mainImage,
      publishedAt,
      "excerpt": pt::text(body)[0...180]
    }
  `);

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-16">

        <div className="border-b border-gray-800 pb-8 mb-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2">
            Bombay Bureau
          </p>

          <h1 className="font-serif text-4xl md:text-6xl">
            Opinion
          </h1>

          <p className="text-gray-500 mt-3 max-w-xl">
            Analysis, arguments and perspectives from Bombay Bureau.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500">
            No opinion articles published yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link
                key={post.slug.current}
                href={`/article/${post.slug.current}`}
                className="group"
              >
                {post.mainImage && (
                  <img
                    src={urlFor(post.mainImage).width(900).url()}
                    alt=""
                    className="w-full aspect-[16/10] object-cover mb-5"
                  />
                )}

                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-2">
                  Opinion
                </p>

                <h2 className="font-serif text-xl md:text-2xl leading-tight group-hover:text-gray-300 transition">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}