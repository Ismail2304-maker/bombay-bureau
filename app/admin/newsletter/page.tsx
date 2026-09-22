"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { isAdmin } from "@/lib/admin";
import Link from "next/link";

type Issue = {
  _id: string;
  title: string;
  subject: string;
  previewText?: string;
  scheduledAt?: string;
  featuredCount?: number;
};

export default function AdminNewsletterPage() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (current) => {
      if (!current || !isAdmin(current.email)) {
        window.location.href = current ? "/" : "/signin";
        return;
      }
      setUser(current);
    });
  }, []);

  async function loadIssues() {
    if (!token) {
      setMessage("Enter the newsletter admin token first.");
      return;
    }

    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/newsletter/issues", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Unable to load newsletter issues.");
      setIssues([]);
    } else {
      setIssues(data.issues || []);
      setMessage(data.issues?.length ? "" : "No issues are marked Ready yet.");
    }

    setLoading(false);
  }

  async function sendIssue(issueId: string) {
    if (!token) return;

    const confirmed = window.confirm(
      "Send this Bombay Brief issue now to the newsletter segment?"
    );
    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/newsletter/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ issueId }),
    });

    const data = await response.json();
    setMessage(data.message || data.error || "Request completed.");
    setLoading(false);

    if (response.ok) {
      await loadIssues();
    }
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Admin</p>
            <h1 className="mt-2 text-4xl md:text-5xl font-serif">Newsletter Desk</h1>
          </div>
          <Link href="/admin" className="text-xs uppercase tracking-[0.16em] text-gray-500 hover:text-white">
            Admin dashboard
          </Link>
        </div>

        <div className="border border-gray-800 rounded-2xl p-6 md:p-8 mb-8">
          <p className="text-sm text-gray-400 leading-relaxed">
            Only issues marked <strong className="text-white">Ready</strong> in Sanity can be sent.
            The send action uses Resend Broadcasts and records the Broadcast ID back on the issue.
          </p>

          <label className="block mt-6 text-[10px] uppercase tracking-[0.2em] text-gray-500">
            Newsletter admin token
          </label>
          <input
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Enter the Vercel NEWSLETTER_ADMIN_TOKEN"
            className="mt-2 w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-sm outline-none focus:border-white"
          />

          <button
            type="button"
            onClick={loadIssues}
            disabled={loading || !token}
            className="mt-4 rounded-lg bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black disabled:opacity-40"
          >
            {loading ? "Loading…" : "Load Ready Issues"}
          </button>

          {message && (
            <p className="mt-4 text-sm text-gray-400">{message}</p>
          )}
        </div>

        <div className="space-y-4">
          {issues.map((issue) => (
            <article key={issue._id} className="border border-gray-800 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600">Ready</p>
                  <h2 className="mt-2 text-2xl font-serif">{issue.title}</h2>
                  <p className="mt-2 text-gray-400">{issue.subject}</p>
                  {issue.previewText && (
                    <p className="mt-3 text-sm text-gray-500">{issue.previewText}</p>
                  )}
                  <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-gray-600">
                    {issue.featuredCount || 0} featured stories
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => sendIssue(issue._id)}
                  disabled={loading}
                  className="rounded-lg border border-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-white hover:text-black disabled:opacity-40"
                >
                  Send Bombay Brief
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
