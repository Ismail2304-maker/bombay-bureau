"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity";

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source);

export default function ForYou({ posts }: any) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem("bb_read") || "{}");

      const ranked = posts
        .map((p: any) => {
          const score = (p.categories || []).reduce(
            (s: number, c: string) => s + (prefs[c] || 0),
            0
          );
          return { ...p, score };
        })
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 4);

      setItems(ranked);
    } catch {}
  }, [posts]);

  if (!items.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 mt-20">
      <h2 className="text-2xl font-serif mb-6 border-b border-gray-800 pb-2">
        For You
      </h2>

      <div className="grid md:grid-cols-4 gap-6">
        {items.map((post: any) => (
          <Link key={post.slug.current} href={`/article/${post.slug.current}`}>
            <div className="group cursor-pointer">

              {post.mainImage && (
                <div className="overflow-hidden rounded-lg mb-3">
                  <Image
                    src={urlFor(post.mainImage).url()}
                    alt=""
                    width={400}
                    height={250}
                    className="transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                </div>
              )}

              <h3 className="font-serif group-hover:text-gray-300 transition-colors">
                {post.title}
              </h3>

            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}