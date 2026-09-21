"use client";

import { useEffect, useState } from "react";

type SavedArticle = {
  slug: string;
  title: string;
  savedAt: string;
};

const STORAGE_KEY = "bb_saved_articles";

export default function SaveArticleButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const items: SavedArticle[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setSaved(items.some((item) => item.slug === slug));
    } catch {
      setSaved(false);
    }
  }, [slug]);

  function toggleSaved() {
    try {
      const items: SavedArticle[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const exists = items.some((item) => item.slug === slug);
      const next = exists
        ? items.filter((item) => item.slug !== slug)
        : [{ slug, title, savedAt: new Date().toISOString() }, ...items].slice(0, 100);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaved(!exists);
    } catch {
      // Keep the button usable even if browser storage is unavailable.
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
