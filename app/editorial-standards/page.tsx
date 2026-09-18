export default function EditorialStandardsPage() {
  const standards = [
    ["Accuracy", "We aim to publish information that is accurate and supported by reliable evidence. Material factual claims are reviewed before publication."],
    ["Attribution", "We identify the source of important information where appropriate and distinguish direct reporting from information obtained from other publications, public records, officials, companies, or other sources."],
    ["News, Opinion & Explainers", "News reporting, opinion, and explanatory journalism are clearly identified and kept distinct so readers can understand what they are reading."],
    ["Headlines", "Headlines are written to accurately represent the article and should not deliberately mislead readers about its contents."],
    ["Updates", "Articles may be updated when new information becomes available. Significant changes should be reflected through an updated timestamp or editorial note where appropriate."],
    ["Conflicts of Interest", "Relevant conflicts should be disclosed and should not be allowed to compromise editorial judgment."],
    ["Sources", "We seek primary and authoritative sources where practical, particularly for consequential claims. Anonymous sourcing, when used, should have an editorial justification."],
    ["Reader Trust", "Readers should be able to understand who publishes Bombay Bureau, how to contact the newsroom, and how corrections are handled."],
  ];

  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Bombay Bureau</p>
        <h1 className="mt-5 font-serif text-5xl md:text-7xl leading-none">Editorial Standards</h1>
        <p className="mt-8 max-w-3xl text-lg text-gray-400 leading-relaxed">
          The principles that guide how Bombay Bureau reports, edits, publishes, updates,
          and corrects its journalism.
        </p>

        <div className="mt-16 border-t border-gray-800">
          {standards.map(([title, body]) => (
            <section key={title} className="grid md:grid-cols-[220px_1fr] gap-6 md:gap-12 py-10 border-b border-gray-800">
              <h2 className="text-xs uppercase tracking-[0.25em] text-gray-500">{title}</h2>
              <p className="max-w-3xl text-gray-300 leading-relaxed">{body}</p>
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm text-gray-600">
          These standards may evolve as Bombay Bureau grows and develops its newsroom.
        </p>
      </div>
    </main>
  );
}
