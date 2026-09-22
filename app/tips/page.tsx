import type { Metadata } from "next";
import Link from "next/link";
import TipForm from "@/components/TipForm";

export const metadata: Metadata = {
  title: "Send a Tip",
  description: "Send a news tip or lead to the BOMBAY BUREAU newsroom.",
  alternates: { canonical: "/tips" },
};

export default function TipsPage() {
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
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-5">Newsroom</p>
        <h1 className="font-serif text-5xl md:text-7xl tracking-tight leading-none">Send a Tip</h1>
        <p className="mt-7 text-lg text-gray-400 leading-relaxed">Have a lead, document, development, or story idea the newsroom should know about? Send it to BOMBAY BUREAU. You can leave your name and email blank.</p>
        <TipForm />
        <div className="mt-10 border-t border-gray-800 pt-7 text-sm text-gray-500 leading-relaxed">
          <p>This is a standard web form, not a secure anonymous-source system. For sensitive source material, wait until the newsroom provides an appropriate secure submission method.</p>
        </div>
      </section>
    </main>
  );
}
