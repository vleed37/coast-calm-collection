## Round 2 content edits — Properties, Local Guide, Booking Policy

### 1. 37 Wanoo Drive cover image
- Upload via lovable-assets: `lovable-assets create --file /mnt/user-uploads/37_WANOO_COVER_IMAGE.jpeg --filename 37-wanoo-cover.jpg > src/assets/37-wanoo-cover.jpg.asset.json`
- Data update on `public.properties` where `slug='37-wanoo-drive'`: set both `setting_image` and `hero_image` to the new asset URL (mirroring the Sage & Salt approach — `setting_image` drives the listing card and detail hero).

### 2. Properties page — `src/routes/properties.tsx` (A)
Replace line 41 copy "Four houses, kept few on purpose. Each one offered for a few weeks each year." with:
"Explore our collection of self-catering West Coast properties, each offering comfort, privacy, and the perfect coastal escape."

### 3. Local Guide page — `src/routes/guide.tsx` (C + D)
- Replace the subheading paragraph (line 176) with: "A thoughtful selection of beaches, dining spots, and local experiences along the West Coast."
- Remove the eyebrow `<span className="smallcaps text-warmth">Section {num}</span>` (line 204) and the now-unused `num = String(i+1)...` line (186). Keep all other layout.

### 4. Booking Policy page — `src/routes/booking-policy.tsx` (E + F + G + H)
- **E**: Delete the entire "Reservations" `<Section>` block (lines 86–90) and remove the corresponding entry from the `faqGraph` structured data (line 61).
- **F**: Tighten vertical spacing — change the section list container `mt-20 space-y-12` → `mt-12 space-y-6`, and tighten each Section's bottom padding `pb-12` → `pb-6`.
- **G**: Replace Check-In & Check-Out body text (line 146) with: "Check-in from 2:00 PM. Check-out strictly by 10:00 AM. We kindly ask that guests adhere to the above times, so that our team can prepare the space flawlessly for our next arrivals. Any times outside of the above must please be arranged directly with the property manager." Also update the matching `faqGraph` `a` string so SEO mirrors the visible copy.
- **H**: Replace Documents body text (line 152) with: "All guests are required to sign our Terms & Conditions before arrival and submit a copy of their ID or driver's licence, along with confirmation of their vehicle details by the latest 24-hours before arrival."

### 5. Verification
- `/properties`: new intro line under "The Collection"; 37 Wanoo card shows the new cover.
- `/properties/37-wanoo-drive`: hero uses new cover.
- `/guide`: new subheading; "SECTION 01/02…" eyebrows gone, section titles and content intact.
- `/booking-policy`: starts with "Rates & Minimum Stay" after the intro; sections sit closer together; Check-In & Check-Out and Documents show the new wording.
