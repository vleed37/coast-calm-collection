# Fix 1 — Header layout (src/components/site/Nav.tsx)

Goal: wordmark, five nav links, and Enquire Now button all sit comfortably on one desktop row with the nav on a single line. Same elements, same fonts/colours — spacing only.

Changes:
- Reduce wordmark size on desktop: `md:text-3xl lg:text-4xl` (was `md:text-4xl lg:text-5xl`) and tighten tracking to `tracking-[0.18em]`.
- Force the nav row onto one line: replace `flex-wrap` with `flex-nowrap whitespace-nowrap`, drop `md:flex-1` (it stretches the middle group and forces wraps at narrow desktop widths), and reduce link gap to `gap-x-5 lg:gap-x-6`.
- Tighten link letter-spacing: add `tracking-[0.14em]` on the link classes (`smallcaps` currently uses wider tracking).
- Reduce outer container horizontal padding on desktop: `md:px-8 lg:px-10` (was `md:px-12`) and use `md:gap-6 lg:gap-8`.
- Keep the Enquire Now button unchanged on the right with `whitespace-nowrap` (already set).

Mobile: the header already stacks (wordmark / nav / button) via `flex-col`. Verify it isn't cramped at 375 px after the size tweak; if the wordmark still feels tight, drop mobile size to `text-2xl`. No hamburger needed — the existing stacked layout already collapses cleanly and only has 5 short links.

# Fix 2 — Overview tab (src/routes/properties_.$slug.tsx)

## 2a. Pull-quote

The DB values are correct (verified for all three properties). The current JSX wraps the expression in literal ASCII double quotes: `"{property.pullQuote}"`. That can render oddly in some browsers/extensions and is the most likely source of the "stray 1 1" corruption (a hydration/escape artifact around the bare quote chars).

Fix: render the quote with explicit typographic quotes as separate JSX text nodes, no bare `"` adjacent to an expression:

```tsx
<blockquote ...>
  {`\u201C${property.pullQuote}\u201D`}
</blockquote>
```

This guarantees one clean string ("Coffee while the boats head out. Wine as the sun sets over the bay.") with curly opening/closing quotes, using each property's own `pullQuote` from the loader (no hard-coding).

## 2b. Doubled/overlapping layout

Reading the current file, the Overview path renders the masthead once, then a single tab-panel `<section>`, then the "Also in the Collection" section — no obvious duplication in source. Before changing structure I will:

1. Open all three property pages in the preview (desktop + mobile) after the pull-quote fix.
2. If duplication or overlap is visible, inspect for: a stray duplicate `<Reveal>` inside the overview block, a `Reveal` height-collapse issue (the `reveal` class may use `position: absolute`/transform causing the next section to overlap the hero), or a missing wrapper around the tab panel.
3. Apply the minimal fix (most likely either removing a duplicated node introduced in the earlier tab restructure, or adding `relative`/explicit block flow to the tab-panel section so the following "Also in the Collection" section can't visually overlap the hero).

If after inspection there is no real duplication (e.g. the client was looking at a stale cached build), I'll report that back rather than invent a change.

# Verification

- Visit `/properties/sage-and-salt`, `/properties/sky-and-sea`, `/properties/10-seaview-close` at desktop (1280) and mobile (390) via the preview browser.
- Confirm: header nav on one line desktop / stacks cleanly mobile; Overview shows full quote with curly quotes; masthead and tabs appear once; "Also in the Collection" sits below with no overlap.

# Files touched

- `src/components/site/Nav.tsx`
- `src/routes/properties_.$slug.tsx`
