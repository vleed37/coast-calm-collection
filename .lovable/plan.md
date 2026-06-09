# Plan

## A. Brand rename — "Lone Bull Properties" → "Lone Bull Rentals"

Replace every occurrence (verbatim, case-preserving) across:

- `src/components/site/Nav.tsx` — header wordmark
- `src/components/site/Footer.tsx` — footer wordmark + © line
- `src/components/admin/AdminShell.tsx`, `src/routes/admin.tsx`, `src/routes/admin_.login.tsx`
- `src/lib/seo.ts` — `SITE_NAME` constant (drives `og:site_name`, JSON-LD `LodgingBusiness.name`, `WebSite.name`)
- Every route `head()` title that includes the brand: `src/routes/index.tsx`, `properties.tsx`, `properties_.$slug.tsx`, `guide.tsx`, `contact.tsx`, `booking-policy.tsx`
- `public/llms.txt` — heading + body references

Canonical domain (`SITE_URL = https://lonebullrentals.co.za`) is already correct — no change.

Tagline "Made on the West Coast." stays.

## B. Home hero

- Add the uploaded photo as a Lovable Asset (`src/assets/hero-coast.jpg.asset.json` via `lovable-assets create` from `/mnt/user-uploads/HOME_PAGE_-_COVER_PHOTO.jpg`), import in `src/routes/index.tsx`, use as the hero `<img src>` (replacing the Unsplash villa shot). Also update the `<link rel="preload">` / `og:image` for `/` to this asset URL so the LCP image preloads correctly.
- Hero copy: the current headline is "Luxury West Coast / Villa Rentals." Per your instruction, set it to **"Where the coastline pauses."** with the existing sub-line kept ("A small collection of homes on the West Coast."). Flag: your message says "keep existing exactly" but the live copy is different — I'll set it to "Where the coastline pauses." since that's the wording you quoted. Tell me if you'd rather leave the current headline untouched.
- Wordmark size in `Nav.tsx`: bump from `text-2xl tracking-[0.3em]` to roughly `text-3xl md:text-4xl tracking-[0.25em]` so it reads as the clear focal point.

## C. Header

- Add an **Enquire Now** button to the right side of the nav bar in `Nav.tsx`. Styling: solid `bg-ocean text-cream` on the scrolled/solid state, outlined `border-cream/60 text-cream` on the transparent-over-hero state, `smallcaps` tracking — matches the existing Enquire buttons on the home CTA and property pages. Links to `/contact` via TanStack `<Link>`.
- Nav links: bump from default (`text-sm` smallcaps) to `text-[0.8rem] md:text-[0.85rem]` — a small, deliberate increase.
- Layout shifts from centered stack to: wordmark left, nav center, Enquire button right (still wraps cleanly on mobile).

## D. Home: remove properties grid, add Activities teaser

In `src/routes/index.tsx`:

- Remove the entire `FEATURED` section (the "The Collection / Four houses." block with `<PropertyCard>` grid and "View all →" link). Also drop the now-unused `fetchPublishedProperties` loader, `PropertyCard` import, and `Route.useLoaderData()` call.
- Insert a new **Activities** section in its place, mirroring the existing "Beyond the front door / Local Guide" two-column teaser but mirrored: **image on the right, text on the left**.
  - Kicker: `Things to Do`
  - Heading: *"The coast, in motion."* (display italic, matches existing tone)
  - Body: ~2 short sentences covering beaches, kayaking, horse riding, golf and local restaurants — kept brief and elegant.
  - CTA: smallcaps link "Explore the Guide →" to `/guide` (button-styled to match the existing CTA aesthetic — bordered link or `bg-ocean` button, consistent with the page CTA at the bottom).
  - Image: a West Coast coastal/beach placeholder from Unsplash (same source pattern already used elsewhere). Easy to swap later.

## Out of scope (unchanged)

- The Properties page itself, property data, JSON-LD for properties.
- Existing fonts, palette (`cream`, `ocean`, `warmth`, `ink`, `mist`), `Footer`, all other route content.

## Verification

After build, I'll confirm:
1. Every changed file's brand string.
2. Home page no longer renders any `PropertyCard` (and no leftover loader).
3. Hero uses the new asset; nav shows the Enquire button.
