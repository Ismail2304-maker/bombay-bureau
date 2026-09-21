import Link from "next/link";
import type { Metadata } from "next";

const siteUrl="https://bombay-bureau.vercel.app";

export const metadata:Metadata={
  title:"Newsroom",
  description:"How BOMBAY BUREAU operates, what it covers and the editorial standards behind its journalism.",
  alternates:{canonical:"/newsroom"},
};

const newsroomJsonLd={
  "@context":"https://schema.org","@type":"AboutPage","@id":`${siteUrl}/newsroom#about`,
  url:`${siteUrl}/newsroom`,name:"BOMBAY BUREAU Newsroom",
  about:{"@type":"Organization","@id":`${siteUrl}/#organization`,name:"BOMBAY BUREAU"},
};

const policies=[
  ["Editorial Standards","/editorial-standards","How reporting, sourcing and editorial decisions are handled."],
  ["AI Policy","/ai-policy","How AI-assisted tools may be used while human editorial responsibility remains with the publication."],
  ["Corrections","/corrections","How factual errors and corrections are handled after publication."],
  ["About BOMBAY BUREAU","/about","Ownership, mission and the publication's editorial identity."],
];

export default function NewsroomPage(){
  return <main className="min-h-screen bg-black text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(newsroomJsonLd)}} />
    <header className="border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-2xl md:text-3xl font-serif tracking-tight">BOMBAY BUREAU</span>
          <span className="text-[10px] md:text-xs tracking-widest text-gray-500 mt-1">Global affairs, Indian perspective</span>
        </Link>
        <Link href="/" className="text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Home</Link>
      </div>
    </header>
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-5">The Newsroom</p>
      <h1 className="text-4xl md:text-6xl font-serif tracking-tight">How BOMBAY BUREAU works</h1>
      <p className="mt-6 max-w-3xl text-lg md:text-xl text-gray-300 leading-relaxed">
        BOMBAY BUREAU is an independent digital news platform focused on India and the world through an Indian perspective.
      </p>
      <div className="grid md:grid-cols-2 gap-8 mt-16">
        <section id="editorial-leadership" className="border-t border-gray-800 pt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Editorial leadership</p>
          <h2 className="text-2xl font-serif">Rayan Khan</h2>
          <p className="mt-2 text-gray-400">Editor</p>
          <p className="mt-5 text-gray-400 leading-relaxed">
            Editorial responsibility for published journalism rests with the editor, including review, corrections and the final decision to publish. Ownership and publishing functions remain separate from that editorial role.
          </p>
        </section>
        <section className="border-t border-gray-800 pt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Coverage</p>
          <h2 className="text-2xl font-serif">India and global affairs</h2>
          <p className="mt-5 text-gray-400 leading-relaxed">
            Coverage includes India, world affairs, politics, business, technology, opinion, explainers and visual stories.
          </p>
        </section>
      </div>
      <section className="mt-16 border-t border-gray-800 pt-10">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Editorial transparency</p>
        <h2 className="text-3xl font-serif">Standards and accountability</h2>
        <p className="mt-5 max-w-3xl text-gray-400 leading-relaxed">
          BOMBAY BUREAU separates reporting, analysis, opinion and explanatory work through clear labeling. AI-assisted tools may support research, organization, drafting, translation or data processing, but they are not treated as independent authors or sources. Published work remains subject to human editorial review.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          {policies.map(([title,href,description])=><Link key={href} href={href} className="border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors">
            <h3 className="font-serif text-xl">{title}</h3><p className="mt-2 text-sm text-gray-500 leading-relaxed">{description}</p>
          </Link>)}
        </div>
      </section>
      <section className="mt-16 border-t border-gray-800 pt-10">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Contact</p>
        <h2 className="text-3xl font-serif">Reach the editor</h2>
        <p className="mt-5 text-gray-400">For editorial enquiries, corrections and publication matters, contact the editorial desk.</p>
        <a href="mailto:editor@bombaybureau.com" className="inline-block mt-4 text-white underline underline-offset-4 hover:text-gray-300">editor@bombaybureau.com</a>
      </section>
    </section>
  </main>;
}
