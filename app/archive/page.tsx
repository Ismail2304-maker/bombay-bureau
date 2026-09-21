import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Archive",
  description: "Browse the Bombay Bureau archive by publication date.",
  alternates: { canonical: "/archive" },
};

export const revalidate = 300;

export default async function ArchivePage() {
  const posts = await client.fetch(`
    *[
      _type == "post" &&
      !(_id in path("drafts.**")) &&
      coalesce(workflowStatus, "published") == "published" &&
      defined(slug.current) &&
      defined(publishedAt)
    ] | order(publishedAt desc)[0..199]{
      title,
      slug,
      publishedAt,
      "category": categories[0]->title
    }
  `);

  const grouped = (posts || []).reduce((groups: Record<string, any[]>, post: any) => {
    const year = new Date(post.publishedAt).getFullYear().toString();
    if (!groups[year]) groups[year] = [];
    groups[year].push(post);
    return groups;
  }, {});

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-2xl md:text-3xl font-serif tracking-tight">BOMBAY BUREAU</span>
            <span className="text-[10px] md:text-xs tracking-widest text-gray-500 mt-1">Global affairs, Indian perspective</span>
          </Link>
          <Link href="/" className="text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
            Home
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">The Archive</p>
        <h1 className="mt-5 text-5xl md:text-7xl font-serif tracking-tight">Browse the record</h1>
        <p className="mt-7 max-w-3xl text-lg text-gray-400 leading-relaxed">
          Published stories from Bombay Bureau, organized by year. Search remains available
          for finding a specific story or subject.
        </p>

        <div className="mt-14 space-y-14">
          {years.map((year) => (
            <section key={year}>
              <div className="flex items-center gap-4 border-t border-gray-800 pt-5 mb-5">
                <h2 className="text-2xl md:text-3xl font-serif">{year}</h2>
                <span className="text-[9px] uppercase tracking-[0.18em] text-gray-600">
                  {grouped[year].length} stories
                </span>
              </div>

              <div className="border-t border-gray-900">
                {grouped[year].map((post: any) => (
                  <Link
                    key={post.slug.current}
                    href={`/article/${post.slug.current}`}
                    className="group flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-gray-900 py-4"
                  >
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.16em] text-gray-600 mb-1">
                        {post.category || "News"}
                      </p>
                      <h3 className="font-serif text-lg md:text-xl leading-snug group-hover:text-gray-300 transition-colors">
                        {post.title}
                      </h3>
                    </div>
                    <time
                      dateTime={post.publishedAt}
                      className="text-xs uppercase tracking-[0.12em] text-gray-600 shrink-0"
                    >
                      {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </time>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {!years.length && (
            <p className="text-gray-500">No published stories are currently available in the archive.</p>
          )}
        </div>
      </section>
    </main>
  );
}
