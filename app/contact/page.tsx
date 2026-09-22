import Link from "next/link";
import type { Metadata } from "next";
import TipForm from "@/components/TipForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Bombay Bureau for editorial correspondence, corrections, partnerships, and advertising enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-2xl md:text-3xl font-serif tracking-tight">BOMBAY BUREAU</span>
            <span className="text-[10px] md:text-xs tracking-widest text-gray-500 mt-1">
              Global affairs, Indian perspective
            </span>
          </Link>
          <Link href="/" className="text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
            Home
          </Link>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-5">Contact</p>
        <h1 className="text-4xl md:text-6xl font-serif tracking-tight">Contact Bombay Bureau</h1>
        <p className="mt-6 text-lg text-gray-400 leading-relaxed">
          For editorial correspondence, corrections, partnerships, or advertising enquiries, contact the newsroom.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          <div className="border border-gray-800 rounded-xl p-5">
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600">Editorial desk</p>
            <a href="mailto:editor@bombaybureau.com" className="mt-3 inline-block text-lg underline underline-offset-4 hover:text-gray-300">
              editor@bombaybureau.com
            </a>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              For editorial correspondence, corrections, and questions about published work.
            </p>
          </div>
          <div className="border border-gray-800 rounded-xl p-5">
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600">News tips</p>
            <Link href="/tips" className="mt-3 inline-block text-lg underline underline-offset-4 hover:text-gray-300">
              Send a tip →
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Share a lead, development, or story idea with the newsroom.
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-800 pt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">The Bombay Brief</p>
          <h2 className="font-serif text-3xl md:text-4xl">Stay connected to the newsroom.</h2>
          <p className="mt-4 text-gray-400 leading-relaxed">
            Join our newsletter list for important stories and context from India and the world.
          </p>
          <Link href="/newsletter" className="inline-block mt-6 text-sm text-white underline underline-offset-4">
            Join The Bombay Brief →
          </Link>
        </div>

        <div className="mt-16 border-t border-gray-800 pt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Important</p>
          <p className="text-sm text-gray-500 leading-relaxed">
            The current tip form is a standard web submission method, not a secure anonymous-source system.
            Do not send passwords, financial information, or highly confidential source material through it.
          </p>
        </div>
      </section>
    </main>
  );
}
