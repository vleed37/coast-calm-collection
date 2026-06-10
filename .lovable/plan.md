## Property detail pages — round 2 edits

### 1. Upload assets

- `lovable-assets create --file /mnt/user-uploads/SAGE_SALT_COVER_IMAGE.jpg --filename sage-and-salt-cover.jpg > src/assets/sage-and-salt-cover.jpg.asset.json`
- `lovable-assets create --file /mnt/user-uploads/WEST_COAST_MAP_1.png --filename west-coast-map.png > src/assets/west-coast-map.png.asset.json`

### 2. Database migration

Add `map_url` to `public.properties`:

```sql
ALTER TABLE public.properties ADD COLUMN map_url text;
```

Then content updates (same migration):

**Sage & Salt** — replace cover (`setting_image` drives both hero and listing card per current mapping) and update features array:
- `setting_image` → new sage-and-salt asset URL
- `features` → remove `"2-bedroom self-catering home, sleeps up to 4 guests"` and `"2 modern bathrooms"`; prepend three new lines: `"Main bedroom: 1 King bed and en-suite bathroom"`, `"Second bedroom: 2 Single beds"`, `"1 full bathroom"`.

**Sky & Sea** — features only, same three-line replacement.

**10 Seaview Close** — update `setting_copy` to the new Shelley Point Estate write-up; update the `experience_vignettes` jsonb so the "Estate Lifestyle" body has the contact line `(022 742 1037 · info@... · ...)` stripped, keeping the descriptive text.

### 3. `src/lib/queries/properties.ts`

Add `mapUrl: string | null` to the `Property` type; map from `row.map_url ?? null` in `mapRow`.

### 4. `src/components/admin/PropertyForm.tsx`

Add `map_url: z.string().url().or(z.literal("")).optional()` to schema, default `""`, register in `defaultValues`, load from `data.map_url ?? ""` in reset, include in `onSubmit` payload (`map_url: v.map_url || null`). Add a new field "Google Maps URL" in the **The Setting** section.

### 5. `src/routes/properties_.$slug.tsx`

**Overview tab (A + B)** — prepend a new booking block before "The Home":
- Kicker `Booking` (keep), heading **removed** (no "Stays here.").
- Same Check-In / Check-Out / Maximum Guests / Minimum Stay rows.
- "Enquire about this house" button.
- Followed by existing "The Home" / story / pull-quote / "The Experience" content.

**Details tab** — remove the entire booking sub-block (lines ~272–300). Tab now ends after the features list.

**Location tab (D)** — replace the `<CoastMap pin={pin} />` block with:
- `<img src={westCoastMapAsset.url} alt="Map of South Africa's West Coast" />` (constrained max-w-xl mx-auto)
- If `property.mapUrl` is truthy, render below: `<a href={property.mapUrl} target="_blank" rel="noopener noreferrer" className="… bg-ocean text-cream px-10 py-4 smallcaps hover:bg-ink transition-colors inline-block">View on Google Maps →</a>`. Hidden when empty.
- Remove the now-unused `CoastMap` component, `PROPERTY_PINS` map, and `pin` derivation.

### 6. Verification

- `/properties/sage-and-salt`: cover image is the new pergola photo; Overview tab leads with booking box (no "Stays here."); Details tab has no booking box; Rooms tab shows the three new room points first; Location tab shows the map image (no button until `map_url` is set in admin).
- `/properties/sky-and-sea`: Rooms tab shows the three new room points; map image on Location tab.
- `/properties/10-seaview-close`: Location write-up is the new estate paragraph; Estate Lifestyle vignette no longer has the contact details; Rooms tab unchanged; map image on Location tab.
- `/admin/properties/<id>`: new "Google Maps URL" field saves and reloads.
