export default function AIPolicyPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Bombay Bureau</p>
        <h1 className="mt-5 font-serif text-5xl md:text-7xl leading-none">AI &amp; Technology Policy</h1>
        <p className="mt-8 max-w-3xl text-lg text-gray-400 leading-relaxed">
          Bombay Bureau uses modern technology to support its newsroom while keeping
          editorial responsibility with a human editor.
        </p>

        <div className="mt-16 space-y-12">
          <section>
            <h2 className="font-serif text-2xl md:text-3xl">How we use AI</h2>
            <p className="mt-4 max-w-3xl text-gray-400 leading-relaxed">
              AI tools may be used for research assistance, organization, drafting,
              translation, summarization, data processing, transcription, and other
              production tasks. The specific tools used may change as the newsroom evolves.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl md:text-3xl">Human editorial responsibility</h2>
            <p className="mt-4 max-w-3xl text-gray-400 leading-relaxed">
              AI systems are not independent authors or sources for Bombay Bureau.
              AI-assisted material is reviewed before publication, and the editor remains
              responsible for the accuracy, framing, and final publication of newsroom content.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl md:text-3xl">Transparency</h2>
            <p className="mt-4 max-w-3xl text-gray-400 leading-relaxed">
              We do not present an AI system as a human reporter. Where AI involvement is
              materially relevant to understanding a piece of content, Bombay Bureau may
              provide additional disclosure or context.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl md:text-3xl">Why we use it</h2>
            <p className="mt-4 max-w-3xl text-gray-400 leading-relaxed">
              We use AI to improve research and production efficiency, accessibility,
              and the reader experience — not to replace editorial accountability.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
