export default function AboutPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Top label */}
        <div className="pt-12 md:pt-16">
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
              About
            </span>
            <div className="h-px bg-gray-800 flex-1" />
          </div>
        </div>

        {/* Hero */}
        <section className="py-14 md:py-20 border-b border-gray-800">
          <div className="max-w-5xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gray-500 mb-5">
              Bombay Bureau
            </p>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight">
              Global affairs,
              <br />
              Indian perspective.
            </h1>

            <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-gray-400">
              An independent digital newsroom covering the events,
              ideas, and developments shaping India’s place in the world.
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-14 md:py-20 border-b border-gray-800">
          <div className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-16">
            
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500">
                About the Bureau
              </p>
            </div>

            <div className="max-w-3xl">
              <p className="font-serif text-2xl md:text-3xl leading-[1.35] text-gray-100">
                Bombay Bureau is an independent digital newsroom covering
                global affairs through an Indian perspective.
              </p>

              <p className="mt-7 text-gray-400 leading-relaxed">
                Our reporting focuses on geopolitics, business, technology,
                and policy developments that shape India’s place in the world.
              </p>
            </div>
          </div>
        </section>

        {/* Publication */}
        <section className="py-14 md:py-20 border-b border-gray-800">
          <div className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-16">

            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500">
                The Publication
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 md:gap-16 max-w-4xl">
              <p className="text-base md:text-lg leading-relaxed text-gray-300">
                Founded as a modern digital-first publication, Bombay Bureau
                combines editorial analysis with fast-moving news coverage.
              </p>

              <p className="text-base md:text-lg leading-relaxed text-gray-500">
                The platform aims to deliver clear, concise, and globally
                relevant reporting for readers in India and abroad.
              </p>
            </div>
          </div>
        </section>

        {/* Editorial philosophy */}
        <section className="py-14 md:py-20 border-b border-gray-800">
          <div className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-16">

            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500">
                Editorial Approach
              </p>
            </div>

            <div className="max-w-4xl">
              <blockquote className="font-serif text-2xl md:text-4xl leading-[1.3] text-gray-100">
                “Stories are written with clarity, balance, and long-term
                perspective rather than short-lived viral cycles.”
              </blockquote>

              <p className="mt-7 max-w-3xl text-gray-400 leading-relaxed">
                Our editorial approach is rooted in international awareness
                while maintaining a strong Indian context.
              </p>
            </div>
          </div>
        </section>

        {/* Closing statement */}
        <section className="py-14 md:py-20">
          <div className="max-w-4xl">
            <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500 mb-5">
              Bombay Bureau
            </p>

            <p className="font-serif text-3xl md:text-5xl leading-[1.2] text-gray-100">
              Understanding India in a changing world.
            </p>
          </div>

          {/* Contact */}
          <div className="mt-14 pt-6 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-xs uppercase tracking-[0.25em] text-gray-500">
              Contact
            </span>

            <a
              href="mailto:editor@bombaybureau.com"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              editor@bombaybureau.com
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}