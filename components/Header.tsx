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
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">

        {/* TOP BAR */}
        <div className="w-full px-4 md:px-8 py-4 md:py-6 flex items-center relative">

          {/* LEFT ICON */}
          <div className="flex items-center gap-5 text-white">
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:opacity-70 transition"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.7}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.3-4.3m0 0A7.5 7.5 0 1 0 5 5a7.5 7.5 0 0 0 11.7 11.7Z"
                />
              </svg>
            </button>
          </div>

          {/* LOGO */}
          <Link
            href="/"
            className="
              text-center w-max mx-auto
              md:absolute md:left-1/2 md:-translate-x-1/2
            "
          >
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif tracking-wide">
              BOMBAY BUREAU
            </h1>

            <p className="hidden sm:block text-sm md:text-lg text-gray-400 mt-1">
              Global affairs, Indian perspective
            </p>
          </Link>

          {/* USER MENU */}
          <div className="ml-auto">
            <UserMenu />
          </div>

        </div>

        {/* NAVBAR */}
        <nav className="border-t border-gray-800">
          <div className="
            flex overflow-x-auto md:overflow-visible
            justify-start md:justify-center
            gap-6 md:gap-12
            px-4 md:px-0
            py-3 md:py-4
            text-sm md:text-base
            whitespace-nowrap
          ">

            {[
              "India",
              "World",
              "Opinion",
              "Politics",
              "Business",
              "Technology",
              "About"
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

      </header>

      {searchOpen && (
        <SearchOverlay onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}