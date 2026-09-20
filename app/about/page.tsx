import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Bombay Bureau is an independent, independent digital newsroom covering India and the world through an Indian perspective.",
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
            Bombay Bureau is an independent, founder-led digital newsroom covering
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
                Bombay Bureau currently operates as a founder-led newsroom. Editorial
                responsibility rests with the editor and publisher, including review
                of AI-assisted work before publication.
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 border-b border-gray-800">
          <div className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-16">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500">Editorial Standards</p>
            </div>
            <div className="max-w-3xl">
              <p className="font-serif text-2xl md:text-3xl leading-[1.35] text-gray-100">
                Accuracy, attribution, transparency, and accountability come before speed.
              </p>
              <p className="mt-7 text-gray-400 leading-relaxed">
                News reporting is kept distinct from opinion and explanatory content.
                Material claims are reviewed before publication, sources are attributed
                where appropriate, and significant errors are corrected transparently.
              </p>
              <a href="/editorial-standards" className="inline-block mt-7 text-sm text-white underline underline-offset-4">
                Read our Editorial Standards →
              </a>
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
                A one-person newsroom, with one clear editorial responsibility.
              </p>
              <p className="mt-7 text-gray-400 leading-relaxed">
                Bombay Bureau is led editorially by Rayan Khan, who serves as editor.
                The newsroom may use technology and AI tools to support research and
                production, but editorial responsibility remains human.
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
