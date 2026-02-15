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
        <div className="w-full px-8 py-6 flex items-center relative">

          {/* LEFT ICONS */}
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
            className="absolute left-1/2 -translate-x-1/2 text-center w-max mt-20"
          >
            <h1 className="text-7xl font-serif tracking-wide">
              BOMBAY BUREAU
            </h1>
            <p className="text-lg text-gray-400 mt-1">
              Global affairs, Indian perspective
            </p>
          </Link>

          {/* ADMIN + USER MENU */}
<div className="ml-auto pr-2 flex items-center gap-6">

  <Link
    href="https://bombay-bureau-admin.sanity.studio"
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm text-gray-300 hover:text-white transition"
  >
    Write Article
  </Link>

  <UserMenu />
</div>

        </div>

        {/* NAVBAR */}
        <nav className="border-t border-gray-800 mt-15">
          <div className="flex justify-center gap-12 py-4 text-base">

            <Link
              href={isHome ? "/#india" : "/india"}
              className={pathname === "/india" ? "text-white" : "text-gray-300"}
            >
              India
            </Link>

            <Link
              href={isHome ? "/#world" : "/world"}
              className={pathname === "/world" ? "text-white" : "text-gray-300"}
            >
              World
            </Link>

            <Link
              href={isHome ? "/#opinion" : "/opinion"}
              className={pathname === "/opinion" ? "text-white" : "text-gray-300"}
            >
              Opinion
            </Link>

            <Link
              href={isHome ? "/#politics" : "/politics"}
              className={pathname === "/politics" ? "text-white" : "text-gray-300"}
            >
              Politics
            </Link>

            <Link
              href={isHome ? "/#business" : "/business"}
              className={pathname === "/business" ? "text-white" : "text-gray-300"}
            >
              Business
            </Link>

            <Link
              href={isHome ? "/#technology" : "/technology"}
              className={pathname === "/technology" ? "text-white" : "text-gray-300"}
            >
              Technology
            </Link>
            {/* ABOUT */}
    <Link
      href="/about"
      className={pathname === "/about" ? "text-white" : "text-gray-300"}
    >
      About
    </Link>
          </div>
        </nav>
      </header>

      {searchOpen && (
        <SearchOverlay onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}