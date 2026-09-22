import Header from "@/components/Header";
import { client } from "@/lib/sanity";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Topics | BOMBAY BUREAU", description: "Continuing coverage and subjects reported by BOMBAY BUREAU.", alternates: { canonical: "/topics" } };
export const revalidate = 60;

export default async function TopicsPage() {
  const topics = await client.fetch(`*[_type == "topic" && defined(slug.current)] | order(title asc){title,slug,description}`);
  return <main className="min-h-screen bg-black text-white">
    <Header />
    <section className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-20">
      <nav aria-label="Breadcrumb" className="text-[10px] uppercase tracking-[0.18em] text-gray-500 mb-5"><Link href="/" className="hover:text-white transition-colors">Home</Link><span className="mx-2 text-gray-700">/</span><span>Topics</span></nav>
      <header className="border-b border-gray-800 pb-8 md:pb-10 mb-10 md:mb-12"><p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">BOMBAY BUREAU</p><h1 className="text-4xl md:text-6xl font-serif tracking-tight">Topics</h1><p className="mt-4 max-w-3xl text-gray-400 text-base md:text-lg leading-relaxed">Continuing coverage of subjects that develop across multiple stories.</p></header>
      {topics.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{topics.map((topic:any)=><Link key={topic.slug.current} href={`/topic/${topic.slug.current}`} className="group border border-gray-800 rounded-lg p-6 hover:border-gray-600 transition-colors"><p className="text-[9px] uppercase tracking-[0.2em] text-gray-600 mb-3">Continuing coverage</p><h2 className="font-serif text-2xl group-hover:text-gray-300 transition-colors">{topic.title}</h2>{topic.description && <p className="mt-3 text-sm text-gray-500 leading-relaxed">{topic.description}</p>}</Link>)}</div> : <div className="border border-gray-800 rounded-lg py-16 px-6 text-center"><h2 className="text-2xl font-serif">No topics yet.</h2><p className="mt-3 text-gray-500">Create a topic in the newsroom to begin a continuing coverage page.</p></div>}
    </section>
  </main>;
}