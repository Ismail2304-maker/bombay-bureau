"use client";

import { useEffect } from "react";

const VIEW_COOLDOWN_MS = 30 * 60 * 1000;

export default function TrackView({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `bb_viewed:${slug}`;
    const now = Date.now();
    const lastViewed = Number(localStorage.getItem(key) || 0);

    if (lastViewed && now - lastViewed < VIEW_COOLDOWN_MS) {
      return;
    }

    localStorage.setItem(key, String(now));

    fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {
      // View tracking must never affect article reading.
    });
  }, [slug]);

  return null;
}
