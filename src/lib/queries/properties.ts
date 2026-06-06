import { supabase } from "@/integrations/supabase/client";

export type Vignette = { title: string; body: string };

export type Property = {
  id: string; // slug, used in URLs and as keys
  dbId: string; // uuid primary key
  name: string;
  location: string;
  beds: number;
  baths: number;
  guests: number;
  minStay: string;
  fromPrice: string;
  description: string;
  story: string[]; // long_copy
  pullQuote: string;
  experience: string; // legacy single-line summary (joined from vignettes)
  features: string[];
  heroImage: string;
  gallery: string[];
  // extras
  settingCopy: string;
  settingImage: string | null;
  experienceVignettes: Vignette[];
  comingSoon: boolean;
  // SEO overrides
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  seoOgImage: string | null;
};

function mapRow(row: any): Property {
  const vignettes: Vignette[] = Array.isArray(row.experience_vignettes)
    ? row.experience_vignettes
    : [];
  const photos = Array.isArray(row.property_photos) ? [...row.property_photos] : [];
  photos.sort((a: any, b: any) => {
    if (a.is_cover !== b.is_cover) return a.is_cover ? -1 : 1;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });
  const cover = photos.find((p: any) => p.is_cover)?.image_url
    ?? photos[0]?.image_url
    ?? row.hero_image;
  const rest = photos.filter((p: any) => !p.is_cover).map((p: any) => p.image_url);
  const gallery = rest.length > 0 ? rest : (row.gallery ?? []);
  return {
    id: row.slug,
    dbId: row.id,
    name: row.name,
    location: row.location,
    beds: row.beds,
    baths: row.baths,
    guests: row.guests,
    minStay: row.min_stay,
    fromPrice: row.from_price,
    description: row.description,
    story: row.long_copy ?? [],
    pullQuote: row.pull_quote ?? "",
    experience: vignettes.map((v) => v.body).join(" "),
    features: row.features ?? [],
    heroImage: cover,
    gallery,
    settingCopy: row.setting_copy ?? "",
    settingImage: row.setting_image ?? null,
    experienceVignettes: vignettes,
    comingSoon: row.coming_soon ?? false,
    seoTitle: row.seo_title ?? null,
    seoDescription: row.seo_description ?? null,
    seoKeywords: row.seo_keywords ?? null,
    seoOgImage: row.seo_og_image ?? null,
  };
}

export async function fetchPublishedProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_photos(image_url, is_cover, sort_order)")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_photos(image_url, is_cover, sort_order)")
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("coming_soon", false)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : null;
}