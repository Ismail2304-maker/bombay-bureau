import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans=Geist({variable:"--font-geist-sans",subsets:["latin"]});
const siteUrl="https://bombay-bureau.vercel.app";

export const metadata:Metadata={
  metadataBase:new URL(siteUrl),
  title:{default:"BOMBAY BUREAU",template:"%s | BOMBAY BUREAU"},
  description:"Bombay Bureau is an independent digital news platform covering India and the world through an Indian perspective.",
  alternates:{canonical:siteUrl},
  openGraph:{type:"website",url:siteUrl,siteName:"BOMBAY BUREAU",title:"BOMBAY BUREAU",description:"Global affairs, Indian perspective."},
  twitter:{card:"summary_large_image",title:"BOMBAY BUREAU",description:"Global affairs, Indian perspective."},
  robots:{
    index:true,
    follow:true,
    googleBot:{
      index:true,
      follow:true,
      "max-image-preview":"large",
      "max-snippet":-1,
      "max-video-preview":-1,
    },
  },
};

const publisherJsonLd={
  "@context":"https://schema.org","@type":"NewsMediaOrganization","@id":`${siteUrl}/#organization`,
  name:"BOMBAY BUREAU",url:siteUrl,logo:`${siteUrl}/icon.png`,
  description:"An independent digital news platform covering India and the world through an Indian perspective.",
  founder:{"@type":"Person",name:"Muhammed Ismail",url:`${siteUrl}/author/muhammed-ismail`},
  contactPoint:{
    "@type":"ContactPoint",
    contactType:"editorial",
    email:"editor@bombaybureau.com",
    url:`${siteUrl}/contact`,
  },
  publishingPrinciples:[
    `${siteUrl}/editorial-standards`,
    `${siteUrl}/corrections`,
    `${siteUrl}/ai-policy`,
  ],
  masthead:`${siteUrl}/newsroom`,
  correctionsPolicy:`${siteUrl}/corrections`,
  ethicsPolicy:`${siteUrl}/editorial-standards`,
  ownershipFundingInfo:`${siteUrl}/about`,
  actionableFeedbackPolicy:`${siteUrl}/contact`,
  missionCoveragePrioritiesPolicy:`${siteUrl}/about`,
  employee:{
    "@type":"Person",
    name:"Rayan Khan",
    jobTitle:"Editor",
  },
};

const websiteJsonLd={
  "@context":"https://schema.org","@type":"WebSite","@id":`${siteUrl}/#website`,
  name:"BOMBAY BUREAU",url:siteUrl,publisher:{"@id":`${siteUrl}/#organization`},
  description:"Global affairs, Indian perspective.",
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><head>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(publisherJsonLd)}} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteJsonLd)}} />
    <Script src="https://www.googletagmanager.com/gtag/js?id=G-9MLBXV4XSH" strategy="lazyOnload" />
    <Script id="google-analytics" strategy="afterInteractive">{`
      window.dataLayer=window.dataLayer||[];
      function gtag(){dataLayer.push(arguments);}
      gtag('js',new Date());
      gtag('config','G-9MLBXV4XSH');
    `}</Script>
    <link rel="alternate" type="application/rss+xml" title="BOMBAY BUREAU RSS" href={`${siteUrl}/rss.xml`} />
  </head><body className={`${geistSans.variable} antialiased`}>
    <div id="pageFade" className="fixed inset-0 bg-black opacity-0 pointer-events-none transition-opacity duration-300 z-[999]" />
    {children}
  </body></html>;
}
