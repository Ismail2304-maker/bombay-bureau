export default function AboutPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-20">

        <h1 className="text-4xl md:text-5xl font-serif mb-10">
          About Bombay Bureau
        </h1>

        <p className="text-gray-300 mb-6 leading-relaxed">
          Bombay Bureau is an independent digital newsroom covering global
          affairs through an Indian perspective. Our reporting focuses on
          geopolitics, business, technology, and policy developments that shape
          India’s place in the world.
        </p>

        <p className="text-gray-300 mb-6 leading-relaxed">
          Founded as a modern digital-first publication, Bombay Bureau combines
          editorial analysis with fast-moving news coverage. The platform aims
          to deliver clear, concise, and globally relevant reporting for readers
          in India and abroad.
        </p>

        <p className="text-gray-300 mb-6 leading-relaxed">
          Our editorial approach is rooted in international awareness while
          maintaining a strong Indian context. Stories are written with clarity,
          balance, and long-term perspective rather than short-lived viral
          cycles.
        </p>

        <div className="border-t border-gray-800 mt-12 pt-6 text-sm text-gray-500">
          Contact: editor@bombaybureau.com  
        </div>

      </div>
    </main>
  );
}