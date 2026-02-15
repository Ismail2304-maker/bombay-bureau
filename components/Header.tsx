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
  <div className="w-full px-4 md:px-12 py-4 md:py-6 grid grid-cols-3 items-center">

    {/* LEFT */}
    <div className="flex items-center justify-start text-white">
      <button
        onClick={() => setSearchOpen(true)}
        className="hover:opacity-70 transition"
        aria-label="Search"
      >
        {/* Keep your SVG icon here */}
      </button>
    </div>

    {/* CENTER LOGO */}
    <Link href="/" className="flex flex-col items-center text-center col-span-1">
      <h1 className="text-2xl sm:text-4xl md:text-7xl font-serif tracking-wide">
        BOMBAY BUREAU
      </h1>

      <p className="hidden md:block text-sm md:text-lg text-gray-400 mt-1">
        Global affairs, Indian perspective
      </p>
    </Link>

    {/* RIGHT */}
    <div className="flex justify-end">
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