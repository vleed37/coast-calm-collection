export type Property = {
  id: string;
  name: string;
  location: string;
  beds: number;
  baths: number;
  guests: number;
  minStay: string;
  fromPrice: string;
  description: string;
  story: string[];
  pullQuote: string;
  experience: string;
  features: string[];
  heroImage: string;
  gallery: string[];
};

const u = (q: string, w = 1600) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=${w}&q=80`;

export const properties: Property[] = [
  {
    id: "driftwood-house",
    name: "Driftwood House",
    location: "Shelley Point",
    beds: 5,
    baths: 6,
    guests: 14,
    minStay: "2 nights",
    fromPrice: "R10,000",
    description: "A long, low house built around a courtyard of olive trees and bleached oak.",
    story: [
      "Driftwood House sits on the last dune before the rocks. The architects gave it one rule: keep the wind out, let everything else in. The result is a house that hums on a still morning and goes quiet at six.",
      "There is a long table that has seen four hundred dinners. There is a fireplace that takes a full arm of wood. The bedrooms face east. The bath in the main room faces nothing — only a window the height of the wall, and the sea beyond it.",
    ],
    pullQuote: "Salt on the railing at six-thirty. The rest of the day arrives slowly.",
    experience: "A house for long lunches and longer silences. Walk to the point at low tide. Cook for ten. Sleep with the windows open.",
    features: [
      "Heated lap pool",
      "Wood-burning fireplace",
      "Outdoor shower",
      "Walking distance to the beach",
      "Open kitchen, gas range",
      "Long oak dining table (seats 14)",
      "Air conditioning throughout",
      "Wi-Fi and library",
      "Weber and built-in braai",
      "Daily housekeeping on request",
      "Pet-friendly with notice",
      "Secure off-street parking",
    ],
    heroImage: u("photo-1613490493576-7fde63acd811"),
    gallery: [
      u("photo-1613490493576-7fde63acd811"),
      u("photo-1600585154340-be6161a56a0c"),
      u("photo-1505693416388-ac5ce068fe85"),
      u("photo-1600566753190-17f0baa2a6c3"),
      u("photo-1600210492486-724fe5c67fb0"),
      u("photo-1505691938895-1758d7feb511"),
    ],
  },
  {
    id: "salt-pavilion",
    name: "Salt Pavilion",
    location: "Britannia Bay",
    beds: 6,
    baths: 5,
    guests: 10,
    minStay: "3 nights",
    fromPrice: "R9,900",
    description: "Glass, lime-washed walls, and a roof that lifts like a sail above the bay.",
    story: [
      "Salt Pavilion was the architect's own house for nine years. He wanted a building that disappeared in the afternoon, when the light came in flat from the west and the whole pavilion turned the colour of the sand.",
      "It still does that. The kitchen opens to a deck the size of a small room. The pool is shallow and warm by noon. There is one armchair that everyone fights for, and a record player that still works.",
    ],
    pullQuote: "The kind of quiet you stop noticing after a day.",
    experience: "Wake to the bay. Walk the beach before breakfast. Read until lunch. Take the path down to the rocks at five.",
    features: [
      "Solar-heated pool",
      "Outdoor fireplace",
      "Vintage record player",
      "Direct beach access",
      "Chef's kitchen",
      "Fully glazed front facade",
      "Indoor-outdoor shower",
      "Ceiling fans, sea-cooled",
      "Bicycles for guests",
      "Stocked pantry on arrival",
      "Concierge on call",
      "Underground parking for four",
    ],
    heroImage: u("photo-1512917774080-9991f1c4c750"),
    gallery: [
      u("photo-1512917774080-9991f1c4c750"),
      u("photo-1600607687939-ce8a6c25118c"),
      u("photo-1505693416388-ac5ce068fe85"),
      u("photo-1493809842364-78817add7ffb"),
      u("photo-1600596542815-ffad4c1539a9"),
      u("photo-1494526585095-c41746248156"),
    ],
  },
  {
    id: "cape-aerie",
    name: "Cape Aerie",
    location: "St Helena Bay",
    beds: 4,
    baths: 4,
    guests: 8,
    minStay: "2 nights",
    fromPrice: "R12,500",
    description: "A cliffside house of stone and weathered cedar, perched above the mouth of the bay.",
    story: [
      "Cape Aerie was built on a rock that had no business holding a house. It took two years and a stubborn engineer. What you get for that stubbornness is a view that tilts forty degrees in the morning, and a sunset the same shape every night.",
      "The bedrooms are small, on purpose. The living room is not. There is a copper bath beside the window. There is a fireplace at each end of the house, because the wind matters here.",
    ],
    pullQuote: "The bay arrives in the room before you do.",
    experience: "Stay close. Cook simply. Watch the boats come in. Take the long path down to the cove at dawn.",
    features: [
      "Floor-to-ceiling sea-facing glass",
      "Copper soaking bath",
      "Two fireplaces",
      "Cliff-top firepit",
      "Heated stone floors",
      "Cedar-clad facade",
      "Private path to cove",
      "Compact gym",
      "Wine cellar",
      "Outdoor dining for ten",
      "Underfloor heating",
      "Telescope on the deck",
    ],
    heroImage: u("photo-1518780664697-55e3ad937233"),
    gallery: [
      u("photo-1518780664697-55e3ad937233"),
      u("photo-1556909114-f6e7ad7d3136"),
      u("photo-1505691938895-1758d7feb511"),
      u("photo-1552321554-5fefe8c9ef14"),
      u("photo-1502082553048-f009c37129b9"),
      u("photo-1495954484750-af469f2f9be5"),
    ],
  },
];

export const findProperty = (slug: string) => properties.find((p) => p.id === slug);
