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

  const mainNav = [
    "Latest",
    "India",
    "World",
    "Politics",
    "Business",
    "Markets",
    "Technology",
    "Opinion",
    "Explainers",
    "Video",
  ];

  return (
    <>
      <header className="sticky top-0 z-50 mx-auto w-full px-1 md:px-4 isolate">
        <div className="relative overflow-visible rounded-b-2xl border border-gray-800 bg-black shadow-2xl">

          {/* ================= LANDMARK BACKGROUND ================= */}
          <div className="absolute inset-0 overflow-hidden bg-black">
            <img
              src="/india-landmarks.png"
              alt=""
              aria-hidden="true"
              className="
                absolute inset-0 w-full h-full
                object-cover object-[center_72%]
                md:object-fill md:object-center
              "
            />

            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute inset-x-0 bottom-0 h-16 md:h-24 bg-gradient-to-t from-black via-black/30 to-transparent" />
          </div>

          {/* ================= HEADER CONTENT ================= */}
          <div className="relative z-10">

            {/* ================= BRAND AREA ================= */}
            <div className="relative h-[145px] md:h-[195px]">

              {/* SEARCH */}
              <div className="absolute left-4 md:left-10 top-4 md:top-6">
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
                    className="w-5 h-5 md:w-6 md:h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.3-4.3m0 0A7.5 7.5 0 1 0 5 5a7.5 7.5 0 0 0 11.7 11.7Z"
                    />
                  </svg>
                </button>
              </div>

              {/* USER */}
              <div className="absolute right-3 md:right-10 top-3 md:top-5">
                <UserMenu />
              </div>

              {/* CENTER BRANDING */}
              <div className="absolute inset-x-0 top-[50px] md:top-[42px] flex flex-col items-center text-center px-3">
                <Link href="/" className="group">
                  <h1
                    className="
                      text-3xl
                      sm:text-4xl
                      md:text-6xl
                      lg:text-7xl
                      font-serif
                      tracking-wide
                      whitespace-nowrap
                      text-white
                      drop-shadow-2xl
                      group-hover:text-gray-200
                      transition
                    "
                  >
                    BOMBAY BUREAU
                  </h1>
                </Link>

                <p className="text-xs sm:text-sm md:text-lg text-gray-300 tracking-wide mt-1 md:mt-2 drop-shadow-lg">
                  Global affairs, Indian perspective
                </p>
              </div>
            </div>

            {/* ================= PRIMARY NAVIGATION ================= */}
            <nav className="relative z-0 border-t border-gray-700 bg-black">
              <div
                className="
                  flex items-center
                  overflow-x-auto
                  justify-start md:justify-center
                  gap-5 sm:gap-6 md:gap-9
                  px-4 md:px-6
                  py-2.5 md:py-3
                  text-[11px] sm:text-xs md:text-sm
                  uppercase
                  tracking-[0.08em]
                  whitespace-nowrap
                  scrollbar-hide
                "
              >
                {mainNav.map((item) => {
                  const lower = item.toLowerCase();

                  let href = `/${lower}`;

                  if (item === "Latest") {
                    href = "/";
                  }

                  if (item === "Markets") {
                    href = "/markets";
                  }

                  if (
                    isHome &&
                    [
                      "India",
                      "World",
                      "Politics",
                      "Business",
                      "Technology",
                      "Opinion",
                      "Explainers",
                      "Video",
                    ].includes(item)
                  ) {
                    href = `/#${lower}`;
                  }

                  return (
                    <Link
  key={item}
  href={href}
  scroll={true}
  className="
    text-gray-400
    hover:text-white
    transition-colors
    duration-200
    shrink-0
  "
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

      {/* ================= SEARCH OVERLAY ================= */}
      {searchOpen && (
        <SearchOverlay onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}