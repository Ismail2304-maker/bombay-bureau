import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Bombay Bureau for editorial correspondence, corrections, partnerships, and advertising enquiries.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-2xl md:text-3xl font-serif tracking-tight">
              BOMBAY BUREAU
            </span>
            <span className="text-[10px] md:text-xs tracking-widest text-gray-500 mt-1">
              Global affairs, Indian perspective
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
          >
            Home
          </Link>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-5">
          Contact
        </p>

        <h1 className="text-4xl md:text-6xl font-serif tracking-tight">
          Contact Bombay Bureau
        </h1>

        <p className="mt-6 text-lg text-gray-400 leading-relaxed">
          For editorial correspondence, corrections, story enquiries,
          partnerships, or advertising enquiries, please contact the newsroom.
        </p>

        <div className="mt-10 border-t border-gray-800 pt-8">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">
            Editorial desk
          </p>
          <a
            href="mailto:editor@bombaybureau.com"
            className="text-xl md:text-2xl underline underline-offset-4 hover:text-gray-300"
          >
            editor@bombaybureau.com
          </a>
        </div>
      </section>
    </main>
  );
}
