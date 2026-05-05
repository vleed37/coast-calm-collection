
-- Tighten enquiry insert with basic input validation
drop policy "Anyone can submit an enquiry" on public.enquiries;
create policy "Anyone can submit an enquiry"
on public.enquiries for insert
to anon, authenticated
with check (
  length(trim(name)) between 1 and 200
  and length(email) between 3 and 320
  and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  and (message is null or length(message) <= 5000)
);

-- Restrict has_role direct execution; RLS policies still call it via the SECURITY DEFINER context
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
