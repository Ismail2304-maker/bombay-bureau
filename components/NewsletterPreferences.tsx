"use client";

import {useEffect, useState} from "react";
import {onAuthStateChanged, User} from "firebase/auth";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {auth, db} from "@/lib/firebase";

const TOPICS = ["India", "World", "Politics", "Business", "Technology", "Sports", "Culture", "Opinion", "Explainers"];

type Preferences = {newsletterEnabled: boolean; topics: string[]};

const defaults: Preferences = {newsletterEnabled: true, topics: ["India", "World", "Politics", "Business", "Technology"]};

export default function NewsletterPreferences() {
  const [user, setUser] = useState<User | null>(null);
  const [prefs, setPrefs] = useState<Preferences>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, async (current) => {
      setUser(current);
      if (!current) {
        setLoading(false);
        return;
      }
      try {
        const snapshot = await getDoc(doc(db, "readerProfiles", current.uid));
        const stored = snapshot.data()?.newsletter;
        if (stored) setPrefs({
          newsletterEnabled: stored.newsletterEnabled !== false,
          topics: Array.isArray(stored.topics) ? stored.topics : defaults.topics,
        });
      } catch {
        setMessage("We couldn't load your preferences yet.");
      } finally {
        setLoading(false);
      }
    });
  }, []);

  async function save() {
    if (!user) return;
    setSaving(true);
    setMessage("");
    try {
      await setDoc(doc(db, "readerProfiles", user.uid), {
        newsletter: {
          newsletterEnabled: prefs.newsletterEnabled,
          topics: prefs.topics,
          updatedAt: new Date().toISOString(),
        },
      }, {merge: true});
      setMessage("Preferences saved.");
    } catch {
      setMessage("We couldn't save your preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Loading preferences…</p>;
  if (!user) return <p className="text-sm text-gray-500">Sign in to manage your newsletter preferences.</p>;

  function toggleTopic(topic: string) {
    setPrefs((current) => ({
      ...current,
      topics: current.topics.includes(topic)
        ? current.topics.filter((item) => item !== topic)
        : [...current.topics, topic],
    }));
  }

  return (
    <div className="mt-8 border border-gray-800 rounded-2xl p-5 md:p-7">
      <div className="flex items-center justify-between gap-5">
        <div>
          <h2 className="font-serif text-2xl">Newsletter preferences</h2>
          <p className="mt-2 text-sm text-gray-500">Choose the subjects you want The Bombay Brief to emphasize.</p>
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-400">
          <input type="checkbox" checked={prefs.newsletterEnabled} onChange={(e) => setPrefs({...prefs, newsletterEnabled: e.target.checked})} className="accent-white" />
          Receive newsletter
        </label>
      </div>
      <div className="flex flex-wrap gap-2 mt-6">
        {TOPICS.map((topic) => (
          <button key={topic} type="button" onClick={() => toggleTopic(topic)} aria-pressed={prefs.topics.includes(topic)}
            className={`rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.12em] transition ${prefs.topics.includes(topic) ? "border-white text-white" : "border-gray-800 text-gray-600"}`}>
            {topic}
          </button>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button type="button" onClick={save} disabled={saving} className="rounded-md border border-white px-4 py-2 text-xs uppercase tracking-[0.16em] hover:bg-white hover:text-black disabled:opacity-50">
          {saving ? "Saving…" : "Save preferences"}
        </button>
        <p aria-live="polite" className="text-xs text-gray-500">{message}</p>
      </div>
    </div>
  );
}
