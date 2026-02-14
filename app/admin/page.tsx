"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { isAdmin } from "@/lib/admin";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<any>(null);
  const router = useRouter();

  // 🔐 ADMIN CHECK
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) return router.push("/signin");
      if (!isAdmin(u.email)) return router.push("/");
      setUser(u);
      
    });
    return () => unsub();
  }, [router]);

  // 📊 FETCH ANALYTICS
  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(setStats);
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-10">

      {/* HEADER */}
      <h1 className="text-4xl font-serif mb-2">BOMBAY BUREAU</h1>
      <p className="text-gray-400 mb-12">Admin Dashboard</p>

      {/* USER */}
      <div className="mb-12">
        Logged in as: {user.email}
      </div>

      {/* QUICK ACTIONS */}
      <div className="flex flex-wrap gap-4 mb-16">

        {/* 🏠 HOMEPAGE */}
        <Link href="/">
          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
            Go to Homepage
          </button>
        </Link>

        {/* ✍️ WRITE ARTICLE */}
<Link href="/studio">
  <button
    
    className="border border-gray-700 px-6 py-3 rounded-full hover:bg-white hover:text-black transition"
  >
    Write / Edit Article
  </button>
</Link>
        {/* LOGOUT */}
        <button
          onClick={()=>signOut(auth)}
          className="border border-red-500 text-red-400 px-6 py-3 rounded-full hover:bg-red-500 hover:text-white transition"
        >
          Logout
        </button>

      </div>

      {/* STATS */}
      {stats && (
        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <div className="bg-[#0b0b0b] p-6 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">Total Reads</p>
            <p className="text-3xl font-bold">{stats.totalReads}</p>
          </div>

          <div className="bg-[#0b0b0b] p-6 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">Reads Today</p>
            <p className="text-3xl font-bold">{stats.todayReads}</p>
          </div>

        </div>
      )}

      {/* TOP ARTICLES */}
      {stats?.topArticles && (
        <div className="bg-[#0b0b0b] p-8 rounded-2xl border border-gray-800">
          <h2 className="text-xl mb-6 font-serif">Top Articles</h2>

          <div className="space-y-4">
            {stats.topArticles.map((a:any, i:number)=>(
              <div key={i} className="flex justify-between border-b border-gray-800 pb-3">
                <span>{a.title}</span>
                <span className="text-gray-400">{a.views}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}