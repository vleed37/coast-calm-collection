# Separate Rooms breakdown from Details/features

## Problem
Rooms tab and Details "Everything in place" grid both read from `properties.features`. The Rooms tab filters with a regex (`bed|bath|linen|sleep|sheet|towel`) so room lines also leak into Details. Result: lines like "Main bedroom: 1 King bed and en-suite bathroom" appear in both places.

## Solution
Introduce a dedicated `rooms_breakdown text[]` column on `properties`, separate from `features`. Rooms tab renders `rooms_breakdown` only. Details renders `features` only — no filtering, no overlap.

## Steps

### 1. Database migration
- Add column `rooms_breakdown text[] not null default '{}'` to `public.properties`.
- One-time data move for the three live properties: copy the room-related lines (bedroom / bathroom / linen / towels) out of `features` into `rooms_breakdown`, then remove those lines from `features`. Applies to `sage-and-salt`, `sky-and-sea`, `10-seaview-close`. `37-wanoo-drive` has empty features — leave as-is.

### 2. Query layer (`src/lib/queries/properties.ts`)
- Add `roomsBreakdown: string[]` to `Property`.
- Map `row.rooms_breakdown ?? []` in `mapRow`.

### 3. Property page (`src/routes/properties_.$slug.tsx`)
- Rooms tab: render `property.roomsBreakdown` as a single list under one heading ("Bedrooms & Bathrooms"). Drop the regex-derived `roomFeatures` / `kitchenFeatures` split (kitchen items stay in Details where they read naturally; the existing Kitchen subsection on Rooms was also fed by the same regex and will be removed for the same reason — keep Rooms focused on the room breakdown).
- Details tab: render `property.features` as-is (no filtering needed since room lines are no longer in there).

### 4. Admin editor (`src/components/admin/PropertyForm.tsx`)
- Add a "Rooms breakdown" section above "Features" with the same add/remove pattern as features (useFieldArray on `rooms_breakdown`).
- Include in schema, defaultValues, form.reset hydration, and submit payload.

### 5. Types
After migration is approved & run, `src/integrations/supabase/types.ts` regenerates with the new column.

## Verification
- `/properties/sage-and-salt` Details grid shows ocean views, Wi-Fi, braai, kitchen, etc. — no "Main bedroom / Second bedroom / 1 full bathroom" lines.
- Rooms tab on the same page still shows those three lines.
- Same for `sky-and-sea` and `10-seaview-close`.
- `/admin/properties/<id>` shows a "Rooms breakdown" editor populated with the moved lines; editing it does not change Features.
