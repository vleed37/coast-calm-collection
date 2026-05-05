
-- Shared updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- properties
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  location text not null,
  description text not null,
  long_copy text[] not null default '{}',
  pull_quote text,
  beds integer not null,
  baths integer not null,
  guests integer not null,
  min_stay text not null,
  from_price text not null,
  hero_image text not null,
  gallery text[] not null default '{}',
  features text[] not null default '{}',
  experience_vignettes jsonb not null default '[]'::jsonb,
  setting_copy text not null,
  setting_image text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  seo_title text,
  seo_description text,
  seo_keywords text,
  seo_og_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index properties_published_sort_idx on public.properties (is_published, sort_order);

create trigger properties_set_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

alter table public.properties enable row level security;

create policy "Public can view published properties"
on public.properties for select
to anon, authenticated
using (is_published = true);

create policy "Authenticated can manage properties"
on public.properties for all
to authenticated
using (true)
with check (true);

-- guide_articles
create table public.guide_articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null,
  title text not null,
  description text not null,
  image text not null,
  body text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index guide_articles_published_sort_idx on public.guide_articles (is_published, sort_order);

create trigger guide_articles_set_updated_at
before update on public.guide_articles
for each row execute function public.set_updated_at();

alter table public.guide_articles enable row level security;

create policy "Public can view published guide articles"
on public.guide_articles for select
to anon, authenticated
using (is_published = true);

create policy "Authenticated can manage guide articles"
on public.guide_articles for all
to authenticated
using (true)
with check (true);

-- enquiries
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  property_of_interest text,
  check_in date,
  check_out date,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index enquiries_created_at_idx on public.enquiries (created_at desc);

alter table public.enquiries enable row level security;

create policy "Anyone can submit an enquiry"
on public.enquiries for insert
to anon, authenticated
with check (true);

create policy "Authenticated can view enquiries"
on public.enquiries for select
to authenticated
using (true);

create policy "Authenticated can update enquiries"
on public.enquiries for update
to authenticated
using (true)
with check (true);
