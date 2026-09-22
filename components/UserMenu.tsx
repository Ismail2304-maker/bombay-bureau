"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { isAdmin } from "@/lib/admin";
import Link from "next/link";

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setTimeout(() => setLoading(false), 300);
    });
    return () => unsub();
  }, []);

  // 🟡 skeleton when switching login/logout
  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse" />
    );
  }

  // 🔴 logged out
  if (!user) {
  return (
    <Link href="/signin">
      <button
        className="group flex items-center gap-2 px-2 md:px-3 py-2 text-[10px] md:text-xs uppercase tracking-[0.18em] text-gray-300 transition-colors duration-300 hover:text-white"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 transition-colors duration-300 group-hover:bg-white" />
        <span>Sign in</span>
      </button>
    </Link>
  );
}

  const letter = user.email?.charAt(0).toUpperCase();
  const admin = isAdmin(user.email);

  return (
    <div className="relative z-50">
      {/* AVATAR */}
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-black font-bold flex items-center justify-center text-sm md:text-base"
      >
        {letter}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-4 w-72 rounded-2xl bg-[#0b0b0b] border border-gray-800 shadow-2xl p-6 backdrop-blur-xl">

          <p className="text-xs text-gray-400 mb-1">Signed in as</p>
          <p className="text-sm mb-6 break-all">{user.email}</p>

          <div className="flex flex-col gap-3">

            {admin && (
              <>
                <Link href="/admin">
                  <button className="text-left hover:text-white">
                    Admin dashboard
                  </button>
                </Link>

                <a
  href="https://bombay-bureau-studio.vercel.app/"
  target="_blank"
  rel="noopener noreferrer"
  className="text-left hover:text-white"
>
  Write article
</a>
              </>
            )}

            <Link href="/account" className="text-left hover:text-white">
              Reader account
            </Link>

            <Link href="/saved" className="text-left hover:text-white">
              Saved stories
            </Link>

            {/* 🔥 NEW PREMIUM LOGOUT */}
            <button
              onClick={async () => {
                const fade = document.getElementById("pageFade");
                if (fade) fade.style.opacity = "1";

                setLoading(true);

                setTimeout(async () => {
                  await signOut(auth);
                  window.location.href = "/";
                }, 300);
              }}
              className="text-left text-red-400 hover:text-red-300 mt-2"
            >
              Logout
            </button>

          </div>
        </div>
      )}
    </div>
  );
}