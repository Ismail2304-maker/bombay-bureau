import type { MetadataRoute } from "next";
import { client } from "@/lib/sanity";

const baseUrl="https://bombay-bureau.vercel.app";

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const data=await client.fetch(`
    {
      "topics": *[_type=="topic" && defined(slug.current)]{"slug":slug.current,_updatedAt},
      "posts": *[_type=="post" && !(_id in path("drafts.**")) && coalesce(workflowStatus,"published")=="published" && defined(slug.current)]{
        "slug":slug.current,publishedAt,firstPublishedAt,lastPublishedAt
      },
      "authors": *[_type=="author" && !(_id in path("drafts.**")) && defined(slug.current)]{
        "slug":slug.current,_updatedAt
      }
    }
  `);
  const staticPaths=[
    "","/about","/newsroom","/contact","/privacy","/terms","/editorial-standards",
    "/ai-policy","/corrections","/cookies","/author/muhammed-ismail","/india","/world","/politics",
    "/business","/technology","/explainers","/newsletter","/tips",
  ];
  const staticUrls=staticPaths.map(path=>({url:`${baseUrl}${path}`}));
  const topicUrls=(data.topics||[]).map((topic:any)=>({url:baseUrl+"/topic/"+topic.slug,lastModified:topic._updatedAt||undefined}));
  const authorUrls=(data.authors||[]).map((author:any)=>({
    url:`${baseUrl}/author/${author.slug}`,
    lastModified:author._updatedAt||undefined,
  }));
  const postUrls=(data.posts||[]).map((post:any)=>({
    url:`${baseUrl}/article/${post.slug}`,
    lastModified:post.lastPublishedAt||post.firstPublishedAt||post.publishedAt||undefined,
  }));
  return [...staticUrls,...topicUrls,...authorUrls,...postUrls];
}
