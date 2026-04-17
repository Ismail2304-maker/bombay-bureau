export default function MaintenancePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="text-center max-w-xl">
        <h1 className="text-6xl font-serif mb-6">
          503
        </h1>

        <h2 className="text-2xl font-serif mb-4">
          Bombay Bureau is temporarily unavailable
        </h2>

        <p className="text-gray-400">
          We are currently performing maintenance and improving the platform.
          Please check back shortly.
        </p>

        <p className="text-gray-600 text-sm mt-8">
          — Bombay Bureau Editorial Team
        </p>
      </div>
    </main>
  );
}