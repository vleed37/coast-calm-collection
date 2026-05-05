import { createFileRoute } from "@tanstack/react-router";
import { buildHead, itemListGraph } from "@/lib/seo";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { useState } from "react";

const filters = ["Eat", "Drink", "Walk", "Watch", "Wander"] as const;

const articles = [
  { cat: "Eat", title: "The bakery that opens at six.", desc: "A small unmarked door behind the post office. The line forms by quarter past. Croissants come out at six-fourteen, sourdough at half past. Bring cash and a basket — they sell out fast.", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80" },
  { cat: "Walk", title: "A walk between the lighthouses.", desc: "Three hours along the cliff path if you take it slow. Two if the wind is up. Take water, take a windbreaker, take your time. The peninsula does the rest.", img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=80" },
  { cat: "Eat", title: "Where to find the oysters.", desc: "A wooden shack at the back of the harbour, a chalkboard for prices, a galvanised bucket for ice. Cash only. Closed Tuesdays. The shucker's name is Andries.", img: "https://images.unsplash.com/photo-1642166805142-0426a75bf373?auto=format&fit=crop&w=1600&q=80" },
  { cat: "Watch", title: "The pelicans at five o'clock.", desc: "They come in low across the bay every evening from October to March. Sit on the rocks west of the slipway. Don't film it. Just watch.", img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80" },
  { cat: "Drink", title: "A small wine list, well chosen.", desc: "Eleven bottles, all from within an hour of the house. The bartender knows each grower by their first name. The other one matters less.", img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=80" },
  { cat: "Wander", title: "The Saturday market at Paternoster.", desc: "Linen, fish, two kinds of honey, hand-thrown ceramics. Get there before nine if you can. Coffee from the trailer in the corner. Stay until you've spoken to someone.", img: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1600&q=80" },
];

export const Route = createFileRoute("/guide")({
  head: () =>
    buildHead({
      title: "The Coastline, Curated — A West Coast Local Guide | [BRAND]",
      description:
        "Where to eat, drink, walk and watch on South Africa's West Coast. A short, considered local guide from people who live here.",
      path: "/guide",
      type: "article",
      structuredData: itemListGraph(
        "The Coastline, Curated",
        articles.map((a) => ({ name: a.title, description: a.desc, image: a.img })),
      ),
    }),
  component: GuidePage,
});

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
        <div className="max-w-[1320px] mx-auto">
          {articles
            .filter((a) => !active || a.cat === active)
            .map((a, i) => (
              <Reveal key={a.title}>
                <article className={`grid md:grid-cols-12 gap-10 md:gap-16 items-center py-16 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <div className="md:col-span-7 overflow-hidden bg-mist aspect-[4/5]">
                    <img src={a.img} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04]" />
                  </div>
                  <div className="md:col-span-5 flex flex-col justify-center max-w-md">
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
