import Link from "next/link";
import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

const siteUrl = "https://bombay-bureau.vercel.app";
export const revalidate = 60;

const getAuthor = cache(async (slug:string)=>{
  return await client.fetch(`*[_type=="author" && slug.current==$slug][0]{
    name, role, location, bio, image, _updatedAt,
    "articles": *[_type=="post" && references(^._id) && defined(slug.current)]
      | order(publishedAt desc)[0..19]{title,slug,publishedAt,"category":categories[0]->title}
  }`,{slug});
});

export async function generateMetadata(props:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await props.params;
  const author=await getAuthor(slug);
  if(!author)return{title:"Author not found"};
  const description=author.bio?.[0]?.children?.map((c:any)=>c.text).join(" ")||`${author.name} — ${author.role||"Author"} at Bombay Bureau.`;
  return{
    title:author.name,
    description,
    alternates:{canonical:`/author/${slug}`},
    openGraph:{type:"profile",title:`${author.name} | BOMBAY BUREAU`,description,url:`/author/${slug}`},
  };
}

export default async function AuthorPage(props:{params:Promise<{slug:string}>}){
  const {slug}=await props.params;
  const author=await getAuthor(slug);
  if(!author)notFound();

  const authorUrl=`${siteUrl}/author/${slug}`;
  const authorId=`${authorUrl}#person`;
  const profileJsonLd={
    "@context":"https://schema.org",
    "@type":"ProfilePage",
    "@id":`${authorUrl}#profile`,
    mainEntity:{
      "@id":authorId,
      "@type":"Person",
      name:author.name,
      description:author.bio?.[0]?.children?.map((c:any)=>c.text).join(" ")||undefined,
      jobTitle:author.role||undefined,
      url:authorUrl,
      image: author.image ? urlFor(author.image).width(800).url() : undefined,
    },
    hasPart:(author.articles||[]).map((article:any)=>({
      "@type":"Article",
      headline:article.title,
      url:`${siteUrl}/article/${article.slug.current}`,
      datePublished:article.publishedAt||undefined,
      author:{"@id":authorId},
    })),
  };

  return <main className="min-h-screen bg-black text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(profileJsonLd)}} />
    <header className="border-b border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-2xl md:text-3xl font-serif tracking-tight">BOMBAY BUREAU</span>
          <span className="text-[10px] md:text-xs tracking-widest text-gray-500 mt-1">Global affairs, Indian perspective</span>
        </Link>
        <Link href="/" className="text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Home</Link>
      </div>
    </header>
    <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-5">Author</p>
      {author.image ? (
        <img
          src={urlFor(author.image).width(240).height(240).fit("crop").url()}
          alt={author.name + " — BOMBAY BUREAU author portrait"}
          className="mt-6 h-28 w-28 rounded-full object-cover border border-gray-800"
        />
      ) : null}
      <h1 className="mt-6 text-4xl md:text-6xl font-serif tracking-tight">{author.name}</h1>
      {author.role&&<p className="mt-4 text-base md:text-lg text-gray-400">{author.role}{author.location?` · ${author.location}`:""}</p>}
      <div className="mt-10 max-w-3xl text-gray-300 prose prose-invert prose-lg leading-relaxed">{author.bio?<PortableText value={author.bio}/>:null}</div>
    </section>
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div className="border-t border-gray-800 pt-10">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3">Articles</p>
        <h2 className="text-3xl font-serif mb-10">Published by {author.name}</h2>
        {author.articles?.length?<div className="grid gap-0 border-t border-gray-800">
          {author.articles.map((article:any)=><Link key={article.slug?.current||article.title} href={`/article/${article.slug.current}`} className="group border-b border-gray-800 py-6 md:py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-xl md:text-2xl font-serif group-hover:text-gray-300 transition-colors">{article.title}</h3>
              <p className="mt-2 text-xs uppercase tracking-widest text-gray-500">{article.category||"News"}</p>
            </div>
            {article.publishedAt&&<time className="text-sm text-gray-500 shrink-0">{new Date(article.publishedAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</time>}
          </Link>)}
        </div>:<p className="text-gray-500">No published articles are currently linked to this author.</p>}
      </div>
    </section>
  </main>;
}
