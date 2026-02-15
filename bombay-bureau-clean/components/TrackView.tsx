"use client";
import { useEffect } from "react";

export default function TrackView({ slug }: { slug: string }) {
  useEffect(() => {
    fetch("/api/view", {
      method: "POST",
      body: JSON.stringify({ slug }),
    });
  }, [slug]);

  return null;
}