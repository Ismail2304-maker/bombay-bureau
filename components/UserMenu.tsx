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
        <button className="px-3 md:px-5 py-1.5 md:py-2 rounded-full border border-gray-700 text-xs md:text-sm hover:bg-white hover:text-black transition">
          Sign in
        </button>
      </Link>
    );
  }

  const letter = user.email?.charAt(0).toUpperCase();
  const admin = isAdmin(user.email);

  return (
    <div className="relative">
      {/* AVATAR */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-white text-black font-bold flex items-center justify-center"
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