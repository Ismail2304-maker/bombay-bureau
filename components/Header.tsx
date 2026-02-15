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
  <div className="relative w-full py-4 md:py-10">

  {/* SEARCH — TOP LEFT */}
  <div className="absolute left-4 md:left-12 top-3 md:top-6">
    <button
      onClick={() => setSearchOpen(true)}
      className="text-white hover:opacity-70 transition"
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

  {/* CENTER LOGO */}
  <div className="flex flex-col items-center text-center">
    <Link href="/">
      <h1 className="text-2xl sm:text-4xl md:text-7xl font-serif tracking-wide whitespace-nowrap">
        BOMBAY BUREAU
      </h1>
    </Link>

    <p className="hidden md:block text-sm md:text-lg text-gray-400 mt-1">
      Global affairs, Indian perspective
    </p>
  </div>

  {/* USER — TOP RIGHT */}
  <div className="absolute right-2 md:right-12 top-3 md:top-6">
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