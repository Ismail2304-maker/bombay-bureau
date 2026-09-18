import Header from "@/components/Header";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const builder = imageUrlBuilder(client);
const urlFor = (src: any) => builder.image(src);

export const revalidate = 60;

const validCategorySlugs = [
  "india",
  "world",
  "politics",
  "business",
  "technology",
  "markets",
  "explainers",
];

const categoryDescriptions: Record<string, string> = {
  india: "Latest India news and reporting from Bombay Bureau.",
  world: "World news, international affairs and global developments from Bombay Bureau.",
  politics: "Political news and developments from India and around the world.",
  business: "Business news, companies, economy and financial developments from Bombay Bureau.",
  technology: "Technology news, digital developments and innovation from Bombay Bureau.",
  markets: "Indian market movements, trading activity and financial developments.",
  explainers: "Explainers from Bombay Bureau covering what happened, why it matters and what comes next.",
};

export async function generateMetadata(
  props: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await props.params;
  const slug = category.toLowerCase();
  const name = slug.charAt(0).toUpperCase() + slug.slice(1);
  const description =
    categoryDescriptions[slug] ||
    `Latest ${name} news and reporting from Bombay Bureau.`;

  return {
    title: name,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: "website",
      title: `${name} | BOMBAY BUREAU`,
      description,
      url: `/${slug}`,
    },
  };
}

async function getPosts(category: string) {
  return await client.fetch(
    `*[_type=="post" && $category in categories[]->title]
     | order(publishedAt desc)[0..39]{
      title,
      slug,
      mainImage,
      publishedAt,
      "excerpt": pt::text(body)[0..140]
     }`,
    { category }
  );
}

export default async function CategoryPage(props: any) {
  const params = await props.params;
  const categorySlug = params.category.toLowerCase();

  if (!validCategorySlugs.includes(categorySlug)) {
    notFound();
  }

  const categoryName =
    categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  const posts = await getPosts(categoryName);
  const lead = posts[0];
  const rest = posts.slice(1);

  return (
    <main className="bg-black text-white min-h-screen">
      <Header />

      <section className="max-w-7xl mx-auto px-6 mt-12">
        <h1 className="text-5xl font-serif mb-10">{categoryName}</h1>

        {lead && (
          <Link href={`/article/${lead.slug.current}`}>
            <div className="grid md:grid-cols-2 gap-8 mb-14 cursor-pointer group">
              {lead?.mainImage && (
                <Image
                  src={urlFor(lead.mainImage).width(1200).url()}
                  alt={lead.title}
                  width={1200}
                  height={700}
                  className="rounded-lg w-full h-auto"
                  sizes="(max-width: 767px) 100vw, 50vw"
                />
              )}
              <div>
                <h2 className="text-3xl font-serif group-hover:text-gray-300 transition">
                  {lead.title}
                </h2>
                <p className="text-gray-400 mt-4">{lead.excerpt}</p>
              </div>
            </div>
          </Link>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-10">
            {rest.map((post: any) => (
              <Link key={post.slug.current} href={`/article/${post.slug.current}`}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-gray-800 pb-8 group cursor-pointer">
                  <div className="col-span-1">
                    {post?.mainImage && (
                      <Image
                        src={urlFor(post.mainImage).width(400).url()}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="rounded-md w-full h-auto"
                        sizes="(max-width: 767px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="col-span-2">
                    <h3 className="font-serif text-lg group-hover:text-gray-300">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-2">{post.excerpt}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <aside className="space-y-10 md:ml-6">
            <div>
              <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">
                Latest
              </h3>
              {posts.slice(0, 5).map((post: any) => (
                <Link key={post.slug.current} href={`/article/${post.slug.current}`}>
                  <div className="py-3 border-b border-gray-800 hover:translate-x-1 transition cursor-pointer">
                    {post.title}
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
