# Backend Foundation — Phase A

Stand up Supabase, define the schema, seed existing content, and add a gated `/admin` route. The public frontend keeps reading from `src/data/properties.ts` and the hardcoded guide array in this phase — no visual or copy changes.

## 1. Enable Lovable Cloud (Supabase)

Enable Lovable Cloud so the project gets a Supabase instance with `VITE_SUPABASE_*` and server-side `SUPABASE_*` env vars wired automatically. No manual project creation needed.

## 2. Schema migration

One migration creating three tables exactly as specified, all with RLS enabled.

- `properties` — slug-keyed, includes `long_copy text[]`, `gallery text[]`, `features text[]`, `experience_vignettes jsonb`, SEO override columns, `sort_order`, `is_published`, timestamps. Add `updated_at` trigger.
- `guide_articles` — slug-keyed, `category text` (free-form, validated in app layer to keep enum changes cheap), SEO overrides, `sort_order`, `is_published`, timestamps + `updated_at` trigger.
- `enquiries` — capture form submissions, `status text default 'new'`.

Indexes: `properties(slug)`, `properties(is_published, sort_order)`, `guide_articles(slug)`, `guide_articles(is_published, sort_order)`, `enquiries(created_at desc)`.

## 3. RLS policies

- `properties`
  - SELECT to `anon, authenticated` where `is_published = true`
  - ALL to `authenticated` (admin UI runs signed in)
- `guide_articles` — same pattern as properties
- `enquiries`
  - INSERT to `anon, authenticated` (with column allowlist via policy `with check`)
  - SELECT + UPDATE to `authenticated`
  - No DELETE policy

Note: in Phase A every authenticated user is treated as admin (only Linda will exist). A proper `user_roles` table + `has_role()` security-definer function will be introduced in Phase B when more users exist; flagging now so we don't bake assumptions in.

## 4. Data seeding

Insert via the Supabase insert tool (data, not schema):

- All 3 properties from `src/data/properties.ts`. `experience_vignettes` becomes a single-item jsonb array `[{ "title": "Experience", "body": property.experience }]` for now (Phase B will let Linda split it). `long_copy` ← `story[]`. `setting_copy` ← `description`. `setting_image` ← null.
- All 6 guide articles from `src/routes/guide.tsx` (lines 10–17), mapping `cat → category`, `title → title`, `desc → description`, `img → image`. Slugs derived from title (kebab-case).

## 5. Admin auth

- Add `src/routes/admin.tsx` as a pathless-ish layout: `beforeLoad` checks `supabase.auth.getSession()`; if no session, `throw redirect({ to: "/admin/login" })`. Renders `<Outlet />`.
- Add `src/routes/admin.index.tsx` — placeholder "Welcome" + sign-out button (`supabase.auth.signOut()` → navigate to `/admin/login`).
- Add `src/routes/admin.login.tsx` — public route. Cream bg, Cormorant `Admin.` heading, Inter underline inputs matching `EnquiryForm` styling, ocean focus accent. Calls `supabase.auth.signInWithPassword`. On success → `/admin`. Shows inline error on failure.
- Both admin routes get `<meta name="robots" content="noindex, nofollow">` via `head()`.
- Linda creates her admin user manually in the Lovable Cloud Users panel after this ships.

## 6. What is NOT touched

- `src/data/properties.ts` stays as-is and remains the source of truth for the public site this phase.
- All public routes (`/`, `/properties`, `/properties/:slug`, `/guide`, `/contact`, `/booking-policy`) untouched.
- SEO helpers, Nav, Footer, EnquirySheet untouched.

## Technical notes

- Migration file under the standard Supabase migrations dir; uses `gen_random_uuid()` (pgcrypto already available on Supabase).
- `updated_at` maintained via a single shared trigger function `public.set_updated_at()`.
- `supabase.auth.getSession()` is awaited inside `beforeLoad` so the session is hydrated before the guard runs (avoids the loader-race issue documented for TanStack + Supabase).
- No server functions needed yet — admin routes use the browser Supabase client directly. Phase C will introduce `createServerFn` wrappers when the public site reads from the DB.

## Verification checklist

- Tables visible in Cloud DB view with RLS on.
- `select count(*) from properties` = 3, `from guide_articles` = 6.
- Visiting `/admin` while signed out redirects to `/admin/login`.
- Login with Linda's credentials lands on `/admin` showing "Welcome" + working sign-out.
- Public pages render identically to current preview.
