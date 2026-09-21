"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SavedArticle = {
  slug: string;
  title: string;
  savedAt: string;
};

const STORAGE_KEY = "bb_saved_articles";

export default function SavedPage() {
  const [articles, setArticles] = useState<SavedArticle[]>([]);

  useEffect(() => {
    try {
      setArticles(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch {
      setArticles([]);
    }
  }, []);

  function clearSaved() {
    localStorage.removeItem(STORAGE_KEY);
    setArticles([]);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl md:text-3xl">BOMBAY BUREAU</Link>
          <Link href="/" className="text-xs uppercase tracking-widest text-gray-500 hover:text-white">Home</Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="flex items-end justify-between gap-6 border-b border-gray-800 pb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Reader tools</p>
            <h1 className="mt-3 text-4xl md:text-6xl font-serif">Saved stories</h1>
          </div>
          {articles.length > 0 && (
            <button
              type="button"
              onClick={clearSaved}
              className="text-[9px] uppercase tracking-[0.18em] text-gray-500 hover:text-white"
            >
              Clear all
            </button>
          )}
        </div>

        {articles.length ? (
          <div className="mt-8 border-t border-gray-900">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/article/${article.slug}`}
                className="block border-b border-gray-900 py-6 group"
              >
                <h2 className="font-serif text-xl md:text-2xl group-hover:text-gray-300 transition-colors">
                  {article.title}
                </h2>
                <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-gray-600">
                  Saved {new Date(article.savedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 border border-gray-800 rounded-lg p-8 text-gray-500">
            You have no saved stories yet. Use the Save button on an article to build your reading list.
          </div>
        )}
      </section>
    </main>
  );
}
