"use client";

import { useEffect, useState } from "react";

type Stock = {
  ticker_id?: string;
  company_name?: string;
  price?: number | string;
  ticker?: string;
  company?: string;
  percent_change?: number | string;
  net_change?: number | string;
  exchange_type?: string;
  volume?: number | string;
};

type MarketData = {
  trending_stocks?: {
    top_gainers?: Stock[];
    top_losers?: Stock[];
  };
  nse_most_active?: Stock[] | { data?: Stock[] };
  bse_most_active?: Stock[] | { data?: Stock[] };
};

function extractStocks(value: Stock[] | { data?: Stock[] } | undefined): Stock[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && Array.isArray(value.data)) {
    return value.data;
  }

  return [];
}

function formatPrice(value?: number | string) {
  if (value === undefined || value === null || value === "") {
    return "—";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "—";
  }

  return `₹${number.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatVolume(value?: number | string) {
  if (value === undefined || value === null || value === "") {
    return "—";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "—";
  }

  if (number >= 10000000) {
    return `${(number / 10000000).toFixed(2)} Cr`;
  }

  if (number >= 100000) {
    return `${(number / 100000).toFixed(2)} L`;
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return number.toLocaleString("en-IN");
}

export default function MarketSnapshot() {
  const [data, setData] = useState<MarketData | null>(null);
  const [activeSection, setActiveSection] = useState<
    "movers" | "active"
  >("movers");
  const [activeTab, setActiveTab] = useState<"gainers" | "losers">(
    "gainers"
  );
  const [exchange, setExchange] = useState<"NSE" | "BSE">("NSE");
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

  const movers =
    activeTab === "gainers"
      ? data?.trending_stocks?.top_gainers || []
      : data?.trending_stocks?.top_losers || [];

  const activeStocks =
    exchange === "NSE"
      ? extractStocks(data?.nse_most_active)
      : extractStocks(data?.bse_most_active);

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
        {/* MAIN TABS */}
        <div className="flex items-center border-b border-gray-800">
          <button
            onClick={() => setActiveSection("movers")}
            className={`px-5 md:px-6 py-3 text-[10px] uppercase tracking-[0.16em] transition ${
              activeSection === "movers"
                ? "text-white bg-gray-900"
                : "text-gray-600 hover:text-gray-300"
            }`}
          >
            Top Movers
          </button>

          <button
            onClick={() => setActiveSection("active")}
            className={`px-5 md:px-6 py-3 text-[10px] uppercase tracking-[0.16em] transition ${
              activeSection === "active"
                ? "text-white bg-gray-900"
                : "text-gray-600 hover:text-gray-300"
            }`}
          >
            Most Active
          </button>

          <div className="ml-auto px-4 md:px-6 text-[9px] uppercase tracking-[0.15em] text-gray-700">
            Indian Markets
          </div>
        </div>

        {/* TOP MOVERS */}
        {activeSection === "movers" && (
          <>
            {/* GAINERS / LOSERS */}
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
            </div>

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
                movers.length > 0 &&
                movers.slice(0, 5).map((stock, index) => {
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
                        {stock.company_name ||
                          stock.ticker_id ||
                          "Unknown"}
                      </h3>

                      <div className="flex items-end justify-between gap-3 mt-5">
                        <div>
                          <p className="text-sm text-white">
                            {formatPrice(stock.price)}
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

                          {stock.net_change !== undefined && (
                            <p className="text-[9px] uppercase tracking-[0.1em] mt-1">
                              {Number(stock.net_change) >= 0 ? "+" : ""}
                              {Number(stock.net_change).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

              {!loading && !error && movers.length === 0 && (
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
          </>
        )}

        {/* MOST ACTIVE */}
        {activeSection === "active" && (
          <>
            {/* EXCHANGE TABS */}
            <div className="flex items-center border-b border-gray-800">
              <button
                onClick={() => setExchange("NSE")}
                className={`px-5 md:px-6 py-3 text-[10px] uppercase tracking-[0.16em] transition ${
                  exchange === "NSE"
                    ? "text-white bg-gray-900"
                    : "text-gray-600 hover:text-gray-300"
                }`}
              >
                NSE
              </button>

              <button
                onClick={() => setExchange("BSE")}
                className={`px-5 md:px-6 py-3 text-[10px] uppercase tracking-[0.16em] transition ${
                  exchange === "BSE"
                    ? "text-white bg-gray-900"
                    : "text-gray-600 hover:text-gray-300"
                }`}
              >
                BSE
              </button>

              <div className="ml-auto px-4 md:px-6 text-[9px] uppercase tracking-[0.15em] text-gray-700">
                Trading Activity
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {loading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="border-b md:border-b-0 md:border-r border-gray-800 p-5 animate-pulse"
                  >
                    <div className="h-3 w-8 bg-gray-900 rounded mb-5" />
                    <div className="h-5 w-32 bg-gray-900 rounded mb-3" />
                    <div className="h-3 w-20 bg-gray-900 rounded" />
                  </div>
                ))}

              {!loading &&
                !error &&
                activeStocks.length > 0 &&
                activeStocks.slice(0, 5).map((stock, index) => {
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
                          {stock.exchange_type || exchange}
                        </span>
                      </div>

                      <h3 className="font-serif text-base md:text-lg text-gray-200 leading-snug line-clamp-2 min-h-[48px]">
                        {stock.company ||
  stock.company_name ||
  stock.ticker ||
  stock.ticker_id ||
  "Unknown"}
                      </h3>

                      <div className="flex items-end justify-between gap-3 mt-5">
                        <div>
                          <p className="text-sm text-white">
                            {formatPrice(stock.price)}
                          </p>

                          <p className="text-[9px] uppercase tracking-[0.12em] text-gray-700 mt-1">
                            {stock.ticker || stock.ticker_id || ""}
                          </p>
                        </div>

                        <div className="text-right">
                          <p
                            className={`text-sm font-medium ${
                              positive
                                ? "text-gray-300"
                                : "text-gray-500"
                            }`}
                          >
                            {positive ? "+" : ""}
                            {change.toFixed(2)}%
                          </p>

                          <p className="text-[9px] uppercase tracking-[0.1em] text-gray-700 mt-1">
                            Vol {formatVolume(stock.volume)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {!loading && !error && activeStocks.length === 0 && (
                <div className="p-6 text-sm text-gray-600">
                  Most active market data is currently unavailable.
                </div>
              )}

              {!loading && error && (
                <div className="p-6 text-sm text-gray-600">
                  Market data is temporarily unavailable.
                </div>
              )}
            </div>
          </>
        )}

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