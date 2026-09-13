"use client";

import { useEffect, useState } from "react";

type Stock = {
  ticker_id?: string;
  company_name?: string;
  price?: number | string;
  percent_change?: number;
  net_change?: number;
  exchange_type?: string;
};

type MarketData = {
  trending_stocks?: {
    top_gainers?: Stock[];
    top_losers?: Stock[];
  };
};

export default function MarketSnapshot() {
  const [data, setData] = useState<MarketData | null>(null);
  const [activeTab, setActiveTab] = useState<"gainers" | "losers">("gainers");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadMarkets() {
      try {
        const response = await fetch("/api/markets", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Market request failed");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Market Snapshot error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadMarkets();
  }, []);

  const stocks =
    activeTab === "gainers"
      ? data?.trending_stocks?.top_gainers || []
      : data?.trending_stocks?.top_losers || [];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mt-12 md:mt-16">
      {/* HEADER */}
      <div className="border-t border-gray-800 pt-4 mb-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600 mb-1">
              Markets
            </p>

            <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-white">
              Market Snapshot
            </h2>
          </div>

          <span className="hidden sm:block text-[9px] uppercase tracking-[0.18em] text-gray-600">
            NSE • BSE
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="border border-gray-800 bg-[#050505]">
        {/* TABS */}
        <div className="flex items-center border-b border-gray-800">
          <button
            onClick={() => setActiveTab("gainers")}
            className={`px-5 md:px-6 py-3 text-[10px] uppercase tracking-[0.16em] transition ${
              activeTab === "gainers"
                ? "text-white bg-gray-900"
                : "text-gray-600 hover:text-gray-300"
            }`}
          >
            Gainers
          </button>

          <button
            onClick={() => setActiveTab("losers")}
            className={`px-5 md:px-6 py-3 text-[10px] uppercase tracking-[0.16em] transition ${
              activeTab === "losers"
                ? "text-white bg-gray-900"
                : "text-gray-600 hover:text-gray-300"
            }`}
          >
            Losers
          </button>

          <div className="ml-auto px-4 md:px-6 text-[9px] uppercase tracking-[0.15em] text-gray-700">
            Top Movers
          </div>
        </div>

        {/* STOCKS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {loading &&
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="border-b md:border-b-0 md:border-r border-gray-800 p-5 animate-pulse"
              >
                <div className="h-3 w-24 bg-gray-900 rounded mb-5" />
                <div className="h-5 w-32 bg-gray-900 rounded mb-3" />
                <div className="h-3 w-20 bg-gray-900 rounded" />
              </div>
            ))}

          {!loading &&
            !error &&
            stocks.length > 0 &&
            stocks.slice(0, 5).map((stock, index) => {
              const change = Number(stock.percent_change || 0);
              const positive = change >= 0;

              return (
                <div
                  key={`${stock.ticker_id || stock.company_name}-${index}`}
                  className="border-b md:border-b-0 md:border-r border-gray-800 last:border-r-0 p-5 hover:bg-gray-950 transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-serif text-gray-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-[9px] uppercase tracking-[0.12em] text-gray-700">
                      {stock.exchange_type || "NSE"}
                    </span>
                  </div>

                  <h3 className="font-serif text-base md:text-lg text-gray-200 leading-snug line-clamp-2 min-h-[48px]">
                    {stock.company_name || stock.ticker_id || "Unknown"}
                  </h3>

                  <div className="flex items-end justify-between gap-3 mt-5">
                    <div>
                      <p className="text-sm text-white">
                        ₹
                        {stock.price !== undefined && stock.price !== null
  ? Number(stock.price).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  : "—"}
                      </p>

                      <p className="text-[9px] uppercase tracking-[0.12em] text-gray-700 mt-1">
                        {stock.ticker_id || ""}
                      </p>
                    </div>

                    <div
                      className={`text-right ${
                        positive ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      <p className="text-sm font-medium">
                        {positive ? "+" : ""}
                        {change.toFixed(2)}%
                      </p>

                      {typeof stock.net_change === "number" && (
                        <p className="text-[9px] uppercase tracking-[0.1em] mt-1">
                          {stock.net_change >= 0 ? "+" : ""}
                          {stock.net_change.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

          {!loading && !error && stocks.length === 0 && (
            <div className="p-6 text-sm text-gray-600">
              No market data is currently available.
            </div>
          )}

          {!loading && error && (
            <div className="p-6 text-sm text-gray-600">
              Market data is temporarily unavailable.
            </div>
          )}
        </div>

        {/* FOOTNOTE */}
        <div className="border-t border-gray-800 px-5 py-3">
          <p className="text-[8px] uppercase tracking-[0.15em] text-gray-700">
            Market data provided by IndianAPI • Data may be delayed
          </p>
        </div>
      </div>
    </section>
  );
}