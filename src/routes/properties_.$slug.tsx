import { createFileRoute, Link, notFound, ErrorComponent } from "@tanstack/react-router";
import { buildHead, lodgingGraph, breadcrumbGraph, truncateDescription } from "@/lib/seo";
import { useEffect, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PropertyCard } from "@/components/site/PropertyCard";
import { EnquirySheet } from "@/components/site/EnquirySheet";
import { Lightbox } from "@/components/site/Lightbox";
import { fetchPropertyBySlug, fetchPublishedProperties, type Property } from "@/lib/queries/properties";

const PROPERTY_PINS: Record<string, { x: number; y: number; label: string }> = {
  "sage-and-salt": { x: 110, y: 140, label: "Steenbergs Cove" },
  "sky-and-sea": { x: 110, y: 140, label: "Steenbergs Cove" },
  "10-seaview-close": { x: 105, y: 155, label: "Shelley Point" },
};

export const Route = createFileRoute("/properties_/$slug")({
  loader: async ({ params }) => {
    const [property, all] = await Promise.all([
      fetchPropertyBySlug(params.slug),
      fetchPublishedProperties(),
    ]);
    if (!property) throw notFound();
    const others = all.filter((p) => p.id !== property.id && !p.comingSoon).slice(0, 2);
    return { property, others };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const p = loaderData.property;
    const longText = [p.description, ...p.story].join(" ");
    return buildHead({
      title: p.seoTitle || `${p.name} — Luxury Villa in ${p.location} | Lone Bull Rentals`,
      description: p.seoDescription || truncateDescription(longText, 155),
      path: `/properties/${p.id}`,
      image: p.seoOgImage || p.heroImage,
      type: "product",
      keywords: p.seoKeywords || `${p.location} villa, ${p.location} self catering, ${p.beds} bedroom holiday home, ${p.location} accommodation, west coast luxury rental`,
      structuredData: [
        lodgingGraph(p),
        breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Properties", path: "/properties" },
          { name: p.name, path: `/properties/${p.id}` },
        ]),
      ],
    });
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-display italic text-3xl">House not found.</p>
    </div>
  ),
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  component: PropertyPage,
});

function PropertyPage() {
  const { property, others } = Route.useLoaderData() as { property: Property; others: Property[] };
  const settingParagraphs = property.settingCopy
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const pin = PROPERTY_PINS[property.id] ?? { x: 110, y: 150, label: property.location };
  const [showCta, setShowCta] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowCta(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="page-fade bg-cream">
      <Nav transparentOverHero />

      {/* 1. Cinematic hero */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        <img
          src={property.heroImage}
          alt={`${property.name} — luxury self-catering villa in ${property.location}, South African West Coast`}
          width={2400}
          height={1600}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-ink/30" />
      </section>

      {/* 2. Masthead */}
      <section className="px-6 md:px-12 py-20 max-w-[1320px] mx-auto">
        <Reveal>
          <div className="grid md:grid-cols-12 gap-6 items-end pb-10 border-b border-mist">
            <div className="md:col-span-3">
              <span className="smallcaps text-warmth">{property.location}</span>
            </div>
            <h1 className="md:col-span-6 font-display text-5xl md:text-7xl text-center font-light leading-[1]">
              {property.name}
            </h1>
            <div className="md:col-span-3 md:text-right flex flex-col md:items-end">
              <span className="font-display text-2xl text-ink">From {property.fromPrice}</span>
              <span className="smallcaps text-ink/60 mt-1">/ night</span>
            </div>
          </div>
          <div className="pt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 smallcaps text-ink/70">
            <span>{property.beds} Beds</span>
            <span className="text-warmth">·</span>
            <span>{property.baths} Baths</span>
            <span className="text-warmth">·</span>
            <span>{property.guests} Guests</span>
            <span className="text-warmth">·</span>
            <span>{property.minStay} min</span>
          </div>
        </Reveal>
      </section>

      {/* 3. The Villa */}
      <section className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <span className="smallcaps text-warmth">The Villa</span>
            </div>
            <div className="grid md:grid-cols-2 gap-12 md:gap-16">
              <p className="text-lg leading-[1.8] text-ink/85">{property.story[0]}</p>
              <p className="text-lg leading-[1.8] text-ink/85">{property.story[1]}</p>
            </div>
            <blockquote className="font-display italic text-3xl md:text-4xl text-ocean text-center max-w-2xl mx-auto py-20 leading-[1.3]">
              "{property.pullQuote}"
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* 4. Gallery masonry */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-[1320px] mx-auto">
          <Reveal>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6 [column-fill:_balance]">
              {property.gallery.map((src: string, i: number) => (
                <Lightbox
                  key={i}
                  images={property.gallery}
                  startIndex={i}
                  trigger={
                    <div className="mb-4 md:mb-6 break-inside-avoid overflow-hidden bg-mist cursor-zoom-in">
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        className={`w-full object-cover transition-all duration-700 hover:scale-[1.03] ${
                          i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-[4/3]" : "aspect-square"
                        }`}
                      />
                    </div>
                  }
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. Editorial pull quote band */}
      <section className="py-32 md:py-40 px-6 bg-mist/40">
        <Reveal>
          <p className="font-display italic text-4xl md:text-5xl text-ink text-center max-w-3xl mx-auto leading-[1.3]">
            "{property.pullQuote}"
          </p>
        </Reveal>
      </section>

      {/* 6. The Setting */}
      <section className="grid md:grid-cols-2">
        <div className="relative aspect-[4/5] md:aspect-auto bg-mist overflow-hidden">
          <img
            src={property.settingImage || property.gallery[2]}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="bg-cream py-20 md:py-24 px-8 md:px-16 flex items-center">
          <Reveal>
            <span className="smallcaps text-warmth">The Setting</span>
            <h2 className="font-display text-4xl md:text-5xl font-light mt-5 leading-[1.05]">
              Where you'll be.
            </h2>
            <div className="mt-8 space-y-5 text-ink/80 leading-[1.8]">
              {settingParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <Link to="/guide" className="inline-block mt-10 smallcaps text-ocean link-underline">
              Explore the guide →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 7. The Experience */}
      <section className="px-6 py-32 max-w-4xl mx-auto text-center">
        <Reveal>
          <span className="smallcaps text-warmth">The Experience</span>
          <div className="mt-16 flex flex-col">
            {property.experienceVignettes.map((v, i) => (
              <div key={v.title} className={`py-8 ${i > 0 ? "border-t border-mist" : ""}`}>
                <h3 className="font-display text-3xl md:text-4xl font-light">{v.title}</h3>
                <p className="mt-4 text-ink/80 max-w-xl mx-auto leading-[1.8]">{v.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 8. Features */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-5xl mx-auto text-center">
          <Reveal>
            <span className="smallcaps text-warmth">The Details</span>
            <h2 className="font-display text-4xl md:text-5xl font-light mt-5">Everything in place.</h2>
            <ul className="grid sm:grid-cols-2 gap-x-16 mt-14 text-left">
              {property.features.map((f: string) => (
                <li key={f} className="flex items-start gap-5 py-4 border-b border-mist text-ink/85">
                  <span className="text-warmth font-light text-xl leading-none mt-1">+</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 9. Booking */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <span className="smallcaps text-warmth">Booking</span>
            <h2 className="font-display text-4xl font-light mt-5">Stays here.</h2>
            <div className="mt-12 text-left">
              {[
                ["Check-In", "14:00"],
                ["Check-Out", "10:00"],
                ["Maximum Guests", String(property.guests)],
                ["Minimum Stay", property.minStay],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-baseline py-5 border-b border-mist">
                  <span className="smallcaps text-ink/60">{k}</span>
                  <span className="font-display text-xl">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <EnquirySheet
                defaultProperty={property.id}
                trigger={
                  <button className="bg-ocean text-cream px-10 py-4 smallcaps hover:bg-ink transition-colors">
                    Enquire about this house
                  </button>
                }
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 10. Map */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto text-center">
          <Reveal>
            <span className="smallcaps text-warmth">On the Map</span>
            <div className="mt-12 bg-cream">
              <CoastMap pin={pin} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 12. Other houses */}
      <section className="px-6 md:px-12 py-32">
        <div className="max-w-[1320px] mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="smallcaps text-warmth">Also in the Collection</span>
              <h2 className="font-display text-4xl md:text-5xl font-light mt-5">Two more.</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              {others.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />

      {/* 11. Floating CTA */}
      <div
        className={`fixed bottom-8 right-8 z-30 transition-all duration-500 ${
          showCta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <EnquirySheet
          defaultProperty={property.id}
          trigger={
            <button className="bg-ocean text-cream rounded-full px-8 py-4 smallcaps shadow-xl hover:scale-[1.03] transition-transform">
              Enquire
            </button>
          }
        />
      </div>
      <Link to="/properties" className="hidden">back</Link>
    </div>
  );
}

function CoastMap({ pin }: { pin: { x: number; y: number; label: string } }) {
  return (
    <svg viewBox="0 0 320 320" className="w-full max-w-xl mx-auto" aria-hidden>
      {/* coastline: Cape Town up to Lambert's Bay */}
      <path
        d="M 200 290 C 180 270, 160 255, 150 235 C 142 218, 138 205, 130 190 C 122 175, 110 165, 105 148 C 100 130, 108 115, 100 95 C 95 80, 85 70, 80 55 C 78 45, 82 35, 78 25"
        stroke="#1B1F23"
        strokeWidth="1.25"
        fill="none"
        strokeLinecap="round"
      />
      {/* sea side hint */}
      <path
        d="M 60 25 L 30 25 L 30 295 L 200 295"
        stroke="#E6DFD3"
        strokeWidth="1"
        fill="none"
      />
      {/* pin */}
      <circle cx={pin.x} cy={pin.y} r="6" fill="#B8916B" />
      <circle cx={pin.x} cy={pin.y} r="14" fill="none" stroke="#B8916B" strokeWidth="0.75" opacity="0.5" />
      <text
        x={pin.x + 22}
        y={pin.y + 4}
        fill="#1B1F23"
        fontFamily="Inter, sans-serif"
        fontSize="9"
        letterSpacing="2"
      >
        {pin.label.toUpperCase()}
      </text>
      {/* anchor labels */}
      <text x="205" y="295" fill="#1B1F23" fontFamily="Inter, sans-serif" fontSize="8" letterSpacing="2">
        CAPE TOWN
      </text>
      <text x="60" y="22" fill="#1B1F23" fontFamily="Inter, sans-serif" fontSize="8" letterSpacing="2">
        LAMBERT'S BAY
      </text>
    </svg>
  );
}
