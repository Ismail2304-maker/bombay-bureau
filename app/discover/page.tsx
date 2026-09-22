import Header from "@/components/Header";
import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Discover",
  description: "Discover stories, topics and continuing coverage from BOMBAY BUREAU.",
  alternates: { canonical: "/discover" },
};
export const revalidate = 60;

const sections = ["India","World","Politics","Business","Technology","Sports","Culture","Opinion","Explainers"];

export default async function DiscoverPage() {
  const data = await client.fetch(`
    {
      "topics": *[_type=="topic" && defined(slug.current)] | order(title asc)[0..29]{
        title, slug, description
      }
    }
  `);

  return <main className="min-h-screen bg-black text-white">
    <Header />
    <section className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-20">
      <nav aria-label="Breadcrumb" className="text-[10px] uppercase tracking-[0.18em] text-gray-500 mb-5">
        <Link href="/" className="hover:text-white">Home</Link><span className="mx-2 text-gray-700">/</span><span>Discover</span>
      </nav>

      <header className="border-b border-gray-800 pb-9 md:pb-11">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">BOMBAY BUREAU</p>
        <h1 className="text-4xl md:text-6xl font-serif tracking-tight">Discover</h1>
        <p className="mt-4 max-w-3xl text-gray-400 text-base md:text-lg leading-relaxed">
          Find a way into BOMBAY BUREAU beyond the front page — follow subjects, understand stories, explore viewpoints and return to the archive.
        </p>
        <form action="/search" className="mt-7 max-w-3xl flex gap-2">
          <label htmlFor="discover-search" className="sr-only">Search BOMBAY BUREAU</label>
          <input id="discover-search" name="q" placeholder="Search stories, subjects, authors…" className="min-w-0 flex-1 bg-black border border-gray-700 rounded-md px-4 py-3 text-sm outline-none focus:border-white placeholder:text-gray-600" />
          <button type="submit" className="rounded-md border border-white px-5 py-3 text-xs uppercase tracking-[0.16em] hover:bg-white hover:text-black">Search</button>
        </form>
      </header>

      <section className="py-10 border-b border-gray-800">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600">Choose your route</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-serif">Explore the Bureau</h2>
          </div>
          <span className="hidden sm:block text-[9px] uppercase tracking-[0.18em] text-gray-700">Beyond the homepage</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-800 border border-gray-800">
          {[
            {
              eyebrow: "Follow a subject",
              title: "Continuing coverage",
              text: "Stay with a story as it develops across multiple reports.",
              href: "/topics",
              label: "Browse topics",
            },
            {
              eyebrow: "Understand the story",
              title: "Explainers",
              text: "Context, background and clear breakdowns for complicated subjects.",
              href: "/explainers",
              label: "Read explainers",
            },
            {
              eyebrow: "Read viewpoints",
              title: "Opinion",
              text: "Arguments and analysis presented separately from news reporting.",
              href: "/opinion",
              label: "Explore opinion",
            },
            {
              eyebrow: "See the reporting",
              title: "Watch",
              text: "Video journalism and visual reporting from the Bureau.",
              href: "/#video",
              label: "Watch video",
            },
            {
              eyebrow: "Go back in time",
              title: "The archive",
              text: "Trace the publication's reporting across its history.",
              href: "/archive",
              label: "Open archive",
            },
            {
              eyebrow: "Keep for later",
              title: "Saved stories",
              text: "Collect articles you want to return to when you have time.",
              href: "/saved",
              label: "Open saved",
            },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="bg-black p-6 md:p-7 group hover:bg-white/[0.03] transition-colors">
              <p className="text-[9px] uppercase tracking-[0.18em] text-gray-600">{item.eyebrow}</p>
              <h3 className="mt-3 font-serif text-xl md:text-2xl group-hover:text-gray-300">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 max-w-sm">{item.text}</p>
              <p className="mt-5 text-[9px] uppercase tracking-[0.16em] text-gray-500 group-hover:text-white">{item.label} →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-800 pt-10">
        <div className="flex items-end justify-between gap-4 mb-6"><div><p className="text-[9px] uppercase tracking-[0.2em] text-gray-600">Continuing coverage</p><h2 className="mt-2 text-2xl md:text-3xl font-serif">Topics</h2></div><Link href="/topics" className="text-[10px] uppercase tracking-[0.16em] text-gray-500 hover:text-white">All topics →</Link></div>
        {(data.topics || []).length ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{data.topics.map((topic:any) => <Link key={topic.slug.current} href={`/topic/${topic.slug.current}`} className="border border-gray-800 rounded-lg p-5 group hover:border-gray-600"><h3 className="font-serif text-xl group-hover:text-gray-300">{topic.title}</h3>{topic.description && <p className="mt-2 text-sm text-gray-500 line-clamp-2">{topic.description}</p>}</Link>)}</div> : <p className="text-gray-500">Continuing coverage topics will appear here as they are published.</p>}
      </section>

      <section className="mt-12 border-t border-gray-800 pt-8 flex flex-wrap gap-5 text-[10px] uppercase tracking-[0.16em] text-gray-500">
        <Link href="/archive" className="hover:text-white">Archive →</Link>
        <Link href="/saved" className="hover:text-white">Saved stories →</Link>
        <Link href="/newsletter" className="hover:text-white">The Bombay Brief →</Link>
      </section>
    </section>
  </main>;
}
