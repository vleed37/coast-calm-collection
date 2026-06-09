import { createFileRoute, Link } from "@tanstack/react-router";
import { buildHead, organizationGraph } from "@/lib/seo";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { EnquirySheet } from "@/components/site/EnquirySheet";
import heroAsset from "@/assets/hero-coast.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () =>
    buildHead({
      title: "Luxury West Coast Villa Rentals | Lone Bull Rentals",
      description:
        "A small collection of self-catering villas on South Africa's West Coast. Direct booking enquiries — no platform fees.",
      keywords:
        "west coast villa rental, luxury holiday home south africa, shelley point accommodation, britannia bay villa, st helena bay self catering, west coast airbnb alternative",
      path: "/",
      type: "website",
      image: heroAsset.url,
      structuredData: organizationGraph(),
    }),
  component: Home,
});

function Home() {
  return (
    <div className="page-fade bg-cream">
      <Nav transparentOverHero />

      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={heroAsset.url}
          alt="A quiet West Coast bay with turquoise water, white sand, and a distant lighthouse"
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-ink/60" />
        <div className="absolute inset-0 flex flex-col justify-end pb-32 px-6 md:px-16">
          <div className="max-w-[1320px] mx-auto w-full">
            <h1 className="font-display italic font-light text-cream text-6xl md:text-8xl lg:text-9xl leading-[0.95] max-w-4xl">
              Where the coastline<br />pauses.
            </h1>
            <p className="smallcaps text-cream/80 mt-8">A small collection of homes on the West Coast.</p>
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 scroll-cue smallcaps text-cream/70">scroll</div>
      </section>

      {/* MANIFESTO */}
      <section className="py-32 md:py-40 px-6">
        <Reveal className="max-w-3xl mx-auto text-center">
          <p className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.25] font-light">
            We don't rent houses. We offer a few weeks each year inside places we love.
            <span className="italic text-ocean"> Stay slowly.</span>
          </p>
        </Reveal>
      </section>

      {/* ACTIVITIES — image right, text left (mirror of Local Guide teaser below) */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-0 items-stretch">
          <Reveal className="bg-cream flex items-center px-6 md:px-16 py-16 order-2 md:order-1">
            <div className="max-w-md">
              <span className="smallcaps text-warmth">Things to Do</span>
              <h2 className="font-display italic text-5xl md:text-6xl mt-6 leading-[1.05] font-light">The coast, in motion.</h2>
              <p className="mt-8 text-ink/80 text-lg">
                Long beaches and tidal pools, kayaks at first light, horses across the dunes,
                fairways above the sea, and unfussy local tables that close when the sun goes down.
              </p>
              <Link to="/guide" className="smallcaps text-ocean link-underline mt-10 inline-block">Explore the Guide →</Link>
            </div>
          </Reveal>
          <Reveal delay={150} className="aspect-[4/5] md:aspect-auto overflow-hidden bg-mist order-1 md:order-2">
            <img
              src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1600&q=80"
              alt="Wide West Coast beach at low tide"
              className="w-full h-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* GUIDE TEASER */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-0 items-stretch">
          <Reveal className="aspect-[4/5] md:aspect-auto overflow-hidden bg-mist">
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80" alt="" className="w-full h-full object-cover" />
          </Reveal>
          <Reveal delay={150} className="bg-cream flex items-center px-6 md:px-16 py-16">
            <div className="max-w-md">
              <span className="smallcaps text-warmth">Local Guide</span>
              <h2 className="font-display italic text-5xl md:text-6xl mt-6 leading-[1.05] font-light">Beyond the front door.</h2>
              <p className="mt-8 text-ink/80 text-lg">
                The bakery that opens at six. The walk between the lighthouses. The places we send people first.
              </p>
              <Link to="/guide" className="smallcaps text-ocean link-underline mt-10 inline-block">Explore the Guide →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ocean text-cream py-32 md:py-40 px-6 text-center">
        <Reveal>
          <h2 className="font-display text-5xl md:text-7xl font-light">Begin your stay.</h2>
          <p className="smallcaps text-cream/70 mt-6">By appointment, by enquiry, by quiet arrangement.</p>
          <div className="mt-12">
            <EnquirySheet trigger={<button className="border border-cream/60 px-12 py-4 smallcaps hover:bg-cream hover:text-ocean transition-colors">Enquire</button>} />
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
