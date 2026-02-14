"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import Link from "next/link";

export default function UserButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    setMenu(false);
    await signOut(auth);

    // smooth redirect
    setTimeout(() => {
      window.location.href = "/";
    }, 200);
  };

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse" />
    );
  }

  return (
    <div className="relative">
      {/* IF LOGGED IN */}
      {user ? (
        <>
          <button
            onClick={() => setMenu(!menu)}
            className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold hover:opacity-80 transition-all duration-300"
          >
            {user.email?.[0].toUpperCase()}
          </button>

          {/* DROPDOWN */}
          {menu && (
            <div className="absolute right-0 mt-3 w-56 bg-[#0b0b0b] border border-gray-800 rounded-xl p-4 shadow-2xl animate-fadeIn">
              
              <p className="text-xs text-gray-400 mb-2 truncate">
                {user.email}
              </p>

              <div className="border-t border-gray-800 my-2" />

              <Link href="/" className="block py-2 hover:text-white">
                Home
              </Link>

              <Link href="/admin" className="block py-2 hover:text-white">
                Admin Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="block py-2 text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </div>
          )}
        </>
      ) : (
        /* IF LOGGED OUT */
        <Link
          href="/signin"
          className="px-5 py-2 rounded-full border border-white text-white hover:bg-white hover:text-black transition-all duration-300"
        >
          Sign in
        </Link>
      )}
    </div>
  );
}