import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PropertyCard } from "@/components/site/PropertyCard";
import { EnquirySheet } from "@/components/site/EnquirySheet";
import { Lightbox } from "@/components/site/Lightbox";
import { findProperty, properties } from "@/data/properties";

export const Route = createFileRoute("/properties/$slug")({
  loader: ({ params }) => {
    const property = findProperty(params.slug);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.property.name} — [BRAND]` },
          { name: "description", content: loaderData.property.description },
          { property: "og:title", content: `${loaderData.property.name} — [BRAND]` },
          { property: "og:description", content: loaderData.property.description },
          { property: "og:image", content: loaderData.property.heroImage },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-display italic text-3xl">House not found.</p>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <p className="font-display italic text-2xl text-ocean">{error.message}</p>
    </div>
  ),
  component: PropertyPage,
});

function PropertyPage() {
  const { property } = Route.useLoaderData();
  const others = properties.filter((p) => p.id !== property.id).slice(0, 2);

  return (
    <div className="page-fade bg-cream">
      <Nav transparentOverHero />

      <section className="relative h-[80vh] w-full overflow-hidden">
        <img src={property.heroImage} alt={property.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-transparent" />
      </section>

      <section className="px-6 md:px-12 py-16 md:py-24 max-w-[1320px] mx-auto">
        <Reveal>
          <div className="grid md:grid-cols-3 gap-6 items-end pb-8 border-b border-mist">
            <span className="smallcaps text-warmth">{property.location}</span>
            <h1 className="font-display text-4xl md:text-6xl text-center font-light leading-[1]">{property.name}</h1>
            <span className="md:text-right text-ink/80">From <span className="text-ink">{property.fromPrice}</span> / night</span>
          </div>
        </Reveal>
      </section>

      {/* The Villa */}
      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-[1320px] mx-auto">
          <Reveal>
            <span className="smallcaps text-warmth">The Villa</span>
            <div className="grid md:grid-cols-2 gap-12 mt-10 relative">
              <p className="text-lg leading-[1.8] text-ink/85">{property.story[0]}</p>
              <p className="text-lg leading-[1.8] text-ink/85">{property.story[1]}</p>
              <blockquote className="md:col-span-2 font-display italic text-3xl md:text-4xl text-ocean text-center max-w-3xl mx-auto py-12 leading-[1.2]">
                "{property.pullQuote}"
              </blockquote>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gallery masonry */}
      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-[1320px] mx-auto">
          <Reveal>
            <span className="smallcaps text-warmth mb-10 block">Gallery</span>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6 [column-fill:_balance]">
              {property.gallery.map((src, i) => (
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
                        className={`w-full object-cover transition-transform duration-700 hover:scale-[1.04] ${i % 3 === 0 ? "aspect-[4/5]" : i % 3 === 1 ? "aspect-square" : "aspect-[3/4]"}`}
                      />
                    </div>
                  }
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Experience */}
      <section className="px-6 py-24 md:py-32 text-center">
        <Reveal>
          <p className="font-display text-3xl md:text-4xl lg:text-5xl text-ocean max-w-4xl mx-auto leading-[1.25] font-light">
            {property.experience}
          </p>
        </Reveal>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-24 max-w-[1320px] mx-auto">
        <Reveal>
          <span className="smallcaps text-warmth">The House Holds</span>
          <h2 className="font-display text-4xl md:text-5xl mt-4 font-light">Features</h2>
          <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-4 mt-12">
            {property.features.map((f) => (
              <li key={f} className="flex items-start gap-4 py-3 border-b border-mist text-ink/85">
                <span className="text-warmth font-light text-xl leading-none mt-1">+</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Booking info */}
      <section className="px-6 md:px-12 py-24 max-w-[1320px] mx-auto">
        <Reveal>
          <span className="smallcaps text-warmth">Booking Information</span>
          <div className="mt-10 max-w-2xl">
            {[
              ["Check-in", "From 14:00"],
              ["Check-out", "By 11:00"],
              ["Max Guests", String(property.guests)],
              ["Min Stay", property.minStay],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-5 border-b border-mist">
                <span className="smallcaps text-ink/60">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Other */}
      <section className="px-6 md:px-12 py-24 md:py-32 max-w-[1320px] mx-auto">
        <Reveal>
          <h2 className="font-display text-4xl md:text-5xl font-light mb-16">Other places you may love.</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {others.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </Reveal>
      </section>

      <Footer />

      <div className="fixed bottom-6 right-6 z-30">
        <EnquirySheet
          defaultProperty={property.id}
          trigger={
            <button className="bg-ocean text-cream px-8 py-4 smallcaps shadow-lg hover:bg-ink transition-colors">Enquire</button>
          }
        />
      </div>
      <Link to="/properties" className="hidden">back</Link>
    </div>
  );
}
