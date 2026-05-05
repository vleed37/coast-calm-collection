import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { useState } from "react";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "The Coastline, Curated — [BRAND]" },
      { name: "description", content: "Eat, drink, walk, watch, wander. The places we send people first." },
      { property: "og:title", content: "The Coastline, Curated — [BRAND]" },
      { property: "og:description", content: "The places we send people first." },
    ],
  }),
  component: GuidePage,
});

const filters = ["Eat", "Drink", "Walk", "Watch", "Wander"] as const;

const articles = [
  { cat: "Eat", title: "The bakery that opens at six.", desc: "A small door, a long line by quarter past. The croissants come out at 6:14, every morning.", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80" },
  { cat: "Walk", title: "A walk between the lighthouses.", desc: "Three hours along the cliff if you take it slow. Two if the wind is up. Take water.", img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=80" },
  { cat: "Eat", title: "Where to find the oysters.", desc: "A wooden shack, a chalkboard, a bucket of ice. Cash only. Closed Tuesdays.", img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1600&q=80" },
  { cat: "Watch", title: "The pelicans at five o'clock.", desc: "They come in low across the bay every evening. Sit on the rocks. Do nothing.", img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80" },
  { cat: "Drink", title: "A small wine list, well chosen.", desc: "Twelve bottles. Eleven from within an hour. The other one matters less.", img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=80" },
  { cat: "Wander", title: "The Saturday market at Paternoster.", desc: "Linen, fish, two kinds of honey. Get there before nine if you can.", img: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1600&q=80" },
];

function GuidePage() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="page-fade bg-cream">
      <Nav />
      <div className="pt-40 md:pt-48" />
      <section className="px-6 md:px-12 pb-16">
        <div className="max-w-[1320px] mx-auto">
          <Reveal>
            <span className="smallcaps text-warmth">Local Guide</span>
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl mt-4 font-light leading-[0.95]">
              The Coastline,<br /><em className="font-light">Curated.</em>
            </h1>
            <p className="mt-10 max-w-xl text-lg text-ink/80">A short list, kept short on purpose.</p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-[1320px] mx-auto flex flex-wrap gap-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(active === f ? null : f)}
              className={`smallcaps px-6 py-3 border transition-colors ${
                active === f ? "bg-ocean text-cream border-ocean" : "border-mist text-ink hover:border-ocean"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 pb-32">
        <div className="max-w-[1320px] mx-auto space-y-24 md:space-y-40">
          {articles
            .filter((a) => !active || a.cat === active)
            .map((a, i) => (
              <Reveal key={a.title}>
                <article className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <div className="overflow-hidden bg-mist aspect-[4/5]">
                    <img src={a.img} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04]" />
                  </div>
                  <div className="max-w-md">
                    <span className="smallcaps text-warmth">{a.cat}</span>
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mt-6 font-light leading-[1.1]">{a.title}</h2>
                    <p className="mt-6 text-lg text-ink/80">{a.desc}</p>
                    <a href="#" className="smallcaps text-ocean link-underline mt-8 inline-block">Read more →</a>
                  </div>
                </article>
              </Reveal>
            ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
