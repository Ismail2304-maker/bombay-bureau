export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-white">
      <h1 className="text-4xl font-serif mb-8">Privacy Policy</h1>

      <p className="text-gray-300 mb-6">
        Bombay Bureau respects your privacy. We collect minimal data necessary to
        provide authentication and improve the reading experience.
      </p>

      <p className="text-gray-300 mb-6">
        We do not sell personal data to third parties. Authentication may be
        handled through secure providers such as Google.
      </p>

      <p className="text-gray-300 mb-6">
        By using this site, you consent to basic analytics and authentication
        storage required for functionality.
      </p>

      <p className="text-gray-500 mt-10 text-sm">
        Last updated: {new Date().getFullYear()}
      </p>
    </main>
  );
}