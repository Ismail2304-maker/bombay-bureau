import Header from "@/components/Header";
import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Discover",
  description: "Find deeper ways into BOMBAY BUREAU: context, records, reader tools and continuing coverage.",
  alternates: { canonical: "/discover" },
};

export const revalidate = 60;

export default async function DiscoverPage() {
  const data = await client.fetch(`
    {
      "topics": *[_type=="topic" && defined(slug.current)] | order(title asc)[0..29]{
        title, slug, description
      }
    }
  `);

  const pathways = [
    {
      eyebrow: "Context",
      title: "Go beyond the headline",
      text: "Use explainers when the important question is not only what happened, but how it fits together.",
      href: "/explainers",
      label: "Enter the explainers",
    },
    {
      eyebrow: "Record",
      title: "Trace the reporting",
      text: "Step back from the daily cycle and explore the stories BOMBAY BUREAU has published over time.",
      href: "/archive",
      label: "Open the archive",
    },
    {
      eyebrow: "Signal",
      title: "Get the Bureau in your inbox",
      text: "The Bombay Brief brings the newsroom's selected reading to you without making the homepage your only entry point.",
      href: "/newsletter",
      label: "Read about the brief",
    },
    {
      eyebrow: "Reader desk",
      title: "Keep a story for later",
      text: "Save pieces that deserve a second read and return to them when you have more time.",
      href: "/saved",
      label: "Open saved stories",
    },
    {
      eyebrow: "Open file",
      title: "Search the newsroom",
      text: "Look across subjects, authors and published reporting when you already know what you are looking for.",
      href: "/search",
      label: "Search BOMBAY BUREAU",
    },
    {
      eyebrow: "Open line",
      title: "Send a lead",
      text: "Have a document, development or story lead worth the newsroom's attention? Send it directly to the Bureau.",
      href: "/tips",
      label: "Send a tip",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-20">
        <nav aria-label="Breadcrumb" className="text-[10px] uppercase tracking-[0.18em] text-gray-500 mb-5">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2 text-gray-700">/</span>
          <span>Discover</span>
        </nav>

        <header className="border-b border-gray-800 pb-10 md:pb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">BOMBAY BUREAU</p>
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight">Discover</h1>
          <p className="mt-4 max-w-3xl text-gray-400 text-base md:text-lg leading-relaxed">
            Not another front page. Discover is the Bureau's reading room — a place to follow a thread,
            find context, trace the record, or choose your own way through the newsroom.
          </p>

          <form action="/search" className="mt-7 max-w-3xl flex gap-2">
            <label htmlFor="discover-search" className="sr-only">Search BOMBAY BUREAU</label>
            <input
              id="discover-search"
              name="q"
              placeholder="Search stories, subjects, authors…"
              className="min-w-0 flex-1 bg-black border border-gray-700 rounded-md px-4 py-3 text-sm outline-none focus:border-white placeholder:text-gray-600"
            />
            <button
              type="submit"
              className="rounded-md border border-white px-5 py-3 text-xs uppercase tracking-[0.16em] hover:bg-white hover:text-black"
            >
              Search
            </button>
          </form>
        </header>

        <section className="py-10 md:py-14 border-b border-gray-800">
          <div className="mb-8">
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600">Choose your way in</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-serif">The Bureau reading room</h2>
            <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed text-gray-500">
              Six different ways to use the publication, depending on what you need from it right now.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-800 border border-gray-800">
            {pathways.map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                className="bg-black p-6 md:p-7 group hover:bg-white/[0.03] transition-colors min-h-[210px]"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-gray-600">{item.eyebrow}</p>
                  <span className="font-serif text-sm text-gray-700">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-4 font-serif text-xl md:text-2xl group-hover:text-gray-300">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-500 max-w-sm">{item.text}</p>
                <p className="mt-6 text-[9px] uppercase tracking-[0.16em] text-gray-500 group-hover:text-white">
                  {item.label} →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="py-10 md:py-14 border-b border-gray-800">
          <div className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-14 items-start">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600">A newsroom with layers</p>
              <h2 className="mt-2 text-2xl md:text-3xl font-serif">Read the story at the depth you need.</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              <div className="border-t border-gray-800 pt-4">
                <p className="text-[9px] uppercase tracking-[0.18em] text-gray-600">01 · Follow</p>
                <p className="mt-3 font-serif text-lg">Stay with a subject.</p>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">Continuing coverage keeps related reporting connected over time.</p>
              </div>
              <div className="border-t border-gray-800 pt-4">
                <p className="text-[9px] uppercase tracking-[0.18em] text-gray-600">02 · Understand</p>
                <p className="mt-3 font-serif text-lg">Find the context.</p>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">Explainers and background help make complex developments legible.</p>
              </div>
              <div className="border-t border-gray-800 pt-4">
                <p className="text-[9px] uppercase tracking-[0.18em] text-gray-600">03 · Return</p>
                <p className="mt-3 font-serif text-lg">Keep the record.</p>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">Saved stories and the archive let you return when the moment has passed.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-10 md:pt-14">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600">Continuing coverage</p>
              <h2 className="mt-2 text-2xl md:text-3xl font-serif">Topics</h2>
            </div>
            <Link href="/topics" className="text-[10px] uppercase tracking-[0.16em] text-gray-500 hover:text-white">
              All topics →
            </Link>
          </div>

          {(data.topics || []).length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.topics.map((topic: any) => (
                <Link
                  key={topic.slug.current}
                  href={`/topic/${topic.slug.current}`}
                  className="border border-gray-800 rounded-lg p-5 group hover:border-gray-600"
                >
                  <h3 className="font-serif text-xl group-hover:text-gray-300">{topic.title}</h3>
                  {topic.description && (
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">{topic.description}</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Continuing coverage topics will appear here as they are published.</p>
          )}
        </section>
      </section>
    </main>
  );
}
