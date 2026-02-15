"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // ESC to close
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const submit = (e: any) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${query}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-start justify-center pt-40"
      onClick={onClose}
    >
      {/* INNER */}
      <div
        className="w-full max-w-3xl px-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* SEARCH INPUT */}
        <form onSubmit={submit}>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, topics, authors…"
            className="w-full bg-transparent border-b border-gray-700 text-2xl sm:text-4xl md:text-5xl font-serif outline-none pb-4 md:pb-6 placeholder:text-gray-600"
          />

          <p className="text-gray-500 mt-4 text-sm">
            Press Enter to search
          </p>
        </form>

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="mt-12 text-gray-400 hover:text-white transition text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}