"use client";

import { usePathname } from "next/navigation";
import UserMenu from "@/components/UserMenu";
import SearchOverlay from "./SearchOverlay";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <header className="sticky top-0 z-50 mx-auto w-full px-2 md:px-4 isolate">
       <div className="relative overflow-hidden rounded-b-2xl border border-gray-800 bg-black shadow-2xl">
          {/* ================= LANDMARK BACKGROUND ================= */}
          <div className="absolute inset-0 overflow-hidden bg-black">

            <img
              src="/india-landmarks.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-fill"
            />

            {/* Dark cinematic overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Extra black fade at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/30 to-transparent" />

          </div>

          {/* ================= HEADER CONTENT ================= */}
          <div className="relative z-10">

            {/* MAIN BRAND AREA */}
            <div className="relative h-[205px] md:h-[225px]">

              {/* SEARCH — REAL / ACTIVE */}
              <div className="absolute left-5 md:left-10 top-5 md:top-6">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-white hover:text-gray-300 transition"
                  aria-label="Search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.3-4.3m0 0A7.5 7.5 0 1 0 5 5a7.5 7.5 0 0 0 11.7 11.7Z"
                    />
                  </svg>
                </button>
              </div>

              {/* USER — REAL / ACTIVE */}
              <div className="absolute right-4 md:right-10 top-4 md:top-5">
                <UserMenu />
              </div>

              {/* CENTER BRANDING */}
              <div className="absolute inset-x-0 top-[48px] md:top-[52px] flex flex-col items-center text-center px-4">

                <Link href="/" className="group">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif tracking-wide whitespace-nowrap text-white drop-shadow-2xl group-hover:text-gray-200 transition">
                    BOMBAY BUREAU
                  </h1>
                </Link>

                <p className="text-sm md:text-lg text-gray-300 tracking-wide mt-2 drop-shadow-lg">
                  Global affairs, Indian perspective
                </p>

                {/* Elegant divider */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-12 md:w-20 h-px bg-gray-400/60" />

                  <span className="text-white text-sm">
                    ✦
                  </span>

                  <div className="w-12 md:w-20 h-px bg-gray-400/60" />
                </div>

              </div>

            </div>

            {/* ================= NAVIGATION ================= */}
            <nav className="relative z-20 border-t border-gray-700 bg-black">
              <div
                className="
                  flex overflow-x-auto
                  justify-start md:justify-center
                  gap-6 md:gap-12
                  px-5 md:px-0
                  py-3
                  text-sm md:text-base
                  whitespace-nowrap
                "
              >
                {[
                  "India",
                  "World",
                  "Politics",
                  "Business",
                  "Technology",
                  "About",
                ].map((item) => {
                  const lower = item.toLowerCase();

                  return (
                    <Link
                      key={item}
                      href={
                        item === "About"
                          ? "/about"
                          : isHome
                          ? `/#${lower}`
                          : `/${lower}`
                      }
                      className={
                        pathname === `/${lower}`
                          ? "text-white"
                          : "text-gray-300 hover:text-white transition"
                      }
                    >
                      {item}
                    </Link>
                  );
                })}
              </div>
            </nav>

          </div>
        </div>
      </header>

      {/* REAL SEARCH OVERLAY */}
      {searchOpen && (
        <SearchOverlay onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}