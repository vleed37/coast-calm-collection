
CREATE TABLE public.property_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  storage_path text,
  is_cover boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  width integer,
  height integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.property_photos TO anon, authenticated;
GRANT ALL ON public.property_photos TO service_role;

ALTER TABLE public.property_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view photos of published properties"
  ON public.property_photos FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_photos.property_id AND p.is_published = true
    )
  );

CREATE POLICY "Admins manage photos"
  ON public.property_photos FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE UNIQUE INDEX property_photos_one_cover_per_property
  ON public.property_photos (property_id) WHERE is_cover = true;

CREATE INDEX property_photos_property_sort_idx
  ON public.property_photos (property_id, sort_order);

-- Backfill from existing hero_image + gallery
INSERT INTO public.property_photos (property_id, image_url, is_cover, sort_order)
SELECT id, hero_image, true, 0
FROM public.properties
WHERE hero_image IS NOT NULL AND hero_image <> '';

INSERT INTO public.property_photos (property_id, image_url, is_cover, sort_order)
SELECT p.id, g.url, false, g.ord + 1
FROM public.properties p
CROSS JOIN LATERAL unnest(p.gallery) WITH ORDINALITY AS g(url, ord)
WHERE g.url IS NOT NULL AND g.url <> '';
