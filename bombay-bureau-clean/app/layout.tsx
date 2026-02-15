import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BOMBAY BUREAU",
  description: "Global affairs, Indian perspective",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 🔥 GLOBAL PAGE FADE OVERLAY (logout animation) */}
        <div
          id="pageFade"
          className="fixed inset-0 bg-black opacity-0 pointer-events-none transition-opacity duration-300 z-[999]"
        />

        {/* 🎬 PREMIUM PAGE TRANSITIONS */}
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}