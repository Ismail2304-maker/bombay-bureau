import type { Metadata } from "next";
import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";
import NewsletterPreferences from "@/components/NewsletterPreferences";

export const metadata: Metadata = {
  title: "The Bombay Brief",
  description: "Join The Bombay Brief from BOMBAY BUREAU for important stories and context from India and the world.",
  alternates: { canonical: "/newsletter" },
};

export default function NewsletterPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-2xl md:text-3xl font-serif tracking-tight">BOMBAY BUREAU</span>
            <span className="text-[10px] md:text-xs tracking-widest text-gray-500 mt-1">Global affairs, Indian perspective</span>
          </Link>
          <Link href="/" className="text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Home</Link>
        </div>
      </header>
      <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-5">Newsletter</p>
        <h1 className="font-serif text-5xl md:text-7xl tracking-tight leading-none">The Bombay Brief</h1>
        <p className="mt-7 text-lg md:text-xl text-gray-400 leading-relaxed">India and the world, explained clearly. Get the most important stories, context, and original reporting from BOMBAY BUREAU.</p>
        <NewsletterSignup />
        <NewsletterPreferences />
        <p className="mt-8 text-xs text-gray-600 leading-relaxed">Newsletter delivery is handled through our email delivery provider. You can manage your reading preferences from your signed-in reader account.</p>
      </section>
    </main>
  );
}
