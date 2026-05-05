import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { PropertyCard } from "@/components/site/PropertyCard";
import { Reveal } from "@/components/site/Reveal";
import { properties } from "@/data/properties";

export const Route = createFileRoute("/properties")({
  head: () =>
    buildHead({
      title: "The Collection — Three West Coast Villas | [BRAND]",
      description:
        "Three luxury self-catering villas on South Africa's West Coast. Beachfront and coastal locations, sleeping up to 14. View the full collection and enquire about availability.",
      path: "/properties",
      type: "website",
    }),
  component: PropertiesPage,
});

function PropertiesPage() {
  return (
    <div className="page-fade bg-cream min-h-screen">
      <Nav />
      <div className="pt-40 md:pt-48" />
      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-[1320px] mx-auto">
          <Reveal>
            <span className="smallcaps text-warmth">Houses</span>
            <h1 className="font-display text-6xl md:text-8xl mt-4 font-light leading-[0.95]">The Collection</h1>
            <p className="mt-8 max-w-xl text-lg text-ink/80">
              Three houses, kept few on purpose. Each one offered for a few weeks each year.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-40">
        <div className="max-w-[1320px] mx-auto grid md:grid-cols-2 gap-x-12 gap-y-20 md:pb-40">
          {properties.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <PropertyCard property={p} offset={i % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
