export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-white">
      <h1 className="text-4xl font-serif mb-8">Terms of Use</h1>

      <p className="text-gray-300 mb-6">
        Welcome to Bombay Bureau. By accessing this website, you agree to use the
        platform responsibly and in accordance with applicable laws.
      </p>

      <p className="text-gray-300 mb-6">
        All content published on Bombay Bureau is for informational and editorial
        purposes. While we strive for accuracy, we do not guarantee that all
        information is complete or current at all times.
      </p>

      <p className="text-gray-300 mb-6">
        Users may not reproduce or redistribute content without permission. We
        reserve the right to update these terms as the platform evolves.
      </p>

      <p className="text-gray-500 mt-10 text-sm">
        Last updated: {new Date().getFullYear()}
      </p>
    </main>
  );
}