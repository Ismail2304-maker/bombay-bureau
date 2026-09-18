import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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

const siteUrl = "https://bombay-bureau.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BOMBAY BUREAU",
    template: "%s | BOMBAY BUREAU",
  },
  description:
    "Bombay Bureau is an independent digital news platform covering India and the world through an Indian perspective.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "BOMBAY BUREAU",
    title: "BOMBAY BUREAU",
    description:
      "Global affairs, Indian perspective.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BOMBAY BUREAU",
    description:
      "Global affairs, Indian perspective.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const publisherJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "BOMBAY BUREAU",
  url: siteUrl,
  logo: `${siteUrl}/icon.png`,
  description:
    "An independent digital news platform covering India and the world through an Indian perspective.",
  founder: {
    "@type": "Person",
    name: "Muhammed Ismail",
    url: `${siteUrl}/author/muhammed-ismail`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(publisherJsonLd),
          }}
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9MLBXV4XSH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9MLBXV4XSH');
          `}
        </Script>
      </head>

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
