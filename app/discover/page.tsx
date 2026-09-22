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
      },
      "latest": *[
        _type=="post" &&
        !(_id in path("drafts.**")) &&
        coalesce(workflowStatus,"published")=="published" &&
        defined(slug.current) &&
        defined(publishedAt)
      ] | order(publishedAt desc)[0..7]{
        title, slug, publishedAt, "category": categories[0]->title
      },
      "popular": *[
        _type=="post" &&
        !(_id in path("drafts.**")) &&
        coalesce(workflowStatus,"published")=="published" &&
        defined(slug.current) &&
        defined(publishedAt)
      ] | order(views desc, publishedAt desc)[0..5]{
        title, slug, publishedAt, "category": categories[0]->title
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
          Find the latest reporting, continuing coverage, subjects and the newsroom archive.
        </p>
        <form action="/search" className="mt-7 max-w-3xl flex gap-2">
          <label htmlFor="discover-search" className="sr-only">Search BOMBAY BUREAU</label>
          <input id="discover-search" name="q" placeholder="Search stories, subjects, authors…" className="min-w-0 flex-1 bg-black border border-gray-700 rounded-md px-4 py-3 text-sm outline-none focus:border-white placeholder:text-gray-600" />
          <button type="submit" className="rounded-md border border-white px-5 py-3 text-xs uppercase tracking-[0.16em] hover:bg-white hover:text-black">Search</button>
        </form>
      </header>

      <section className="py-10 border-b border-gray-800">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div><p className="text-[9px] uppercase tracking-[0.2em] text-gray-600">Explore by section</p><h2 className="mt-2 text-2xl md:text-3xl font-serif">Newsroom sections</h2></div>
          <Link href="/latest" className="text-[10px] uppercase tracking-[0.16em] text-gray-500 hover:text-white">Latest →</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => <Link key={section} href={`/${section.toLowerCase()}`} className="rounded-full border border-gray-800 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-gray-400 hover:border-gray-500 hover:text-white">{section}</Link>)}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 py-10">
        <section className="lg:col-span-2">
          <div className="flex items-end justify-between gap-4 mb-6"><div><p className="text-[9px] uppercase tracking-[0.2em] text-gray-600">Fresh reporting</p><h2 className="mt-2 text-2xl md:text-3xl font-serif">Latest stories</h2></div><Link href="/latest" className="text-[10px] uppercase tracking-[0.16em] text-gray-500 hover:text-white">View all →</Link></div>
          <div className="border-t border-gray-800">
            {(data.latest || []).map((post:any) => <Link key={post.slug.current} href={`/article/${post.slug.current}`} className="block border-b border-gray-900 py-5 group">
              <p className="text-[9px] uppercase tracking-[0.16em] text-gray-600 mb-2">{post.category || "News"} · {new Date(post.publishedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</p>
              <h3 className="font-serif text-lg md:text-xl leading-snug group-hover:text-gray-300">{post.title}</h3>
            </Link>)}
          </div>
        </section>

        <aside>
          <div className="mb-10">
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600">Reader interest</p>
            <h2 className="mt-2 text-2xl font-serif mb-5">Popular stories</h2>
            <div className="border-t border-gray-800">
              {(data.popular || []).map((post:any,index:number) => <Link key={post.slug.current} href={`/article/${post.slug.current}`} className="block border-b border-gray-900 py-4 group">
                <div className="flex gap-3"><span className="text-xs text-gray-700">{String(index+1).padStart(2,"0")}</span><div><p className="text-[9px] uppercase tracking-[0.14em] text-gray-600 mb-1">{post.category || "News"}</p><h3 className="font-serif leading-snug group-hover:text-gray-300">{post.title}</h3></div></div>
              </Link>)}
            </div>
          </div>
        </aside>
      </div>

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
