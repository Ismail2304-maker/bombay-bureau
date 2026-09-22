"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {onAuthStateChanged, signOut, User} from "firebase/auth";
import {auth} from "@/lib/firebase";
import NewsletterPreferences from "@/components/NewsletterPreferences";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, (current) => {
    setUser(current);
    setLoading(false);
  }), []);

  if (loading) return <main className="min-h-screen bg-black text-white px-6 py-24 text-gray-500">Loading account…</main>;

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl md:text-3xl">BOMBAY BUREAU</Link>
          <Link href="/" className="text-xs uppercase tracking-widest text-gray-500 hover:text-white">Home</Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Reader account</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-serif">Your reading desk</h1>

        {!user ? (
          <div className="mt-10 border border-gray-800 rounded-2xl p-7">
            <p className="text-gray-400 leading-relaxed">Sign in to keep saved stories and newsletter preferences across devices.</p>
            <Link href="/signin" className="inline-block mt-6 rounded-md border border-white px-5 py-3 text-xs uppercase tracking-[0.16em] hover:bg-white hover:text-black">
              Sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10 border border-gray-800 rounded-2xl p-7">
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600">Signed in as</p>
              <p className="mt-2 text-lg break-all">{user.email}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/saved" className="rounded-md border border-gray-700 px-4 py-2 text-xs uppercase tracking-[0.16em] hover:border-white">Saved stories</Link>
                <button type="button" onClick={() => signOut(auth)} className="rounded-md border border-gray-800 px-4 py-2 text-xs uppercase tracking-[0.16em] text-gray-500 hover:text-white">Sign out</button>
              </div>
            </div>
            <NewsletterPreferences />
          </>
        )}
      </section>
    </main>
  );
}
