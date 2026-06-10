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
import westCoastMapAsset from "@/assets/west-coast-map.png.asset.json";

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
  const [showCta, setShowCta] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowCta(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Location: "Estate name, Town" → render on two lines
  const [locLine1, locLine2] = (() => {
    const idx = property.location.indexOf(",");
    if (idx === -1) return [property.location, ""];
    return [property.location.slice(0, idx).trim() + ",", property.location.slice(idx + 1).trim()];
  })();

  // Rooms tab reads from the dedicated rooms_breakdown field so it never
  // overlaps with the general amenities shown on the Details tab.
  const roomFeatures = property.roomsBreakdown;

  type TabKey = "overview" | "rooms" | "details" | "location" | "gallery";
  const TABS: { key: TabKey; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "rooms", label: "Rooms" },
    { key: "details", label: "Details" },
    { key: "location", label: "Location" },
    { key: "gallery", label: "Gallery" },
  ];
  const [tab, setTab] = useState<TabKey>("overview");
  const onTab = (k: TabKey) => {
    setTab(k);
    if (typeof window !== "undefined") {
      const el = document.getElementById("masthead");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 16;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="page-fade bg-cream">
      <Nav transparentOverHero />

      {/* 1. Cinematic hero */}
      <section className="relative h-[72vh] w-full overflow-hidden">
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

      {/* 2. Masthead — name, location, specs, gold line, tabs */}
      <section id="masthead" className="px-6 md:px-12 pt-14 md:pt-16 pb-0 max-w-[1320px] mx-auto">
        <Reveal>
          <div className="flex flex-col items-center text-center gap-5">
            <h1 className="font-display text-5xl md:text-7xl font-light leading-[1]">
              {property.name}
            </h1>
            <div className="smallcaps text-warmth leading-[1.7]">
              <div>{locLine1}</div>
              {locLine2 && <div>{locLine2}</div>}
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 smallcaps text-ink/70">
              <span>{property.beds} Beds</span>
              <span className="text-warmth">·</span>
              <span>{property.baths} Baths</span>
              <span className="text-warmth">·</span>
              <span>{property.guests} Guests</span>
              <span className="text-warmth">·</span>
              <span>From {property.fromPrice} / night</span>
            </div>
          </div>
          <div className="mt-10 border-t border-warmth/60" />
          {/* Tabs */}
          <div className="mt-8 -mx-2 overflow-x-auto">
            <div role="tablist" aria-label="Property sections" className="flex justify-center gap-3 md:gap-4 min-w-max px-2">
              {TABS.map((t) => {
                const active = tab === t.key;
                return (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={active}
                    onClick={() => onTab(t.key)}
                    className={`smallcaps tracking-[0.18em] text-xs md:text-sm px-5 md:px-7 py-3 border transition-colors ${
                      active
                        ? "bg-ocean text-cream border-ocean"
                        : "border-ocean/60 text-ocean hover:bg-ocean/5"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Tab panels */}
      <section className="px-6 md:px-12 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          {tab === "overview" && (
            <Reveal>
              {/* Booking facts box — moved here from the Details tab */}
              <div className="max-w-3xl mx-auto mb-16 md:mb-20">
                <div className="text-center">
                  <span className="smallcaps text-warmth">Booking</span>
                </div>
                <div className="mt-8 text-left">
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
                <div className="mt-10 flex justify-center">
                  <EnquirySheet
                    defaultProperty={property.id}
                    trigger={
                      <button className="bg-ocean text-cream px-10 py-4 smallcaps hover:bg-ink transition-colors">
                        Enquire about this house
                      </button>
                    }
                  />
                </div>
              </div>
              <div className="text-center mb-10">
                <span className="smallcaps text-warmth">The Home</span>
              </div>
              <div className="grid md:grid-cols-2 gap-10 md:gap-14">
                {property.story.map((para, i) => (
                  <p key={i} className="text-lg leading-[1.8] text-ink/85">{para}</p>
                ))}
              </div>
              {property.pullQuote && (
                <blockquote className="font-display italic text-3xl md:text-4xl text-ocean text-center max-w-2xl mx-auto py-14 md:py-16 leading-[1.3]">
                  {`\u201C${property.pullQuote}\u201D`}
                </blockquote>
              )}
              {property.experienceVignettes.length > 0 && (
                <div className="mt-4 max-w-3xl mx-auto text-center">
                  <span className="smallcaps text-warmth">The Experience</span>
                  <div className="mt-8 flex flex-col">
                    {property.experienceVignettes.map((v, i) => (
                      <div key={v.title} className={`py-6 ${i > 0 ? "border-t border-mist" : ""}`}>
                        <h3 className="font-display text-3xl md:text-4xl font-light">{v.title}</h3>
                        <p className="mt-3 text-ink/80 max-w-xl mx-auto leading-[1.8]">{v.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Reveal>
          )}

          {tab === "rooms" && (
            <Reveal>
              <div className="text-center mb-10">
                <span className="smallcaps text-warmth">Rooms</span>
                <h2 className="font-display text-4xl md:text-5xl font-light mt-4">Where you'll stay.</h2>
              </div>
              <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto text-center">
                {[
                  ["Bedrooms", property.beds],
                  ["Bathrooms", property.baths],
                  ["Sleeps", property.guests],
                ].map(([k, v]) => (
                  <div key={k as string} className="border border-mist py-6">
                    <div className="font-display text-4xl font-light">{v}</div>
                    <div className="smallcaps text-ink/60 mt-2">{k}</div>
                  </div>
                ))}
              </div>
              <div className="max-w-2xl mx-auto mt-14">
                <h3 className="font-display text-2xl md:text-3xl font-light">Bedrooms &amp; Bathrooms</h3>
                {roomFeatures.length > 0 ? (
                  <ul className="mt-5">
                    {roomFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-4 py-3 border-b border-mist text-ink/85">
                        <span className="text-warmth font-light text-xl leading-none mt-1">+</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 text-ink/70 italic">Room-by-room detail coming soon.</p>
                )}
              </div>
            </Reveal>
          )}

          {tab === "details" && (
            <Reveal>
              <div className="text-center">
                <span className="smallcaps text-warmth">The Details</span>
                <h2 className="font-display text-4xl md:text-5xl font-light mt-4">Everything in place.</h2>
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-16 mt-12 text-left">
                {property.features.map((f: string) => (
                  <li key={f} className="flex items-start gap-5 py-4 border-b border-mist text-ink/85">
                    <span className="text-warmth font-light text-xl leading-none mt-1">+</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {tab === "location" && (
            <Reveal>
              <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
                <div className="relative aspect-[4/5] bg-mist overflow-hidden">
                  <img
                    src={property.settingImage || property.gallery[2]}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="smallcaps text-warmth">The Setting</span>
                  <h2 className="font-display text-4xl md:text-5xl font-light mt-4 leading-[1.05]">
                    Where you'll be.
                  </h2>
                  <div className="mt-6 space-y-5 text-ink/80 leading-[1.8]">
                    {settingParagraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  <Link to="/guide" className="inline-block mt-8 smallcaps text-ocean link-underline">
                    Explore the guide →
                  </Link>
                </div>
              </div>
              <div className="mt-16 text-center">
                <span className="smallcaps text-warmth">On the Map</span>
                <div className="mt-8">
                  <img
                    src={westCoastMapAsset.url}
                    alt="Map of South Africa's West Coast"
                    loading="lazy"
                    className="w-full max-w-xl mx-auto h-auto"
                  />
                  {property.mapUrl && (
                    <div className="mt-8 flex justify-center">
                      <a
                        href={property.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-ocean text-cream px-10 py-4 smallcaps hover:bg-ink transition-colors"
                      >
                        View on Google Maps →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          )}

          {tab === "gallery" && (
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
          )}
        </div>
      </section>

      {/* Other houses */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-[1320px] mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <span className="smallcaps text-warmth">Also in the Collection</span>
              <h2 className="font-display text-4xl md:text-5xl font-light mt-4">Two more.</h2>
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

