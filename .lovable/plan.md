# Plan — Property detail page restructure with tabs

Applies to all three live property routes (rendered by `src/routes/properties_.$slug.tsx`).

## A. Hero — 20% shorter
`h-[90vh]` → `h-[72vh]` so the masthead (name + location + specs + tabs) lands above the fold.

## B. Location subtitle on two lines
The DB already stores `location` as `"Steenbergs Cove Estate, St Helena Bay"` / `"Shelley Point Estate, St Helena Bay"`. I'll split on the first comma in the component and render the estate on line 1, the town on line 2 — no DB change, no hard-coding.

## C. Specs above the gold line
Reorder the masthead block: name → location (two lines, centered) → beds · baths · guests · min-stay row → then the gold/`border-mist` divider.

## D. Tabs — in-place swap
Below the divider, a tab bar with `Overview · Rooms · Details · Location · Gallery`.

**Behaviour:** I'll implement the **in-place swap** (preferred option). A `useState<TabKey>` drives which panel renders; the hero, name, location, specs and tab bar stay mounted at the top of the page and only the area beneath the tabs re-renders.

**Tab styling:** outlined `border border-ocean text-ocean` rectangles, smallcaps label, equal padding. Active tab → filled `bg-ocean text-cream`. Mobile: horizontal scroll row.

**Content mapping (using existing DB fields):**

| Tab | Source on the current page |
| --- | --- |
| Overview | "The Villa" intro/story paragraphs (renamed to **"The Home"**) + the inline pull quote + the existing "The Experience" vignettes (these are the headline experience copy) |
| Rooms | Beds/baths/guests breakdown + any items in `features` matching `/bed|bath|kitchen|cook|appliance|linen/i`, grouped under Bedrooms & Bathrooms / Kitchen subheadings. **Flag:** there's no dedicated rooms/kitchen copy in the data model — I'm deriving from `features` so the tab isn't empty. If the client wants real prose here, we'll need to add a `rooms_copy` / `kitchen_copy` field and admin UI; I'll list it as a follow-up rather than fabricate copy. |
| Details | Full `features` grid ("Everything in place.") + booking facts (Check-In 14:00, Check-Out 10:00, Max Guests, Min Stay) + the "Enquire about this house" button |
| Location | "The Setting" image + `settingCopy` paragraphs + "Explore the guide →" link + the `CoastMap` |
| Gallery | Existing masonry gallery with the Lightbox trigger |

## E. Cleanups
- Rename "The Villa" kicker to **"The Home"**.
- Remove the standalone full-width **pull-quote band** (section 5) — it's a duplicate of the quote already shown inside Overview; that's clearly filler.
- Tighten vertical rhythm: section paddings drop from `py-32 md:py-40` and `py-24 md:py-32` to a consistent `py-16 md:py-20` inside tab panels (the masthead and tab bar already provide visual separation).
- Keep the "Also in the Collection / Two more" section but render it **outside the tab system** below the tab content with a single `py-20` so it's not a giant blank gap.
- Keep the floating "Enquire" CTA (it appears once the hero is scrolled past).

**Items I will NOT delete without confirmation** (in case they're real content):
- "Also in the Collection" related-houses block — keeping, tightened.
- The `settingImage` (used inside Location tab).
- The map (used inside Location tab).

If anything else was marked for removal in the client's notes that I'm not seeing in code, list them in your reply and I'll remove on the next pass.

## Technical notes

- Tab state lives in `useState`; only the active panel is rendered (cleaner DOM, lighter paint). JSON-LD already carries the long description so SEO is unaffected.
- The masthead gets an `id="top"` and is plain document flow — it doesn't actually become `position: fixed`; "stays put" means it stays at the top of the page and does not re-render between tab clicks. Switching tabs scrolls to the masthead so the user lands at the top of the freshly-loaded section.
- No DB migrations, no route file path changes, no changes to `Nav` / `Footer` / `PropertyCard`.

## Files touched
- `src/routes/properties_.$slug.tsx` — the entire restructure.

## Verification
- Open `/properties/sage-and-salt`, `/properties/sky-and-sea`, `/properties/10-seaview-close`: confirm hero + name + specs + tabs visible without scrolling on a 1080-tall viewport; switching tabs updates only the panel; location reads on two lines per property.
