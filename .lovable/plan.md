## Home page round 2 edits

All changes confined to `src/routes/index.tsx`. Keep existing layout, fonts, cream palette, two-column structure, animation, and link styling.

### 1. Upload images as CDN assets

- `lovable-assets create --file /mnt/user-uploads/HOMEPAGE_COLLECTION_OF_HOME.jpg --filename collection-peninsula.jpg > src/assets/collection-peninsula.jpg.asset.json`
- `lovable-assets create --file /mnt/user-uploads/HOME_PAGE_BEYOND_THE_FRONT_DOOR.jpg --filename guide-bird-beach.jpg > src/assets/guide-bird-beach.jpg.asset.json`

### 2. Edits to `src/routes/index.tsx`

**A. Hero sub-line** — change "A small collection of homes on the West Coast." → "A small collection of holiday homes on the West Coast."

**B. Manifesto** — replace paragraph with:
> There are few places in the world where the ocean greets you at sunrise and bids you farewell at sunset. *Stay slowly.*

Keep "Stay slowly." in existing italic ocean-blue style.

**C. Replace "Things to Do / The coast, in motion" section with "Our Collection"** (same image-right / text-left layout):
- Kicker: `Our Collection` (warmth/gold)
- Heading: `Self-Catering Homes` (ocean blue — apply `text-ocean` to match existing blue header treatment used elsewhere; current display headings are ink — explicitly add `text-ocean` here per spec)
- Body: the supplied paragraph about St Helena Bay and Shelley Point.
- Link: `View the Collection →` → `/properties`
- Image: `collection-peninsula.jpg` asset

**D. Update Local Guide teaser** (image-left / text-right, already in place):
- Keep kicker "Local Guide"
- Heading: `The coast, in motion.`
- Body: "Long beaches and tidal pools, kayaks at first light, horses across the dunes, fairways above the sea, and unfussy local tables that close when the sun goes down."
- Keep `Explore the Guide →` link
- Image: `guide-bird-beach.jpg` asset (replace unsplash URL)

### Verification

Visit `/` in preview, confirm hero subline, manifesto copy, Our Collection section with peninsula image links to `/properties`, and Local Guide teaser shows bird-on-beach image with new copy.
