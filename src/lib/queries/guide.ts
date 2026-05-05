import { supabase } from "@/integrations/supabase/client";

export type GuideArticle = {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  image: string;
  body: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

function mapRow(row: any): GuideArticle {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    title: row.title,
    description: row.description,
    image: row.image,
    body: row.body ?? null,
    seoTitle: row.seo_title ?? null,
    seoDescription: row.seo_description ?? null,
  };
}

export async function fetchPublishedArticles(): Promise<GuideArticle[]> {
  const { data, error } = await supabase
    .from("guide_articles")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}