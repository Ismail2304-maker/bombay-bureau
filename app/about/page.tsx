export default function AboutPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">

        {/* Editorial label */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-gray-500">
            About
          </span>
          <div className="h-px bg-gray-800 flex-1" />
        </div>

        {/* Hero */}
        <section className="grid md:grid-cols-[1.15fr_0.85fr] gap-10 md:gap-20 items-end">
          <div>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl leading-[0.9] tracking-tight">
              Bombay
              <br />
              Bureau
            </h1>
          </div>

          <div className="md:pb-2">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-5">
              Global affairs, Indian perspective
            </p>

            <p className="text-xl md:text-2xl font-serif leading-relaxed text-gray-200">
              An independent digital newsroom looking at India,
              the world, and the forces connecting them.
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-16 md:mt-24" />

        {/* Mission */}
        <section className="grid md:grid-cols-[180px_1fr] gap-8 md:gap-16 py-12 md:py-16">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-gray-500">
              01
            </span>
            <h2 className="text-sm tracking-widest uppercase mt-2 text-gray-300">
              Our Mission
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="font-serif text-2xl md:text-4xl leading-relaxed text-gray-100">
              Bombay Bureau is an independent digital newsroom covering global
              affairs through an Indian perspective.
            </p>

            <p className="text-gray-400 leading-relaxed mt-8 max-w-2xl">
              Our reporting focuses on geopolitics, business, technology, and
              policy developments that shape India’s place in the world.
            </p>
          </div>
        </section>

        <div className="border-t border-gray-800" />

        {/* Publication */}
        <section className="grid md:grid-cols-[180px_1fr] gap-8 md:gap-16 py-12 md:py-16">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-gray-500">
              02
            </span>
            <h2 className="text-sm tracking-widest uppercase mt-2 text-gray-300">
              The Publication
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
              Founded as a modern digital-first publication, Bombay Bureau
              combines editorial analysis with fast-moving news coverage.
            </p>

            <p className="text-gray-400 leading-relaxed mt-6">
              The platform aims to deliver clear, concise, and globally
              relevant reporting for readers in India and abroad.
            </p>
          </div>
        </section>

        <div className="border-t border-gray-800" />

        {/* Coverage */}
        <section className="py-12 md:py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-gray-500">
                03
              </span>
              <h2 className="text-sm tracking-widest uppercase mt-2 text-gray-300">
                What We Cover
              </h2>
            </div>

            <span className="hidden md:block text-xs text-gray-600">
              INDIA / WORLD / BEYOND
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 border-t border-l border-gray-800">
            {[
              "India",
              "World",
              "Politics",
              "Business",
              "Technology",
            ].map((item) => (
              <div
                key={item}
                className="border-r border-b border-gray-800 px-5 py-8 md:py-10"
              >
                <span className="font-serif text-2xl md:text-3xl">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-800" />

        {/* Editorial approach */}
        <section className="grid md:grid-cols-[180px_1fr] gap-8 md:gap-16 py-12 md:py-16">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-gray-500">
              04
            </span>
            <h2 className="text-sm tracking-widest uppercase mt-2 text-gray-300">
              Our Approach
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="font-serif text-2xl md:text-4xl leading-relaxed text-gray-100">
              International awareness. Strong Indian context.
            </p>

            <p className="text-gray-400 leading-relaxed mt-8">
              Our editorial approach is rooted in international awareness while
              maintaining a strong Indian context. Stories are written with
              clarity, balance, and long-term perspective rather than
              short-lived viral cycles.
            </p>
          </div>
        </section>

        <div className="border-t border-gray-800" />

        {/* Contact */}
        <section className="py-12 md:py-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-gray-500">
              Contact
            </span>

            <h2 className="font-serif text-3xl md:text-5xl mt-3">
              Get in touch.
            </h2>
          </div>

          <a
            href="mailto:editor@bombaybureau.com"
            className="text-gray-400 hover:text-white transition-colors border-b border-gray-700 hover:border-white pb-2 text-sm md:text-base"
          >
            editor@bombaybureau.com
          </a>
        </section>

      </div>
    </main>
  );
}