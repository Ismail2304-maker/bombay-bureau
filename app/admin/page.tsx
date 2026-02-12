"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { isAdmin } from "@/lib/admin";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/signin");
        return;
      }

      if (!isAdmin(u.email)) {
        router.push("/");
        return;
      }

      setUser(u);
    });

    return () => unsub();
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Checking admin access...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-serif mb-6">BOMBAY BUREAU Admin</h1>

      <p className="text-gray-400 mb-8">
        Logged in as: {user.email}
      </p>

      <a
        href="http://localhost:3333"
        target="_blank"
        className="bg-white text-black px-6 py-3 rounded-full font-semibold"
      >
        Open Sanity Studio
      </a>
    </div>
  );
}