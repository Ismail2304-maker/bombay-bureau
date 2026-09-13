export default function AboutPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">

        {/* Header */}
        <div className="flex items-center gap-5 mb-12 md:mb-16">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-gray-500">
            About Bombay Bureau
          </span>

          <div className="h-px bg-gray-800 flex-1" />
        </div>

        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-12 md:gap-24 items-end">
          <div>
            <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.86] tracking-tight">
              Bombay
              <br />
              Bureau
            </h1>
          </div>

          <div className="max-w-xl pb-2">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
              Global affairs, Indian perspective
            </p>

            <p className="font-serif text-2xl md:text-3xl leading-relaxed text-gray-200">
              An independent digital newsroom covering the world
              through an Indian perspective.
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="mt-20 md:mt-28 border-t border-gray-800 pt-12 md:pt-16">
          <div className="max-w-4xl">
            <p className="font-serif text-3xl md:text-5xl leading-[1.25] text-gray-100">
              Bombay Bureau is an independent digital newsroom covering global
              affairs through an Indian perspective.
            </p>

            <p className="text-gray-400 text-base md:text-lg leading-relaxed mt-8 max-w-3xl">
              Our reporting focuses on geopolitics, business, technology, and
              policy developments that shape India’s place in the world.
            </p>
          </div>
        </section>

        {/* The Publication */}
        <section className="mt-20 md:mt-28 border-t border-gray-800 pt-10 md:pt-14">
          <div className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                The Publication
              </p>
            </div>

            <div className="max-w-3xl">
              <p className="text-lg md:text-xl leading-relaxed text-gray-300">
                Founded as a modern digital-first publication, Bombay Bureau
                combines editorial analysis with fast-moving news coverage.
              </p>

              <p className="text-gray-500 leading-relaxed mt-6">
                The platform aims to deliver clear, concise, and globally
                relevant reporting for readers in India and abroad.
              </p>
            </div>
          </div>
        </section>

        {/* Editorial Philosophy */}
        <section className="mt-20 md:mt-28 border-t border-gray-800 pt-10 md:pt-14">
          <div className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                Editorial Approach
              </p>
            </div>

            <div className="max-w-4xl">
              <blockquote className="font-serif text-3xl md:text-5xl leading-[1.25] text-gray-100">
                “International awareness while maintaining a strong Indian
                context.”
              </blockquote>

              <p className="text-gray-400 leading-relaxed mt-8 max-w-3xl">
                Our editorial approach is rooted in international awareness
                while maintaining a strong Indian context. Stories are written
                with clarity, balance, and long-term perspective rather than
                short-lived viral cycles.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-20 md:mt-28 border-t border-gray-800 pt-10 md:pt-14 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
                Contact
              </p>

              <h2 className="font-serif text-4xl md:text-5xl">
                Get in touch.
              </h2>
            </div>

            <a
              href="mailto:editor@bombaybureau.com"
              className="text-gray-400 hover:text-white transition-colors border-b border-gray-700 hover:border-white pb-2"
            >
              editor@bombaybureau.com
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}