import type { Property } from "@/data/properties";

// TODO: replace at deploy with the live custom domain
export const SITE_URL = "https://placeholder-domain.com";
export const SITE_NAME = "[BRAND]";
export const LOCALE = "en_ZA";
export const ORG_DESCRIPTION =
  "Luxury self-catering villa rentals on South Africa's West Coast. Direct bookings, three properties, hand-picked locations from Shelley Point to St Helena Bay.";

export const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&h=630&q=80";

export const PROPERTY_GEO: Record<string, { lat: number; lng: number }> = {
  "driftwood-house": { lat: -32.7378, lng: 17.9967 },
  "salt-pavilion": { lat: -32.7956, lng: 17.8836 },
  "cape-aerie": { lat: -32.7589, lng: 18.0369 },
};

export type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "product";
  keywords?: string;
  structuredData?: object | object[];
};

/** Build a TanStack Start `head()` payload — meta + canonical + preload + JSON-LD scripts. */
export function buildHead(input: SeoInput) {
  const {
    title,
    description,
    path,
    image = DEFAULT_OG_IMAGE,
    type = "website",
    keywords,
    structuredData,
  } = input;

  const url = `${SITE_URL}${path}`;

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:url", content: url },
    { property: "og:type", content: type },
    { property: "og:locale", content: LOCALE },
    { property: "og:site_name", content: SITE_NAME },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
  if (keywords) meta.push({ name: "keywords", content: keywords });

  const links: Array<Record<string, string>> = [
    { rel: "canonical", href: url },
    { rel: "preload", as: "image", href: image },
  ];

  const blocks = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];

  const scripts = blocks.map((block) => ({
    type: "application/ld+json",
    children: JSON.stringify(block),
  }));

  return { meta, links, scripts };
}

export function truncateDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\-]+$/, "") + "…";
}

/* ------------ JSON-LD builders ------------ */

export function organizationGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LodgingBusiness",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        description: ORG_DESCRIPTION,
        image: DEFAULT_OG_IMAGE,
        priceRange: "R9,900–R12,500 per night",
        address: {
          "@type": "PostalAddress",
          addressRegion: "Western Cape",
          addressCountry: "ZA",
        },
        areaServed: [
          { "@type": "Place", name: "Shelley Point" },
          { "@type": "Place", name: "Britannia Bay" },
          { "@type": "Place", name: "St Helena Bay" },
          { "@type": "Place", name: "Paternoster" },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-ZA",
      },
    ],
  };
}

export function lodgingGraph(property: Property) {
  const geo = PROPERTY_GEO[property.id];
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${SITE_URL}/properties/${property.id}/#lodging`,
    name: property.name,
    description: property.description,
    image: [property.heroImage, ...property.gallery],
    url: `${SITE_URL}/properties/${property.id}`,
    priceRange: `From ${property.fromPrice} per night`,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressRegion: "Western Cape",
      addressCountry: "ZA",
    },
    ...(geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: geo.lat,
        longitude: geo.lng,
      },
    }),
    numberOfRooms: property.beds,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: property.guests,
    },
    amenityFeature: property.features.map((f) => ({
      "@type": "LocationFeatureSpecification",
      name: f,
      value: true,
    })),
    checkinTime: "14:00",
    checkoutTime: "11:00",
    petsAllowed: "By prior arrangement",
  };
}

export function breadcrumbGraph(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function faqGraph(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function itemListGraph(
  name: string,
  items: Array<{ name: string; description?: string; image?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Article",
        headline: it.name,
        description: it.description,
        image: it.image,
        publisher: { "@type": "Organization", name: SITE_NAME },
      },
    })),
  };
}