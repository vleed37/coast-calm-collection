import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { buildHead, itemListGraph } from "@/lib/seo";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import beachesImg from "@/assets/guide-beaches.png.asset.json";
import kayakingImg from "@/assets/guide-kayaking.png.asset.json";
import horseImg from "@/assets/guide-horse-riding.png.asset.json";
import golfImg from "@/assets/guide-golf.png.asset.json";
import amenitiesImg from "@/assets/guide-amenities.png.asset.json";
import treatsImg from "@/assets/guide-local-treats.png.asset.json";
import paternosterImg from "@/assets/guide-paternoster.png.asset.json";
import furtherImg from "@/assets/guide-further-on.png.asset.json";

type Contact = { label: "Tel" | "Email" | "Website"; value: string; href: string };
type DirectoryItem = { name: string; tel?: string; note?: string };
type DirectoryGroup = { heading?: string; items: DirectoryItem[] };

const SECTIONS = [
  {
    id: "beaches",
    title: "Beaches",
    image: beachesImg.url,
    body: [
      "Shelley Point and St Helena Bay offer access to some of the West Coast's most stunning stretches of sand — Golden Mile Beach, Shelley Point Kayak Beach, Flagship Beach, Hannasbaai Beach, Sandy Point Beach, Vioolbaai and Maalbaai Beach.",
    ],
  },
  {
    id: "kayaking",
    title: "Kayaking",
    image: kayakingImg.url,
    body: [
      "Enjoy an early-morning kayak session at Shelley Point — perfect for families and couples alike.",
    ],
    note: "Book your experience with Billy Fisher.",
    contacts: [{ label: "Tel", value: "082 805 5363", href: "tel:+27828055363" }] as Contact[],
  },
  {
    id: "horse-riding",
    title: "Horse Riding",
    image: horseImg.url,
    body: [
      "Located between Stompneusbaai and Paternoster, Drikus Horse Trails was voted one of the Top 6 Best Horse Trails in South Africa. Perfect for riders from beginner to experienced, and a wonderful way to explore the beauty of the Cape West Coast.",
    ],
    contacts: [
      { label: "Tel", value: "082 748 5596", href: "tel:+27827485596" },
      { label: "Website", value: "paternosterhorsetrails.co.za", href: "https://www.paternosterhorsetrails.co.za/" },
    ] as Contact[],
  },
  {
    id: "golf",
    title: "Golf",
    image: golfImg.url,
    body: [
      "Shelley Point Estate is home to a 9-hole links golf course, managed by the Shelley Point Home Owners Association. Contact them to arrange bookings and confirm fees.",
    ],
    contacts: [
      { label: "Tel", value: "022 742 1037", href: "tel:+27227421037" },
      { label: "Email", value: "info@shelleypointcountryclub.co.za", href: "mailto:info@shelleypointcountryclub.co.za" },
      { label: "Website", value: "shelleypointcountryclub.co.za", href: "https://shelleypointcountryclub.co.za/" },
    ] as Contact[],
  },
  {
    id: "amenities",
    title: "Shelley Point Estate Amenities",
    image: amenitiesImg.url,
    body: [
      "Estate amenities include tennis courts, bowls greens, play parks, putt-putt and a five-a-side soccer field, alongside a bistro and bar in the clubhouse — all owned and managed by the Shelley Point Home Owners Association.",
    ],
    note: "Only accessible to guests staying within Shelley Point Estate.",
    contacts: [
      { label: "Tel", value: "022 742 1037", href: "tel:+27227421037" },
      { label: "Email", value: "info@shelleypointcountryclub.co.za", href: "mailto:info@shelleypointcountryclub.co.za" },
      { label: "Website", value: "shelleypointcountryclub.co.za", href: "https://shelleypointcountryclub.co.za/" },
    ] as Contact[],
  },
  {
    id: "local-treats",
    title: "Local Treats",
    image: treatsImg.url,
    intro: "A collection of our favourite spots.",
    directory: [
      {
        items: [
          { name: "Alegria Restaurant", tel: "082 238 2410" },
          { name: "Harbour View Restaurant", tel: "022 125 0429" },
          { name: "Whale's Tail Restaurant", tel: "064 805 7180" },
          { name: "St Helena Bay Nursery & Coffee Shop", tel: "022 736 1564" },
          { name: "B. P. Marine Fish Products", tel: "022 736 1246" },
          { name: "De Palm Lifestyle Centre", note: "Local stores and coffee shops." },
        ],
      },
    ] as DirectoryGroup[],
  },
  {
    id: "paternoster",
    title: "Around the corner",
    image: paternosterImg.url,
    intro: "Paternoster — a short twenty-minute drive.",
    directory: [
      {
        items: [
          { name: "Paternoster Hotel", tel: "022 752 2703" },
          { name: "Gaaitjie Restaurant", tel: "076 964 2595" },
          { name: "Noisy Oyster Restaurant", tel: "022 752 2196" },
          { name: "Leeto Restaurant", tel: "022 125 0675" },
          { name: "Cathy's Kitchen Paternoster", tel: "066 253 4881" },
          { name: "Paternoster Waterfront", note: "Explore the beauty and heritage of the village." },
        ],
      },
    ] as DirectoryGroup[],
  },
  {
    id: "further-on",
    title: "Further on",
    image: furtherImg.url,
    intro: "Worth the drive.",
    directory: [
      {
        heading: "Velddrif — forty-minute drive",
        items: [
          { name: "Port Owen Sailing Charters", tel: "082 895 5593" },
          { name: "Charlie's Brewhouse", tel: "076 038 3632" },
        ],
      },
      {
        heading: "Langebaan — forty-five-minute drive",
        items: [
          { name: "Die Strandloper Restaurant", tel: "083 227 7195" },
          { name: "Mykonos Casino", tel: "022 707 6970" },
          { name: "Thali Thali Game Lodge", tel: "082 372 8637" },
        ],
      },
    ] as DirectoryGroup[],
    footer: "Other attractions: West Coast National Park, West Coast Fossil Park and Darling Olives.",
  },
] as const;

function telHref(tel: string) {
  const digits = tel.replace(/\s+/g, "");
  if (digits.startsWith("0")) return `tel:+27${digits.slice(1)}`;
  return `tel:${digits}`;
}

export const Route = createFileRoute("/guide")({
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  head: () =>
    buildHead({
      title: "A West Coast Local Guide | Lone Bull Rentals",
      description:
        "Beaches, kayaking, horse riding, golf and the best places to eat around Shelley Point, St Helena Bay, Paternoster, Velddrif and Langebaan — a considered guide from people who know the coast.",
      path: "/guide",
      type: "article",
      image: beachesImg.url,
      structuredData: itemListGraph(
        "The Coastline, Curated",
        SECTIONS.map((s) => ({ name: s.title, description: ("body" in s && s.body?.[0]) || ("intro" in s && s.intro) || s.title, image: s.image })),
      ),
    }),
  component: GuidePage,
});

function GuidePage() {
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
            <p className="mt-10 max-w-xl text-lg text-ink/80">
              The beaches, kayaks, horses, fairways and tables we send our own guests to — kept short on purpose.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-32">
        <div className="max-w-[1320px] mx-auto">
          {SECTIONS.map((s, i) => {
            const reverse = i % 2 === 1;
            const num = String(i + 1).padStart(2, "0");
            return (
              <Reveal key={s.id}>
                <article
                  id={s.id}
                  className={`grid md:grid-cols-12 gap-10 md:gap-16 items-center py-16 md:py-20 ${
                    reverse ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="md:col-span-6 overflow-hidden bg-mist aspect-[4/5]">
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                    />
                  </div>
                  <div className="md:col-span-6 flex flex-col justify-center">
                    <span className="smallcaps text-warmth">Section {num}</span>
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mt-5 font-light leading-[1.1]">
                      {s.title}
                    </h2>

                    {"intro" in s && s.intro && (
                      <p className="font-display italic text-xl md:text-2xl text-ocean mt-5 leading-[1.4]">
                        {s.intro}
                      </p>
                    )}

                    {"body" in s && s.body?.map((p, j) => (
                      <p key={j} className="mt-5 text-lg leading-[1.75] text-ink/80">{p}</p>
                    ))}

                    {"note" in s && s.note && (
                      <p className="mt-5 font-display italic text-ink/70">{s.note}</p>
                    )}

                    {"contacts" in s && s.contacts && (
                      <dl className="mt-6 space-y-2">
                        {s.contacts.map((c) => (
                          <div key={c.label} className="flex gap-4 items-baseline">
                            <dt className="smallcaps text-ink/60 min-w-[64px]">{c.label}</dt>
                            <dd>
                              <a
                                href={c.href}
                                target={c.label === "Website" ? "_blank" : undefined}
                                rel={c.label === "Website" ? "noopener noreferrer" : undefined}
                                className="text-ink hover:text-ocean transition-colors link-underline"
                              >
                                {c.value}
                              </a>
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    {"directory" in s && s.directory && (
                      <div className="mt-6 space-y-8">
                        {s.directory.map((g, gi) => (
                          <div key={gi}>
                            {g.heading && (
                              <h3 className="smallcaps text-warmth mb-3">{g.heading}</h3>
                            )}
                            <ul className="divide-y divide-mist">
                              {g.items.map((it) => (
                                <li key={it.name} className="py-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 justify-between">
                                  <span className="text-ink">{it.name}</span>
                                  {it.tel ? (
                                    <a
                                      href={telHref(it.tel)}
                                      className="font-display text-ink/80 hover:text-ocean transition-colors tabular-nums"
                                    >
                                      {it.tel}
                                    </a>
                                  ) : it.note ? (
                                    <span className="font-display italic text-ink/60 text-sm">{it.note}</span>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {"footer" in s && s.footer && (
                      <p className="mt-8 text-ink/70 italic leading-[1.7]">{s.footer}</p>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
