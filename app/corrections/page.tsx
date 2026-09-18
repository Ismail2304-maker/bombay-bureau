export default function CorrectionsPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Bombay Bureau</p>
        <h1 className="mt-5 font-serif text-5xl md:text-7xl leading-none">Corrections Policy</h1>
        <p className="mt-8 max-w-3xl text-lg text-gray-400 leading-relaxed">
          Accuracy is a continuing responsibility. When Bombay Bureau identifies a
          material factual error, we seek to correct it promptly and transparently.
        </p>

        <div className="mt-16 space-y-12">
          <section>
            <h2 className="font-serif text-2xl md:text-3xl">How corrections work</h2>
            <p className="mt-4 max-w-3xl text-gray-400 leading-relaxed">
              The editor reviews reported errors and determines the appropriate correction.
              Significant factual corrections may be accompanied by a clear editor&apos;s note.
              Routine updates that add new information may be reflected through an updated
              timestamp or update note.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl md:text-3xl">How to report an error</h2>
            <p className="mt-4 max-w-3xl text-gray-400 leading-relaxed">
              Readers can report a suspected factual error by emailing
              <a href="mailto:editor@bombaybureau.com" className="text-white underline underline-offset-4 ml-1">
                editor@bombaybureau.com
              </a>.
              Please include the article URL, the specific statement in question, and
              supporting information when available.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl md:text-3xl">Editorial responsibility</h2>
            <p className="mt-4 max-w-3xl text-gray-400 leading-relaxed">
              AI tools may assist with parts of the production workflow, but corrections
              and final editorial responsibility remain with Bombay Bureau&apos;s editor.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
