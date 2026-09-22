"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {onAuthStateChanged, User} from "firebase/auth";
import {collection, deleteDoc, doc, getDocs} from "firebase/firestore";
import {auth, db} from "@/lib/firebase";

type SavedArticle = {slug: string; title: string; savedAt: string};
const STORAGE_KEY = "bb_saved_articles";

function readLocal(): SavedArticle[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

export default function SavedPage() {
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (current) => {
      setUser(current);
      try {
        if (!current) {
          setArticles(readLocal());
        } else {
          const snapshot = await getDocs(collection(db, "savedArticles", current.uid, "items"));
          const remote = snapshot.docs.map((item) => item.data() as SavedArticle);
          setArticles(remote.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()));
        }
      } catch {
        setArticles(readLocal());
      } finally {
        setLoading(false);
      }
    });
  }, []);

  async function remove(slug: string) {
    if (user) {
      await deleteDoc(doc(db, "savedArticles", user.uid, "items", slug));
    } else {
      const next = readLocal().filter((item) => item.slug !== slug);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    setArticles((current) => current.filter((item) => item.slug !== slug));
  }

  async function clearSaved() {
    if (user) {
      await Promise.all(articles.map((article) => deleteDoc(doc(db, "savedArticles", user.uid, "items", article.slug))));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
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
            <p className="mt-3 text-sm text-gray-600">{user ? "Synced to your reader account." : "Saved on this device. Sign in to sync across devices."}</p>
          </div>
          {articles.length > 0 && (
            <button type="button" onClick={clearSaved} className="text-[9px] uppercase tracking-[0.18em] text-gray-500 hover:text-white">
              Clear all
            </button>
          )}
        </div>

        {loading ? (
          <div className="mt-10 text-gray-500">Loading your reading list…</div>
        ) : articles.length ? (
          <div className="mt-8 border-t border-gray-900">
            {articles.map((article) => (
              <div key={article.slug} className="border-b border-gray-900 py-6 flex items-start gap-5">
                <Link href={`/article/${article.slug}`} className="group flex-1">
                  <h2 className="font-serif text-xl md:text-2xl group-hover:text-gray-300 transition-colors">{article.title}</h2>
                  <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-gray-600">
                    Saved {new Date(article.savedAt).toLocaleDateString("en-IN", {day: "numeric", month: "short", year: "numeric"})}
                  </p>
                </Link>
                <button type="button" onClick={() => remove(article.slug)} className="text-[9px] uppercase tracking-[0.16em] text-gray-600 hover:text-white">Remove</button>
              </div>
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
