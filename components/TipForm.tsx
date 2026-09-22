"use client";

import { FormEvent, useState } from "react";

export default function TipForm() {
  const [form, setForm] = useState({ name: "", email: "", articleUrl: "", message: "", website: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMessage, setResponseMessage] = useState("");

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setResponseMessage("");

    try {
      const response = await fetch("/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");

      setStatus("success");
      setResponseMessage("Thanks. Your tip has been sent to the newsroom.");
      setForm({ name: "", email: "", articleUrl: "", message: "", website: "" });
    } catch (error) {
      setStatus("error");
      setResponseMessage(error instanceof Error ? error.message : "Please try again.");
    }
  }

  return (
    <form onSubmit={submit} className="mt-10 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.16em] text-gray-500">Name <span className="normal-case tracking-normal">(optional)</span></span>
          <input value={form.name} onChange={(event) => update("name", event.target.value)} className="mt-2 w-full rounded-md border border-gray-800 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-gray-500" />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.16em] text-gray-500">Email <span className="normal-case tracking-normal">(optional)</span></span>
          <input type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} className="mt-2 w-full rounded-md border border-gray-800 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-gray-500" />
        </label>
      </div>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-gray-500">Related article URL <span className="normal-case tracking-normal">(optional)</span></span>
        <input type="url" value={form.articleUrl} onChange={(event) => update("articleUrl", event.target.value)} placeholder="https://bombay-bureau.vercel.app/article/..." className="mt-2 w-full rounded-md border border-gray-800 bg-transparent px-4 py-3 text-sm text-white placeholder:text-gray-700 outline-none focus:border-gray-500" />
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-gray-500">Tip</span>
        <textarea required minLength={20} rows={7} value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Tell the newsroom what you know and why it matters." className="mt-2 w-full rounded-md border border-gray-800 bg-transparent px-4 py-3 text-sm text-white placeholder:text-gray-700 outline-none focus:border-gray-500 resize-y" />
      </label>

      <input aria-hidden="true" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} className="hidden" />

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button type="submit" disabled={status === "loading"} className="rounded-md border border-white px-5 py-3 text-xs uppercase tracking-[0.18em] text-white hover:bg-white hover:text-black transition disabled:opacity-50">
          {status === "loading" ? "Sending..." : "Send Tip"}
        </button>
        <p aria-live="polite" className={`text-xs leading-relaxed ${status === "error" ? "text-red-400" : "text-gray-500"}`}>
          {responseMessage || "For ordinary newsroom tips only. Do not send passwords, financial information, or highly confidential material through this form."}
        </p>
      </div>
    </form>
  );
}
