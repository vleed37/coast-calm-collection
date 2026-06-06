
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated, service_role;

create or replace function private.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

revoke all on function private.has_role(uuid, public.app_role) from public, anon;
grant execute on function private.has_role(uuid, public.app_role) to authenticated, service_role;

-- Replace all policies that referenced public.has_role
drop policy if exists "Admins can view enquiries" on public.enquiries;
create policy "Admins can view enquiries" on public.enquiries
for select to authenticated using (private.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can update enquiries" on public.enquiries;
create policy "Admins can update enquiries" on public.enquiries
for update to authenticated using (private.has_role(auth.uid(), 'admin')) with check (private.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can manage properties" on public.properties;
create policy "Admins can manage properties" on public.properties
for all to authenticated using (private.has_role(auth.uid(), 'admin')) with check (private.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can manage guide articles" on public.guide_articles;
create policy "Admins can manage guide articles" on public.guide_articles
for all to authenticated using (private.has_role(auth.uid(), 'admin')) with check (private.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins manage photos" on public.property_photos;
create policy "Admins manage photos" on public.property_photos
for all to authenticated using (private.has_role(auth.uid(), 'admin')) with check (private.has_role(auth.uid(), 'admin'));

-- Remove the public-schema function from the exposed API
drop function if exists public.has_role(uuid, public.app_role);

-- Storage RLS: lock down property-photos bucket
drop policy if exists "Admins can read property-photos" on storage.objects;
create policy "Admins can read property-photos" on storage.objects
for select to authenticated
using (bucket_id = 'property-photos' and private.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can upload property-photos" on storage.objects;
create policy "Admins can upload property-photos" on storage.objects
for insert to authenticated
with check (bucket_id = 'property-photos' and private.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can update property-photos" on storage.objects;
create policy "Admins can update property-photos" on storage.objects
for update to authenticated
using (bucket_id = 'property-photos' and private.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'property-photos' and private.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can delete property-photos" on storage.objects;
create policy "Admins can delete property-photos" on storage.objects
for delete to authenticated
using (bucket_id = 'property-photos' and private.has_role(auth.uid(), 'admin'));
