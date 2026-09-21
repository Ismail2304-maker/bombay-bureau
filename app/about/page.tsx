import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Bombay Bureau is an independent digital newsroom covering India and the world through an Indian perspective.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="pt-12 md:pt-16">
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">About</span>
            <div className="h-px bg-gray-800 flex-1" />
          </div>
        </div>

        <section className="py-14 md:py-20 border-b border-gray-800">
          <p className="text-xs uppercase tracking-[0.28em] text-gray-500 mb-5">Bombay Bureau</p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight">
            Global affairs,
            <br />
            Indian perspective.
          </h1>
          <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-gray-400">
            Bombay Bureau is an independent digital newsroom covering
            the events, ideas, and developments shaping India&apos;s place in the world.
          </p>
        </section>

        <section className="py-14 md:py-20 border-b border-gray-800">
          <div className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-16">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500">Our Mission</p>
            </div>
            <div className="max-w-3xl">
              <p className="font-serif text-2xl md:text-3xl leading-[1.35] text-gray-100">
                To explain the world through an Indian lens — clearly, responsibly,
                and with context.
              </p>
              <p className="mt-7 text-gray-400 leading-relaxed">
                Our coverage spans geopolitics, India, politics, business, technology,
                opinion, explainers, and video. We aim to give readers
                concise reporting and useful context rather than simply adding to
                the speed and volume of the news cycle.
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 border-b border-gray-800">
          <div className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-16">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500">Ownership &amp; Publisher</p>
            </div>
            <div className="max-w-3xl">
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-600">Owner</p>
                  <p className="mt-2 text-lg text-gray-200">Muhammed Ismail</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-600">Publisher</p>
                  <p className="mt-2 text-lg text-gray-200">Muhammed Ismail</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-600">Editor</p>
                  <p className="mt-2 text-lg text-gray-200">Rayan Khan</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-600">Based in</p>
                  <p className="mt-2 text-lg text-gray-200">India</p>
                </div>
              </div>
              <p className="mt-8 text-gray-400 leading-relaxed">
                Bombay Bureau is editorially led by Rayan Khan. The publisher oversees
                the publication as owner and publisher, while editorial decisions and
                review of published journalism are led by the editor.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                <div className="border border-gray-800 rounded-xl p-5">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600">Editorial leadership</p>
                  <p className="mt-2 font-serif text-xl text-white">Rayan Khan</p>
                  <p className="mt-1 text-sm text-gray-500">Editor</p>
                  <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                    Responsible for editorial review, corrections, and publication decisions.
                  </p>
                  <Link href="/newsroom#editorial-leadership" className="inline-block mt-4 text-xs text-white underline underline-offset-4">
                    Editorial profile →
                  </Link>
                </div>
                <div className="border border-gray-800 rounded-xl p-5">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600">Ownership &amp; publishing</p>
                  <p className="mt-2 font-serif text-xl text-white">Muhammed Ismail</p>
                  <p className="mt-1 text-sm text-gray-500">Owner &amp; Publisher</p>
                  <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                    Oversees ownership and publishing functions, separate from day-to-day editorial responsibility.
                  </p>
                  <Link href="/author/muhammed-ismail" className="inline-block mt-4 text-xs text-white underline underline-offset-4">
                    Author profile →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 border-b border-gray-800">
          <div className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-16">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500">Independence</p>
            </div>
            <div className="max-w-3xl">
              <p className="font-serif text-2xl md:text-3xl leading-[1.35] text-gray-100">
                Editorial judgment is kept separate from ownership and publishing functions.
              </p>
              <p className="mt-7 text-gray-400 leading-relaxed">
                Bombay Bureau describes itself as an independent digital newsroom. Ownership
                and publishing are disclosed openly, while editorial responsibility rests with
                the editor. Readers can contact the newsroom directly with corrections,
                concerns, or questions about published work.
              </p>
              <p className="mt-7 text-gray-400 leading-relaxed">
                News reporting is kept distinct from opinion and explanatory content.
                Material claims are reviewed before publication, sources are attributed
                where appropriate, and significant errors are corrected transparently.
              </p>
              <Link href="/editorial-standards" className="inline-block mt-7 text-sm text-white underline underline-offset-4">
                Read our Editorial Standards →
              </Link>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 border-b border-gray-800">
          <div className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-16">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500">Our Team</p>
            </div>
            <div className="max-w-3xl">
              <p className="font-serif text-2xl md:text-3xl leading-[1.35] text-gray-100">
                Clear editorial leadership, with one clear editorial responsibility.
              </p>
              <p className="mt-7 text-gray-400 leading-relaxed">
                Rayan Khan serves as editor and leads the publication&apos;s editorial work.
                The newsroom may use technology and AI tools to support research and
                production, but editorial responsibility remains with the editor.
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 border-b border-gray-800">
          <div className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-16">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500">AI &amp; Technology Policy</p>
            </div>
            <div className="max-w-3xl">
              <p className="font-serif text-2xl md:text-3xl leading-[1.35] text-gray-100">
                We use AI as a tool, not as a substitute for editorial responsibility.
              </p>
              <p className="mt-7 text-gray-400 leading-relaxed">
                AI may assist Bombay Bureau with research, organization, drafting,
                translation, summarization, data processing, and other production
                tasks. AI-generated or AI-assisted material is reviewed before
                publication. AI systems are not treated as independent authors or
                sources, and the newsroom remains responsible for published work.
              </p>
              <a href="/ai-policy" className="inline-block mt-7 text-sm text-white underline underline-offset-4">
                Read our AI &amp; Technology Policy →
              </a>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 border-b border-gray-800">
          <div className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-16">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500">Corrections</p>
            </div>
            <div className="max-w-3xl">
              <p className="font-serif text-2xl md:text-3xl leading-[1.35] text-gray-100">
                When we get something materially wrong, we correct it.
              </p>
              <p className="mt-7 text-gray-400 leading-relaxed">
                Corrections are handled by the editor. Significant factual corrections
                are identified transparently, while routine updates may be reflected
                through the article&apos;s updated timestamp.
              </p>
              <a href="/corrections" className="inline-block mt-7 text-sm text-white underline underline-offset-4">
                Read our Corrections Policy →
              </a>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="max-w-4xl">
            <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500 mb-5">Contact the Newsroom</p>
            <p className="font-serif text-3xl md:text-5xl leading-[1.2] text-gray-100">
              Have a correction, news tip, or editorial question?
            </p>
            <p className="mt-7 max-w-2xl text-gray-400 leading-relaxed">
              Contact the newsroom directly. For corrections or important factual
              concerns, please include the article URL and explain the issue clearly.
            </p>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Editorial Contact</span>
            <a href="mailto:editor@bombaybureau.com" className="text-sm text-gray-400 hover:text-white transition-colors">
              editor@bombaybureau.com
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
