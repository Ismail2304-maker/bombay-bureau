"use client";

import SearchOverlay from "./SearchOverlay";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="w-full px-8 py-6 flex items-center relative">

          {/* LEFT ICONS */}
          <div className="flex items-center gap-5 text-white">

            {/* SEARCH ICON */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:opacity-70 transition"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" strokeWidth={1.7}
                stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="m21 21-4.3-4.3m0 0A7.5 7.5 0 1 0 5 5a7.5 7.5 0 0 0 11.7 11.7Z"/>
              </svg>
            </button>

            {/* NOTIFICATION */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="hover:opacity-70 transition"
                aria-label="Notifications"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" strokeWidth={1.7}
                  stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M14.25 17.25h5.25l-1.5-1.5V11.25a6 6 0 1 0-12 0v4.5l-1.5 1.5h5.25m4.5 0a2.25 2.25 0 1 1-4.5 0"/>
                </svg>
              </button>

              {/* DROPDOWN */}
              {notifOpen && (
                <div className="absolute left-0 mt-4 w-64 bg-black border border-gray-800 rounded-xl p-4 shadow-xl">
                  <p className="text-sm text-gray-400">Notifications</p>
                  <div className="mt-3 text-sm space-y-2">
                    <div className="hover:text-white cursor-pointer">
                      Breaking news alert
                    </div>
                    <div className="hover:text-white cursor-pointer">
                      New article published
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* LOGO */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-center w-max mt-20"
          >
            <h1 className="text-7xl font-serif tracking-wide">
              BOMBAY BUREAU
            </h1>
            <p className="text-lg text-gray-400">
              Global affairs, Indian perspective
            </p>
          </Link>

          {/* SIGN IN */}
          <div className="ml-auto pr-2">
            <Link href="/signin">
              <button className="bg-white text-black px-4 py-1 rounded-full font-semibold">
                Sign in
              </button>
            </Link>
          </div>

        </div>

        {/* NAVBAR */}
        <nav className="border-t border-gray-800 mt-15">
          <div className="flex justify-center gap-12 py-4 text-base text-gray-300">
            <a href="#india">India</a>
            <a href="#world">World</a>
            <a href="#opinion">Opinion</a>
            <a href="#politics">Politics</a>
            <a href="#business">Business</a>
            <a href="#technology">Technology</a>
          </div>
        </nav>
      </header>

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <SearchOverlay onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}