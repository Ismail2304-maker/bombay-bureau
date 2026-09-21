import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies & Analytics",
  description: "How Bombay Bureau uses browser storage, cookies and analytics technologies.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Bombay Bureau</p>
        <h1 className="mt-5 text-5xl md:text-7xl font-serif leading-none">Cookies &amp; Analytics</h1>
        <p className="mt-8 max-w-3xl text-lg text-gray-400 leading-relaxed">
          Bombay Bureau uses limited browser storage and analytics technologies to operate
          reader features and understand how the site is used.
        </p>

        <div className="mt-16 space-y-12">
          <section>
            <h2 className="font-serif text-2xl md:text-3xl">Reader preferences</h2>
            <p className="mt-4 max-w-3xl text-gray-400 leading-relaxed">
              Features such as saved stories may use browser local storage on your device.
              This information is stored locally in your browser and is used to provide the
              feature you requested.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl md:text-3xl">Analytics</h2>
            <p className="mt-4 max-w-3xl text-gray-400 leading-relaxed">
              Bombay Bureau uses Google Analytics to understand aggregate site usage,
              including which pages are visited and how readers interact with the publication.
              Analytics configuration may change as the site evolves.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl md:text-3xl">Authentication</h2>
            <p className="mt-4 max-w-3xl text-gray-400 leading-relaxed">
              If you use account features, authentication providers such as Google may
              store information required to maintain your signed-in session. See the
              Privacy Policy for the broader data practices.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl md:text-3xl">Your choices</h2>
            <p className="mt-4 max-w-3xl text-gray-400 leading-relaxed">
              You can control or clear browser storage through your browser settings.
              Blocking some storage or analytics technologies may affect certain site
              features.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
