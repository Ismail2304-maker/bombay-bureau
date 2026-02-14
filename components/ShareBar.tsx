"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp, FaFacebookF, FaXTwitter } from "react-icons/fa6";

export default function ShareBar() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!url) return null;

  return (
    <div className="max-w-3xl mx-auto mt-12 border-t border-gray-800 pt-8 flex items-center justify-between">
      
      {/* LEFT TEXT */}
      <p className="text-sm text-gray-400 tracking-wide">
        Share
      </p>

      {/* RIGHT ICONS */}
      <div className="flex items-center gap-5 text-gray-400 text-lg">

        {/* WHATSAPP */}
        <a
          href={`https://wa.me/?text=${url}`}
          target="_blank"
          className="hover:text-white transition"
        >
          <FaWhatsapp />
        </a>

        {/* FACEBOOK */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank"
          className="hover:text-white transition"
        >
          <FaFacebookF />
        </a>

        {/* TWITTER/X */}
        <a
          href={`https://twitter.com/intent/tweet?url=${url}`}
          target="_blank"
          className="hover:text-white transition"
        >
          <FaXTwitter />
        </a>

      </div>
    </div>
  );
}