import Link from "next/link";

export default function NotFound(){
  return <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
    <section className="max-w-xl text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-gray-500">BOMBAY BUREAU</p>
      <h1 className="mt-5 text-6xl md:text-8xl font-serif">404</h1>
      <h2 className="mt-4 text-2xl md:text-3xl font-serif">This page could not be found.</h2>
      <p className="mt-4 text-gray-500 leading-relaxed">The story or page may have moved, been removed, or never existed.</p>
      <div className="mt-8 flex items-center justify-center gap-4">
        <Link href="/" className="px-5 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors">Back to homepage</Link>
        <Link href="/contact" className="px-5 py-3 rounded-full border border-gray-700 text-sm text-gray-300 hover:border-gray-500 hover:text-white transition-colors">Contact</Link>
      </div>
    </section>
  </main>;
}
