# Plan

## A. Prices — "From R1,500 / night"

- Migration updating `properties.from_price` to `R1,500` for the three live homes
  (Sage & Salt, Sky & Sea, 10 Seaview Close). 37 Wanoo Drive stays as-is.
- Update `PropertyCard.tsx` so the price line renders `From {fromPrice} / night`
  (currently just `From {fromPrice}`). Detail page (`properties_.$slug.tsx`)
  already shows `From {fromPrice} per night` — I'll align it to the same
  `/ night` wording so the brand reads consistently across card and detail.

Storing the bare number (`R1,500`) instead of the full phrase keeps JSON-LD's
`priceRange: "From R1,500 per night"` clean and avoids "/ night per night"
duplication in structured data.

## B. 37 Wanoo Drive cover image

- Upload `/mnt/user-uploads/10409_COVER.jpeg` via `lovable-assets create`
  → `src/assets/wanoo-cover.jpg.asset.json`.
- Migration updating `properties.hero_image` for `37-wanoo-drive` to the CDN
  `url` from that pointer file.

(Two migrations combined into one — single approval.)

## C. Properties grid — symmetrical & aligned

Rework `src/routes/properties.tsx` and `src/components/site/PropertyCard.tsx`:

**Grid (`properties.tsx`):**
- Replace the current `grid md:grid-cols-2 gap-x-12 gap-y-20` + per-card
  `translate-y-20/32` stagger with a clean equal-height grid:
  `grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 items-start`.
- Drop the `offset={i % 2 === 1}` prop entirely so every card sits at the
  same baseline.
- Cards become full-bleed within their column; no negative margins.

**Card (`PropertyCard.tsx`):**
- Remove the `offset` prop and translate-y classes.
- Wrap each card in a `flex flex-col h-full` container so equal-height rows
  align price/CTA at the bottom (`mt-auto` on the footer block).
- Image: change from `aspect-[3/4]` (tall, crops landscape photos) to a
  consistent landscape `aspect-[4/3]` with `object-cover` and
  `object-[center_60%]` framing. All four property hero photos are landscape,
  so 4:3 + cover shows the building/horizon without cutting the roofline or
  pool the way 3:4 does today. Image dimensions are now identical card-to-card.
  - I'm choosing `object-cover` (not `object-contain`) because contain would
    letterbox each photo at a different inset and break the "aligned, equal"
    look the client is asking for. 4:3 is the closest aspect to the actual
    photos, so cover crops are minimal. If the client still feels a specific
    photo loses something important, the fix is to swap that hero photo (or
    re-crop the source) rather than letterbox the whole grid. Flag if you'd
    prefer contain.
- Card body: location → name → beds/baths/guests stats → divider → price +
  "View Property →" — all visible above the fold within the card, regardless
  of column.
- Coming-soon variant gets the same shape (4:3, h-full, same body padding)
  so 37 Wanoo Drive aligns with the live homes.

**Home page**
- The home page no longer renders `PropertyCard` (removed last turn), so
  card changes only affect `/properties`.

## Verification

- Confirm in preview at desktop that the two rows line up evenly, full image
  visible (no roofline/pool clipping), price + CTA bottom-aligned.
- Confirm DB shows the new prices and the new 37 Wanoo Drive image URL.
