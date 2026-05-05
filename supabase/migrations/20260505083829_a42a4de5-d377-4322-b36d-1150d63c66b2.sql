
-- Lock down search_path on the trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Roles
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
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

create policy "Users can view their own roles"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id);

-- Replace permissive admin policies with role-gated versions

drop policy "Authenticated can manage properties" on public.properties;
create policy "Admins can manage properties"
on public.properties for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy "Authenticated can manage guide articles" on public.guide_articles;
create policy "Admins can manage guide articles"
on public.guide_articles for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy "Authenticated can view enquiries" on public.enquiries;
create policy "Admins can view enquiries"
on public.enquiries for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

drop policy "Authenticated can update enquiries" on public.enquiries;
create policy "Admins can update enquiries"
on public.enquiries for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));
