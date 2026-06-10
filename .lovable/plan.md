## Problem

The contact form posts to `rpc/submit_enquiry` and gets a 404 (`PGRST202`). supabase-js strips `undefined` values, so when phone/property/dates/message are empty the request body only includes the filled fields. PostgREST then can't find an overload matching the supplied param names.

## Fix

Two small changes:

1. **Database** — add `DEFAULT NULL` to every parameter of `public.submit_enquiry` so PostgREST resolves the function when optional params are omitted. (Run as a new migration; existing function is replaced with `CREATE OR REPLACE`.)

2. **Client (`src/components/site/EnquiryForm.tsx`)** — pass `null` (not `undefined`) for empty optional fields so supabase-js actually sends them in the JSON body. This works whether or not the DB change is in place, and is the more robust of the two.

After both, submitting the form will insert a row, return the new id, and trigger `notify-enquiry` to send the Resend email to `rental@lonebullgroup.co.za`.

## Verification

- Submit a test enquiry from `/contact` and confirm the success toast.
- Check the admin Enquiries list shows the new row.
- Confirm the email arrives (or check `notify-enquiry` logs if the Resend sender/recipient pairing still needs domain verification — separate issue).
