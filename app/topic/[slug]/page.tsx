import Header from "@/components/Header";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const builder = imageUrlBuilder(client);
const urlFor = (src: any) => builder.image(src);
const hasImageAsset = (src: any) => Boolean(src?.asset?._ref || src?.asset?._id);
const baseUrl = "https://bombay-bureau.vercel.app";

async function getTopic(slug: string) {
  return client.fetch(`*[_type == "topic" && slug.current == $slug][0]{title,slug,description,"relatedTopics":relatedTopics[]->{title,slug}}`, { slug });
}

async function getCoverage(slug: string) {
  return client.fetch(`*[_type == "post" && !(_id in path("drafts.**")) && coalesce(workflowStatus, "published") == "published" && defined(slug.current) && $slug in topics[]->slug.current] | order(publishedAt desc)[0...40]{title,slug,mainImage,excerpt,publishedAt,contentType,reportingType,"author":author->{name,slug},"categories":categories[]->title}`, { slug });
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const topic = await getTopic(slug);
  if (!topic) return { title: "Topic not found" };
  return { title: `${topic.title} | BOMBAY BUREAU`, description: topic.description, alternates: { canonical: `/topic/${slug}` }, openGraph: { type: "website", title: `${topic.title} | BOMBAY BUREAU`, description: topic.description, url: `${baseUrl}/topic/${slug}` } };
}

export default async function TopicPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const topic = await getTopic(slug);
  if (!topic) notFound();
  const posts = await getCoverage(slug);
  const lead = posts[0];
  const rest = posts.slice(1);
  const breadcrumbJsonLd = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":baseUrl},{"@type":"ListItem","position":2,"name":"Topics","item":`${baseUrl}/topics`},{"@type":"ListItem","position":3,"name":topic.title,"item":`${baseUrl}/topic/${slug}`}]};
  return <main className="min-h-screen bg-black text-white">
    <Header />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <section className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
      <nav aria-label="Breadcrumb" className="text-[10px] uppercase tracking-[0.18em] text-gray-500 mb-5"><Link href="/" className="hover:text-white transition-colors">Home</Link><span className="mx-2 text-gray-700">/</span><Link href="/topics" className="hover:text-white transition-colors">Topics</Link><span className="mx-2 text-gray-700">/</span><span>{topic.title}</span></nav>
      <header className="border-b border-gray-800 pb-8 md:pb-10 mb-10 md:mb-12"><p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">Continuing coverage</p><h1 className="text-4xl md:text-6xl font-serif tracking-tight">{topic.title}</h1><p className="mt-4 max-w-3xl text-gray-400 text-base md:text-lg leading-relaxed">{topic.description}</p></header>
      {lead ? <><Link href={`/article/${lead.slug.current}`} className="group block"><div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-12 md:mb-16">{hasImageAsset(lead.mainImage) && <Image src={urlFor(lead.mainImage).width(1200).url()} alt={lead.mainImage?.alt || lead.title} width={1200} height={700} priority className="rounded-lg w-full h-auto transition-transform duration-700 group-hover:scale-[1.01]" sizes="(max-width: 767px) 100vw, 50vw" />}<div className="flex flex-col justify-center"><p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">Latest coverage</p><h2 className="text-3xl md:text-5xl font-serif leading-tight group-hover:text-gray-300 transition">{lead.title}</h2>{lead.excerpt && <p className="text-gray-400 mt-5 text-base md:text-lg leading-relaxed">{lead.excerpt}</p>}<div className="mt-6 flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-gray-600">{lead.author?.name && <span>By {lead.author.name}</span>}{lead.author?.name && <span className="h-1 w-1 rounded-full bg-gray-700" />}{lead.publishedAt && <time dateTime={lead.publishedAt}>{new Date(lead.publishedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</time>}</div></div></div></Link>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 pb-16"><div className="md:col-span-2"><div className="border-t border-gray-800 pt-5 mb-7"><h2 className="text-xl md:text-2xl font-serif">Latest stories</h2></div><div className="space-y-8">{rest.map((post:any)=><article key={post.slug.current} className="border-b border-gray-800 pb-8"><Link href={`/article/${post.slug.current}`} className="grid grid-cols-1 sm:grid-cols-3 gap-5 group">{hasImageAsset(post.mainImage) && <Image src={urlFor(post.mainImage).width(600).url()} alt={post.mainImage?.alt || post.title} width={600} height={400} className="rounded-md w-full aspect-[3/2] object-cover" sizes="(max-width: 639px) 100vw, 33vw" />}<div className="sm:col-span-2"><div className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-gray-600 mb-2"><span>{post.categories?.[0] || "News"}</span>{post.contentType === "opinion" && <span>Opinion</span>}{post.contentType === "explainer" && <span>Explainer</span>}</div><h3 className="font-serif text-xl md:text-2xl leading-snug group-hover:text-gray-300">{post.title}</h3>{post.excerpt && <p className="text-gray-400 text-sm md:text-base mt-3 leading-relaxed line-clamp-3">{post.excerpt}</p>}<div className="mt-4 flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-gray-600">{post.author?.name && <span>By {post.author.name}</span>}{post.author?.name && <span className="h-1 w-1 rounded-full bg-gray-700" />}<time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</time></div></div></Link></article>)}</div></div>
          <aside className="space-y-10 md:ml-6">{topic.relatedTopics?.length > 0 && <div><h2 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">Related topics</h2><div className="space-y-2">{topic.relatedTopics.map((related:any)=><Link key={related.slug.current} href={`/topic/${related.slug.current}`} className="block border-b border-gray-800 py-3 text-sm text-gray-400 hover:text-white transition-colors">{related.title}</Link>)}</div></div>}<div><h2 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">About this coverage</h2><p className="text-sm text-gray-500 leading-relaxed">This page brings together published BOMBAY BUREAU reporting, analysis and explainers connected to this topic.</p></div></aside>
        </div></> : <div className="border border-gray-800 rounded-lg py-16 px-6 text-center mb-16"><h2 className="text-2xl font-serif">Coverage is beginning.</h2><p className="mt-3 text-gray-500 max-w-xl mx-auto">Stories connected to this topic will appear here as they are published.</p></div>}
    </section>
  </main>;
}