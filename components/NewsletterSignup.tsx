"use client";

import { FormEvent, useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");

      setStatus("success");
      setMessage("You're on the list. You'll receive the next edition of The Bombay Brief in your inbox.");
      setEmail("");
      setWebsite("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mt-20 md:mt-24">
      <div className="border-y border-gray-800 py-10 md:py-14">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 md:gap-16 items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500 mb-4">The Bombay Brief</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white leading-tight">
              India and the world, explained clearly.
            </h2>
            <p className="mt-4 max-w-xl text-sm md:text-base text-gray-400 leading-relaxed">
              Join the BOMBAY BUREAU newsletter for important stories, context, and original reporting from the newsroom.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              className="w-full rounded-md border border-gray-700 bg-transparent px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-gray-400"
            />
            <input
              aria-hidden="true"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              className="hidden"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full md:w-auto rounded-md border border-white px-5 py-3 text-xs uppercase tracking-[0.18em] text-white hover:bg-white hover:text-black transition disabled:opacity-50"
            >
              {status === "loading" ? "Joining..." : "Join the Brief"}
            </button>
            <p aria-live="polite" className={`text-xs leading-relaxed ${status === "error" ? "text-red-400" : "text-gray-500"}`}>
              {message || "No spam. Unsubscribe anytime from a Bombay Brief email."}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
