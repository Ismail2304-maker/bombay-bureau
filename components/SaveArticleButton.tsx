"use client";

import {useEffect, useState} from "react";
import {onAuthStateChanged, User} from "firebase/auth";
import {collection, deleteDoc, doc, getDocs, setDoc} from "firebase/firestore";
import {auth, db} from "@/lib/firebase";

type SavedArticle = {
  slug: string;
  title: string;
  savedAt: string;
};

const STORAGE_KEY = "bb_saved_articles";

function readLocal(): SavedArticle[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLocal(items: SavedArticle[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 100)));
}

export default function SaveArticleButton({slug, title}: {slug: string; title: string}) {
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (current) => {
      setUser(current);

      if (!current) {
        setSaved(readLocal().some((item) => item.slug === slug));
        return;
      }

      try {
        const snapshot = await getDocs(collection(db, "savedArticles", current.uid, "items"));
        const remote = snapshot.docs.map((item) => item.data() as SavedArticle);
        const local = readLocal();

        // One-time migration from the old browser-only list into the account.
        const merged = [...remote];
        for (const item of local) {
          if (!merged.some((existing) => existing.slug === item.slug)) {
            merged.push(item);
            await setDoc(doc(db, "savedArticles", current.uid, "items", item.slug), item);
          }
        }

        if (local.length) localStorage.removeItem(STORAGE_KEY);
        setSaved(merged.some((item) => item.slug === slug));
      } catch {
        setSaved(readLocal().some((item) => item.slug === slug));
      }
    });
  }, [slug]);

  async function toggleSaved() {
    const nextSaved = !saved;
    setSaved(nextSaved);

    try {
      if (user) {
        const reference = doc(db, "savedArticles", user.uid, "items", slug);
        if (nextSaved) {
          await setDoc(reference, {slug, title, savedAt: new Date().toISOString()});
        } else {
          await deleteDoc(reference);
        }
        return;
      }

      const items = readLocal();
      const next = nextSaved
        ? [{slug, title, savedAt: new Date().toISOString()}, ...items].slice(0, 100)
        : items.filter((item) => item.slug !== slug);
      writeLocal(next);
    } catch {
      setSaved(saved);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleSaved}
      aria-pressed={saved}
      className="inline-flex items-center gap-2 rounded-full border border-gray-700 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-gray-400 hover:border-gray-500 hover:text-white transition-colors"
    >
      <span aria-hidden="true">{saved ? "✓" : "＋"}</span>
      {saved ? "Saved" : "Save"}
    </button>
  );
}
