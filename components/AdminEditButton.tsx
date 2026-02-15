"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { isAdmin } from "@/lib/admin";

export default function AdminEditButton({ postId }: { postId: string }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u: User | null) => {
      if (!u) return;

      if (isAdmin(u.email)) {
        setAllowed(true);
      }
    });

    return () => unsub();
  }, []);

  if (!allowed) return null;


  return (
    <a
      href="https://bombay-bureau-admin.sanity.studio"
      target="_blank"
      className="fixed bottom-6 right-6 bg-white text-black px-5 py-3 rounded-full shadow-lg font-semibold z-50 hover:scale-105 transition"
    >
      ✏️ Edit article
    </a>
  );
}