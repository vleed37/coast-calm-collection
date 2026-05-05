
## 1. Shared property type + fetcher

Create `src/lib/queries/properties.ts` exporting:
- A `Property` type matching the DB shape (camelCase mapped from snake_case, plus `extras` derived from `experience_vignettes` jsonb, `setting_copy`, `setting_image`, `seo_*`).
- `fetchPublishedProperties()` — `supabase.from('properties').select('*').eq('is_published', true).order('sort_order')` then maps rows to the `Property` type.
- `fetchPropertyBySlug(slug)` — single row by slug, returns null if not found.

Create `src/lib/queries/guide.ts` with `fetchPublishedArticles()` — same pattern against `guide_articles`, ordered by `sort_order`.

Both modules import the browser `supabase` client (read-only public selects, RLS already permits anon SELECT where `is_published = true`). No server functions needed for public reads.

## 2. Update PropertyCard + EnquiryForm to the new type

- `src/components/site/PropertyCard.tsx`: import the new `Property` type from `@/lib/queries/properties`. No render changes (same fields: name, location, beds, baths, guests, fromPrice, heroImage, slug).
- `src/components/site/EnquiryForm.tsx`: replace the `properties` import with a small inline fetch on mount (`useEffect` + `supabase.from('properties').select('id, slug, name').eq('is_published', true).order('sort_order')`), populate the select from state. Default empty list during fetch.

## 3. Rewire route loaders

- `src/routes/index.tsx`: add `loader: () => fetchPublishedProperties()`, render `Route.useLoaderData()` in the featured grid. Add `errorComponent` + `notFoundComponent`.
- `src/routes/properties.tsx`: add `loader: () => fetchPublishedProperties()`. Add boundaries.
- `src/routes/properties_.$slug.tsx`:
  - `loader: async ({ params }) => { const p = await fetchPropertyBySlug(params.slug); if (!p) throw notFound(); return { property: p }; }`
  - Inside the component, fetch siblings via a small client query (or include in loader as `{ property, others }` — preferred: extend loader to also fetch all properties once and slice).
  - Extras (bandQuote, setting heading/paragraphs, experience vignettes, pin) now come from the property row: `pull_quote` → bandQuote fallback; `setting_copy` parsed as paragraphs (split on blank lines) with heading "Where you'll be."; `experience_vignettes` jsonb → vignette array; `pin` derived from a small `PROPERTY_PINS` constant kept in the file (non-content layout data) keyed by slug, falling back to a default coordinate.
  - SEO override in `head()`:
    ```
    title: p.seo_title || `${p.name} — Luxury Villa in ${p.location} | [BRAND]`
    description: p.seo_description || truncateDescription([p.description, ...p.long_copy].join(' '), 155)
    keywords: p.seo_keywords || `${p.location} villa, ...`
    image: p.seo_og_image || p.hero_image
    ```
- `src/routes/guide.tsx`: add `loader: () => fetchPublishedArticles()`. Render from loader data instead of the hardcoded `articles` array. Filter buttons keep existing `filters` constant.

`src/lib/seo.ts`: change `lodgingGraph` to accept the new `Property` shape (rename `heroImage`→`hero_image` access, `fromPrice`→`from_price` etc., or keep camelCase consistently in the Property type — preferred: keep camelCase mapping in fetcher so seo helpers stay unchanged).

## 4. Backup the hardcoded data files

- Rename `src/data/properties.ts` → `src/data/properties.ts.bak`.
- The hardcoded guide article array lives inline in `src/routes/guide.tsx` — extract it to `src/data/guide.ts.bak` for backup.
- Verify no remaining imports from `@/data/properties` (PropertyCard, EnquiryForm, EnquirySheet, seo.ts, all routes already covered above).

## 5. Enquiry submission + email notification

### Client submission
Update `EnquiryForm.tsx`:
- Replace the `onSubmit` handler with: collect fields (name, email, phone, property, checkin, checkout, message), call `supabase.from('enquiries').insert({...})`.
- After successful insert, call `supabase.functions.invoke('notify-enquiry', { body: enquiryRow })` (fire-and-forget; don't block the success toast on email).
- Show sonner toast on success ("Enquiry sent — we'll reply within a day.") and call `onSubmitted?.()`.
- On error, sonner error toast: "Couldn't send right now. Please try again."
- Add zod validation (name 1-200, email valid, message ≤ 5000) matching the RLS check expression to avoid silent rejections.

### Email — Supabase Edge Function `notify-enquiry`
Create `supabase/functions/notify-enquiry/index.ts`:
- Reads enquiry payload from request body.
- Sends email via the Lovable AI Gateway is not applicable; use Resend if `RESEND_API_KEY` is present, otherwise log only.
- Recommended: use the Lovable Email infrastructure (transactional emails) — but that requires an email domain setup. Since the user said "use Supabase's built-in SMTP for now; can be swapped to Resend or SendGrid later", we'll proceed with: **scaffold Lovable Email transactional** (no third-party API key required, uses `notify.<domain>` subdomain).
- This means: call `email_domain--check_email_domain_status`. If no domain configured, prompt the user via the email setup dialog before completing email wiring. The DB insert + toast still works without email.

Function set to `verify_jwt = false` in `supabase/config.toml` so it can be called from the public form.

To: Linda's address. **We need her email** — add a `LINDA_NOTIFY_EMAIL` Supabase secret (will prompt user during implementation). Subject `New enquiry from {name}`; body lists all fields as plain text.

### Webhook vs invoke
We'll invoke directly from the client after a successful insert (simpler than wiring a DB webhook; same outcome and no extra Supabase config). The function does its own minimal validation.

## 6. Verification checklist

- Home, /properties, /properties/$slug all hydrate from Supabase (toggle `is_published` in admin → row disappears on refresh).
- Editing a property in admin and refreshing public page reflects changes.
- Slug not found renders existing `notFoundComponent`.
- /guide hydrates from `guide_articles`.
- /contact and EnquirySheet insert a row in `enquiries` and trigger `notify-enquiry`; toast feedback on success/error.
- SEO `<title>`, meta description, keywords, og:image on a property page reflect admin override fields when set.
- `src/data/properties.ts.bak` exists; no code imports from the .bak file.

## Open question (will ask during implementation)

- Linda's notification email address (stored as `LINDA_NOTIFY_EMAIL` secret).
- Lovable Email domain — if not yet configured, user will be prompted via the email setup dialog when the edge function is wired.
