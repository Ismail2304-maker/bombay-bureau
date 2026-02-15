import Header from "@/components/Header";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import Link from "next/link";

const builder = imageUrlBuilder(client);
const urlFor = (src: any) => builder.image(src);

export const revalidate = 60;

async function getPosts(category: string) {
  return await client.fetch(
    `*[_type=="post" && $category in categories[]->title]
     | order(publishedAt desc){
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
  const categorySlug = params.category;

  const categoryName =
    categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  const posts = await getPosts(categoryName);

  const lead = posts[0];
  const rest = posts.slice(1);

  return (
    <main className="bg-black text-white min-h-screen">
      <Header />

      <section className="max-w-7xl mx-auto px-6 mt-12">

        {/* CATEGORY TITLE */}
        <h1 className="text-5xl font-serif mb-10">
          {categoryName}
        </h1>

        {/* LEAD STORY */}
        {lead && (
          <Link href={`/article/${lead.slug.current}`}>
            <div className="grid md:grid-cols-2 gap-8 mb-14 cursor-pointer group">
              
              <Image
                src={urlFor(lead.mainImage).width(1200).url()}
                alt=""
                width={1200}
                height={700}
                className="rounded-lg"
              />

              <div>
                <h2 className="text-3xl font-serif group-hover:text-gray-300 transition">
                  {lead.title}
                </h2>

                <p className="text-gray-400 mt-4">
                  {lead.excerpt}
                </p>
              </div>

            </div>
          </Link>
        )}

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-3 gap-12">

          {/* LEFT — STORY LIST */}
          <div className="md:col-span-2 space-y-10">

            {rest.map((post: any) => (
              <Link key={post.slug.current} href={`/article/${post.slug.current}`}>
                <div className="grid grid-cols-3 gap-6 border-b border-gray-800 pb-8 group cursor-pointer">

                  <div className="col-span-1">
                    <Image
                      src={urlFor(post.mainImage).width(400).url()}
                      alt=""
                      width={400}
                      height={250}
                      className="rounded-md"
                    />
                  </div>

                  <div className="col-span-2">
                    <h3 className="font-serif text-lg group-hover:text-gray-300">
                      {post.title}
                    </h3>

                    <p className="text-gray-400 text-sm mt-2">
                      {post.excerpt}
                    </p>
                  </div>

                </div>
              </Link>
            ))}

          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-10 ml-6">

            <div>
              <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">
                Latest
              </h3>

              {posts.slice(0,5).map((post: any) => (
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