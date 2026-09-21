import Header from "@/components/Header";
import CategoryScrollReset from "@/components/CategoryScrollReset";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const builder=imageUrlBuilder(client);
const urlFor=(src:any)=>builder.image(src);
export const revalidate=60;

function articleHref(slug:string){
  const clean=String(slug||"")
    .trim()
    .replace(/^https?:\/\/[^/]+\//i,"")
    .replace(/^\/+/, "")
    .replace(/^article\//i,"");
  return clean ? `/article/${clean}` : "#";
}

function displayTitle(title:string,slug:string){
  const value=String(title||"").trim();
  if(value && !/^https?:\/\//i.test(value) && !/^\/?article\//i.test(value)) return value;
  const clean=String(slug||"")
    .replace(/^https?:\/\/[^/]+\//i,"")
    .replace(/^\/+/, "")
    .replace(/^article\//i,"")
    .replace(/-\\d{4,}$/,"");
  return clean
    ? decodeURIComponent(clean).replace(/[-_]+/g," ").replace(/\\b\\w/g,(m)=>m.toUpperCase())
    : "Untitled story";
}

const validCategorySlugs=["india","world","politics","business","technology","sports","culture","explainers"];
const categoryDescriptions:Record<string,string>={
  india:"The latest reporting and developments across India.",
  world:"International affairs, geopolitics and major developments around the world.",
  politics:"Political developments, public policy and government from an Indian perspective.",
  business:"Companies, the economy, industry and business developments.",
  technology:"Technology, artificial intelligence, digital policy and innovation.",
  sports:"Sports news, results, tournaments, teams and the people shaping the world of sport.",
  culture:"Film, television, music, books, arts and the wider culture shaping public life.",
  explainers:"Clear, contextual explainers focused on what happened, why it matters and what comes next.",
};

export async function generateMetadata(props:{params:Promise<{category:string}>}):Promise<Metadata>{
  const {category}=await props.params;
  const slug=category.toLowerCase();
  const name=slug.charAt(0).toUpperCase()+slug.slice(1);
  const description=categoryDescriptions[slug]||`Latest ${name} news and reporting from Bombay Bureau.`;
  return{title:name,description,alternates:{canonical:`/${slug}`},openGraph:{type:"website",title:`${name} | BOMBAY BUREAU`,description,url:`/${slug}`}};
}

async function getPosts(category:string){
  return await client.fetch(`*[_type=="post" && $category in categories[]->title] | order(publishedAt desc)[0..39]{
    title,slug,mainImage,publishedAt,views,"excerpt":pt::text(body)[0..180],"category":categories[0]->title
  }`,{category});
}

export default async function CategoryPage(props:any){
  const params=await props.params;
  const categorySlug=params.category.toLowerCase();
  if(!validCategorySlugs.includes(categorySlug))notFound();
  const categoryName=categorySlug.charAt(0).toUpperCase()+categorySlug.slice(1);
  const description=categoryDescriptions[categorySlug];
  const posts=await getPosts(categoryName);
  const now = Date.now();
  const leadCandidates = posts.slice(0, 8);
  const lead = [...leadCandidates].sort((a:any, b:any) => {
    const score = (post:any) => {
      const hours = Math.max(0, (now - new Date(post.publishedAt).getTime()) / 3600000);
      const freshness = Math.max(0, 1 - Math.min(hours, 72) / 72);
      const reach = Math.log1p(Math.max(0, post.views || 0));
      return freshness * 18 + reach * 2;
    };
    return score(b) - score(a);
  })[0] || posts[0];
  const rest = posts.filter((post:any) => post?.slug?.current !== lead?.slug?.current);
  const breadcrumbJsonLd={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem",position:1,name:"Home",item:"https://bombay-bureau.vercel.app"},
    {"@type":"ListItem",position:2,name:categoryName,item:`https://bombay-bureau.vercel.app/${categorySlug}`}
  ]};

  return <main className="bg-black text-white min-h-screen">
    <CategoryScrollReset />
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbJsonLd)}} />
    <Header />
    <section className="max-w-7xl mx-auto px-4 md:px-6 mt-8 md:mt-12">
      <nav aria-label="Breadcrumb" className="text-[10px] uppercase tracking-[0.18em] text-gray-500 mb-5">
        <Link href="/" className="hover:text-white transition-colors">Home</Link><span className="mx-2 text-gray-700">/</span><span>{categoryName}</span>
      </nav>
      <div className="border-b border-gray-800 pb-8 md:pb-10 mb-10 md:mb-12">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">BOMBAY BUREAU</p>
        <h1 className="text-4xl md:text-6xl font-serif tracking-tight">{categoryName}</h1>
        <p className="mt-4 max-w-3xl text-gray-400 text-base md:text-lg leading-relaxed">{description}</p>
      </div>
      {lead&&<Link href={`/article/${lead.slug.current}`} className="group block">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-14 md:mb-16">
          {lead.mainImage&&<Image src={urlFor(lead.mainImage).width(1200).url()} alt={lead.title} width={1200} height={700} priority className="rounded-lg w-full h-auto transition-transform duration-700 group-hover:scale-[1.01]" sizes="(max-width: 767px) 100vw, 50vw" />}
          <div className="flex flex-col justify-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">Lead story</p>
            <h2 className="text-3xl md:text-5xl font-serif leading-tight group-hover:text-gray-300 transition">{lead.title}</h2>
            <p className="text-gray-400 mt-5 text-base md:text-lg leading-relaxed">{lead.excerpt}</p>
            {lead.publishedAt&&<time dateTime={lead.publishedAt} className="mt-6 text-xs uppercase tracking-[0.15em] text-gray-600">{new Date(lead.publishedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</time>}
          </div>
        </div>
      </Link>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-20">
        <div className="md:col-span-2 space-y-8 md:space-y-10">
          {rest.map((post:any)=>{
            const slug=post?.slug?.current;
            if(!slug) return null;
            const title=displayTitle(post.title,slug);
            const href=articleHref(slug);
            return <article key={slug} className="border-b border-gray-800 pb-8">
              <Link href={href} className="grid grid-cols-1 sm:grid-cols-3 gap-5 group">
                <div>{post.mainImage&&<Image src={urlFor(post.mainImage).width(500).url()} alt={title} width={500} height={320} className="rounded-md w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]" sizes="(max-width: 767px) 100vw, 33vw" />}</div>
                <div className="sm:col-span-2">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray-600 mb-2">{post.category||categoryName}</p>
                  <h3 className="font-serif text-xl md:text-2xl leading-snug group-hover:text-gray-300">{title}</h3>
                  {post.excerpt&&<p className="text-gray-400 text-sm md:text-base mt-3 leading-relaxed">{post.excerpt}</p>}
                </div>
              </Link>
            </article>;
          })}
        </div>
        <aside className="space-y-10 md:ml-6">
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">Latest in {categoryName}</h3>
            {rest.slice(0,6).map((post:any)=>{
              const slug=post?.slug?.current;
              if(!slug) return null;
              return <Link key={slug} href={articleHref(slug)} className="block">
                <div className="py-3 border-b border-gray-800 hover:translate-x-1 transition text-sm leading-relaxed">{displayTitle(post.title,slug)}</div>
              </Link>;
            })}
          </div>
        </aside>
      </div>
    </section>
  </main>;
}
