import Header from "@/components/Header";
import MarketSnapshot from "@/components/MarketSnapshot";

export default function MarketsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-16">

        <div className="border-b border-gray-800 pb-8 mb-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2">
            Bombay Bureau
          </p>

          <h1 className="font-serif text-4xl md:text-6xl">
            Markets
          </h1>

          <p className="text-gray-500 mt-3 max-w-xl">
            Indian market movements, trading activity and financial developments.
          </p>
        </div>

      </div>

      <MarketSnapshot />
    </main>
  );
}