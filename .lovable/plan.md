# Separate Contact and Enquiry pages

## Assets
Upload both uploaded images via `lovable-assets` from `/mnt/user-uploads/`:
- `CONTACT_US_PAGE.jpg` → `src/assets/contact-cover.jpg.asset.json` (replaces existing contact-cover, used on new info Contact page — image of boulders + tidal pool)
- `ENQUIRY_PAGE.jpg` → `src/assets/enquire-cover.jpg.asset.json` (used on new enquire form page — aerial of rocks + kayak)

## Routes

**New `src/routes/enquire.tsx`** — copy current contact form page verbatim, but:
- route `/enquire`, title "Enquire | Lone Bull Rentals"
- import and use `enquireCover` for the left image
- eyebrow "Enquire", heading "Begin a conversation."
- keeps `<EnquiryForm>` exactly as-is

**Rewrite `src/routes/contact.tsx`** — same split layout shell (Nav, image left, content right, Footer, cream palette, same heading scale), no form. Right column contains:
- Eyebrow "Contact", h1 "Get in touch."
- Email block: "Get in touch" small label + `rental@lonebullgroup.co.za` as `mailto:` link
- Operating Hours block (Mon–Fri 08:00–16:00; Sat/Sun/PH 08:30–12:00)
- Head Office Location block (Waterfront Terraces, Tyger Waterfront, Bellville, Cape Town, South Africa)
- Connect block: Facebook icon (lucide `Facebook`) link to the FB URL, `target="_blank" rel="noreferrer noopener"`
- Image left uses the new contact cover

## Navigation

**`src/components/site/Nav.tsx`**
- Replace links array with: Home, Properties, Local Guide, Booking Policy, Contact, Enquire (in that order — all small caps, stays on one line at md+).
- Top-right "Enquire Now" button → `to="/enquire"`.

**`src/components/site/Footer.tsx`**
- Add "Enquire" → `/enquire` to the link row alongside existing items.

## Verification
- `/contact` renders info page with mailto link, hours, address, Facebook icon, new boulders image.
- `/enquire` renders the existing form with new aerial image.
- Nav "Contact" → info page; "Enquire" link and "Enquire Now" button → form.
- No leftover references to the form on `/contact`.
