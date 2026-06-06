import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { buildHead, itemListGraph } from "@/lib/seo";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { useState } from "react";
import { fetchPublishedArticles } from "@/lib/queries/guide";

const filters = ["Eat", "Drink", "Walk", "Watch", "Wander"] as const;

export const Route = createFileRoute("/guide")({
  loader: () => fetchPublishedArticles(),
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  head: ({ loaderData }) =>
    buildHead({
      title: "A West Coast Local Guide | Lone Bull Properties",
      description:
        "Where to eat, drink, walk and watch on South Africa's West Coast. A short, considered local guide from people who live here.",
      path: "/guide",
      type: "article",
      structuredData: itemListGraph(
        "The Coastline, Curated",
        (loaderData ?? []).map((a) => ({ name: a.title, description: a.description, image: a.image })),
      ),
    }),
  component: GuidePage,
});

function GuidePage() {
  const articles = Route.useLoaderData() as Awaited<ReturnType<typeof fetchPublishedArticles>>;
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
            .filter((a) => !active || a.category === active)
            .map((a, i) => (
              <Reveal key={a.id}>
                <article className={`grid md:grid-cols-12 gap-10 md:gap-16 items-center py-16 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <div className="md:col-span-7 overflow-hidden bg-mist aspect-[4/5]">
                    <img src={a.image} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04]" />
                  </div>
                  <div className="md:col-span-5 flex flex-col justify-center max-w-md">
                    <span className="smallcaps text-warmth">{a.category}</span>
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mt-6 font-light leading-[1.1]">{a.title}</h2>
                    <p className="mt-6 text-lg text-ink/80">{a.description}</p>
                    <a href="#" className="smallcaps text-ocean link-underline mt-8 inline-block">Read more about {a.title} →</a>
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
