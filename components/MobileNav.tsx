"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  ["Latest", "/latest"],
  ["Discover", "/discover"],
  ["India", "/india"],
  ["World", "/world"],
  ["Politics", "/politics"],
  ["Business", "/business"],
  ["Technology", "/technology"],
  ["Sports", "/sports"],
  ["Culture", "/culture"],
  ["Opinion", "/opinion"],
  ["Explainers", "/explainers"],
  ["Archive", "/archive"],
  ["Saved", "/saved"],
  ["About", "/about"],
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden border-t border-gray-700 bg-black">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        className="w-full flex items-center justify-between px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors"
      >
        <span>Menu</span>
        <span aria-hidden="true" className="text-lg leading-none">
          {open ? "×" : "☰"}
        </span>
      </button>

      {open && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-gray-800 px-4 py-3">
          <div className="grid grid-cols-2 gap-x-6">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="border-b border-gray-900 py-3 text-[10px] uppercase tracking-[0.16em] text-gray-400 hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
