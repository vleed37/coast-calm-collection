# Plan — Build out the Local Guide page

Rewrite `src/routes/guide.tsx` to render the eight real sections supplied by the client, keeping the existing editorial alternating-image layout and the cream/serif design language.

## Images

Upload all 8 attached images via `lovable-assets` into `src/assets/` as `.asset.json` pointers, then import them by name. Mapping:

| Section | Image |
| --- | --- |
| Beaches | aerial of Golden Mile (image-2) |
| Kayaking | kayak over kelp (image-3) |
| Horse Riding | horse on beach (image-4) |
| Golf | 9-hole green & flag (image-5) |
| Shelley Point Estate Amenities | tennis courts (image-6) |
| Local Treats | milkshake / café shot (image-7) |
| Around the corner — Paternoster | white-cottages & boat (image-8) |
| Further on | wildflowers & coast (image-9) |

## Page structure

1. Keep the existing hero ("Local Guide / The Coastline, Curated.") but swap the strapline for one short sentence that frames the guide as places the owners actually recommend.
2. **Remove** the filter chip row (Eat/Drink/Walk/Watch/Wander) and the DB-driven `fetchPublishedArticles` loader/render — they don't fit the supplied content and create empty UI. The DB articles aren't referenced elsewhere so the loader can go.
3. Render the 8 sections in the order the client specified, using a single `Section` sub-component that alternates image left / image right per index — the same pattern already in use on this page.

## Section component

Two columns on md+, stacked on mobile:
- Image column: `aspect-[4/5]` cover crop with subtle hover scale (matches existing styling).
- Text column:
  - `smallcaps text-warmth` kicker (section eyebrow, e.g. "Section 02")
  - `font-display` headline for the section name
  - Body paragraph(s) in `text-ink/80`
  - Optional italic note (used for the "Only accessible to guests…" line on Shelley Point Estate Amenities)
  - Contact block: phone/email/website rendered with `smallcaps text-ink/60` labels and an `font-display` value; phone → `tel:` link, email → `mailto:`, website → `target="_blank" rel="noopener noreferrer"`.
  - For the three directory sections (Local Treats, Around the corner, Further on): render a clean `<ul>` of `<li>` rows with the place name in body type and the phone number on the right (or beneath on mobile) as a `tel:` link. "Further on" gets two sub-headings (Velddrif / Langebaan) and a closing line listing the other attractions.

## Copy

All copy taken verbatim from the prompt. No invented places or numbers. Web links open in a new tab; phone numbers are dialable.

## SEO

Update `head()`:
- Title stays "A West Coast Local Guide | Lone Bull Rentals".
- Description rewritten to reflect the real content (beaches, kayaking, horse riding, golf, Paternoster, Velddrif, Langebaan).
- `og:image` set to the Beaches hero (Golden Mile) so social previews show a real West Coast shot.
- Replace `itemListGraph` of DB articles with an `itemListGraph` built from the eight static section names so search engines see the structure.

## Files touched
- `src/routes/guide.tsx` — full rewrite of the body.
- `src/assets/guide-*.png.asset.json` — 8 new asset pointers.

## Not touched
- `src/lib/queries/guide.ts` and the `articles` table stay in place (still used by `/admin`); the public route just no longer reads from them.
- Nav, Footer, hero design language, fonts, palette.

## Verification
- Open `/guide`, confirm all 8 sections render in order with the right images and alternating layout.
- Click a phone number on mobile → dialer prompt. Click a website → opens in new tab.
- Lighthouse: page still has a single H1, semantic headings, and a JSON-LD ItemList.
