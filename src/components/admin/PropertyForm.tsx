import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { adminData } from "@/lib/admin-client";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, X } from "lucide-react";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const schema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, hyphens only"),
  location: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  pull_quote: z.string().max(500).optional(),
  is_published: z.boolean(),
  long_copy_text: z.string(),
  beds: z.coerce.number().int().min(0),
  baths: z.coerce.number().int().min(0),
  guests: z.coerce.number().int().min(0),
  min_stay: z.string().min(1).max(100),
  from_price: z.string().min(1).max(100),
  setting_copy: z.string().min(1),
  setting_image: z.string().url().or(z.literal("")).optional(),
  hero_image: z.string().url(),
  gallery: z.array(z.object({ url: z.string().url() })),
  features: z.array(z.object({ value: z.string().min(1) })),
  vignettes: z.array(z.object({ title: z.string().min(1), body: z.string().min(1) })),
  sort_order: z.coerce.number().int(),
  seo_title: z.string().max(200).optional(),
  seo_description: z.string().max(500).optional(),
  seo_keywords: z.string().max(500).optional(),
  seo_og_image: z.string().url().or(z.literal("")).optional(),
});

type FormValues = z.infer<typeof schema>;

export function PropertyForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!id);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", slug: "", location: "", description: "", pull_quote: "",
      is_published: true, long_copy_text: "", beds: 0, baths: 0, guests: 0,
      min_stay: "", from_price: "", setting_copy: "", setting_image: "",
      hero_image: "", gallery: [], features: [], vignettes: [],
      sort_order: 0, seo_title: "", seo_description: "", seo_keywords: "", seo_og_image: "",
    },
  });

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = form;
  const gallery = useFieldArray({ control, name: "gallery" });
  const features = useFieldArray({ control, name: "features" });
  const vignettes = useFieldArray({ control, name: "vignettes" });

  const nameValue = watch("name");
  useEffect(() => {
    if (autoSlug) setValue("slug", slugify(nameValue || ""));
  }, [nameValue, autoSlug, setValue]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      let data: any;
      try {
        data = await adminData<any>({ table: "properties", op: "select", id });
      } catch { toast.error("Could not load property"); return; }
      form.reset({
        name: data.name, slug: data.slug, location: data.location,
        description: data.description, pull_quote: data.pull_quote ?? "",
        is_published: data.is_published,
        long_copy_text: (data.long_copy ?? []).join("\n\n"),
        beds: data.beds, baths: data.baths, guests: data.guests,
        min_stay: data.min_stay, from_price: data.from_price,
        setting_copy: data.setting_copy, setting_image: data.setting_image ?? "",
        hero_image: data.hero_image,
        gallery: (data.gallery ?? []).map((url) => ({ url })),
        features: (data.features ?? []).map((value) => ({ value })),
        vignettes: Array.isArray(data.experience_vignettes)
          ? (data.experience_vignettes as Array<{ title: string; body: string }>)
          : [],
        sort_order: data.sort_order,
        seo_title: data.seo_title ?? "", seo_description: data.seo_description ?? "",
        seo_keywords: data.seo_keywords ?? "", seo_og_image: data.seo_og_image ?? "",
      });
      setLoading(false);
    })();
  }, [id]);

  const onSubmit = async (v: FormValues) => {
    setSaving(true);
    const payload = {
      name: v.name, slug: v.slug, location: v.location,
      description: v.description, pull_quote: v.pull_quote || null,
      is_published: v.is_published,
      long_copy: v.long_copy_text.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
      beds: v.beds, baths: v.baths, guests: v.guests,
      min_stay: v.min_stay, from_price: v.from_price,
      setting_copy: v.setting_copy, setting_image: v.setting_image || null,
      hero_image: v.hero_image,
      gallery: v.gallery.map((g) => g.url),
      features: v.features.map((f) => f.value),
      experience_vignettes: v.vignettes,
      sort_order: v.sort_order,
      seo_title: v.seo_title || null,
      seo_description: v.seo_description || null,
      seo_keywords: v.seo_keywords || null,
      seo_og_image: v.seo_og_image || null,
    };
    try {
      if (id) await adminData({ table: "properties", op: "update", id, payload });
      else await adminData({ table: "properties", op: "insert", payload });
      toast.success(id ? "Saved" : "Created");
      navigate({ to: "/admin/properties" });
    } catch (e) {
      toast.error((e as Error).message);
    } finally { setSaving(false); }
  };

  const onDelete = async () => {
    if (!id) return;
    try {
      await adminData({ table: "properties", op: "delete", id });
      toast.success("Deleted");
      navigate({ to: "/admin/properties" });
    } catch (e) { toast.error((e as Error).message); }
  };

  if (loading) return <p className="text-ink/60">Loading…</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-3xl">
      <Section title="Basics">
        <Field label="Name" error={errors.name?.message}>
          <Input {...register("name")} />
        </Field>
        <Field label="Slug" error={errors.slug?.message}>
          <Input {...register("slug")} onFocus={() => setAutoSlug(false)} />
        </Field>
        <Field label="Location" error={errors.location?.message}>
          <Input {...register("location")} />
        </Field>
        <Field label="Short description" error={errors.description?.message}>
          <Textarea rows={2} {...register("description")} />
        </Field>
        <Field label="Pull quote" error={errors.pull_quote?.message}>
          <Input {...register("pull_quote")} />
        </Field>
        <Controller
          control={control}
          name="is_published"
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              <Label>Published</Label>
            </div>
          )}
        />
      </Section>

      <Section title="The Story">
        <Field label="Long copy (separate paragraphs with a blank line)" error={errors.long_copy_text?.message}>
          <Textarea rows={10} {...register("long_copy_text")} />
        </Field>
      </Section>

      <Section title="Specs">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Beds"><Input type="number" {...register("beds")} /></Field>
          <Field label="Baths"><Input type="number" {...register("baths")} /></Field>
          <Field label="Guests"><Input type="number" {...register("guests")} /></Field>
        </div>
        <Field label="Min stay"><Input {...register("min_stay")} /></Field>
        <Field label="From price"><Input {...register("from_price")} /></Field>
        <Field label="Sort order"><Input type="number" {...register("sort_order")} /></Field>
      </Section>

      <Section title="The Setting">
        <Field label="Setting copy"><Textarea rows={4} {...register("setting_copy")} /></Field>
        <ImageField label="Setting image URL" name="setting_image" register={register} watch={watch} error={errors.setting_image?.message} />
      </Section>

      <Section title="The Experience">
        {vignettes.fields.map((f, i) => (
          <div key={f.id} className="border border-mist p-4 rounded space-y-3 relative">
            <button type="button" onClick={() => vignettes.remove(i)} className="absolute top-2 right-2 text-ink/40 hover:text-destructive">
              <X className="w-4 h-4" />
            </button>
            <Field label="Title"><Input {...register(`vignettes.${i}.title` as const)} /></Field>
            <Field label="Body"><Textarea rows={3} {...register(`vignettes.${i}.body` as const)} /></Field>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => vignettes.append({ title: "", body: "" })}>
          <Plus className="w-4 h-4 mr-2" />Add vignette
        </Button>
      </Section>

      <Section title="Images">
        <ImageField label="Hero image URL" name="hero_image" register={register} watch={watch} error={errors.hero_image?.message} />
        <div>
          <Label className="mb-2 block">Gallery</Label>
          <div className="space-y-2">
            {gallery.fields.map((f, i) => (
              <div key={f.id} className="flex gap-2 items-start">
                <div className="flex-1">
                  <Input {...register(`gallery.${i}.url` as const)} placeholder="https://…" />
                  {watch(`gallery.${i}.url`) && (
                    <img src={watch(`gallery.${i}.url`)} alt="" className="mt-2 w-32 h-20 object-cover rounded" />
                  )}
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => gallery.remove(i)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" className="mt-3" onClick={() => gallery.append({ url: "" })}>
            <Plus className="w-4 h-4 mr-2" />Add image
          </Button>
        </div>
      </Section>

      <Section title="Features">
        <div className="space-y-2">
          {features.fields.map((f, i) => (
            <div key={f.id} className="flex gap-2">
              <Input {...register(`features.${i}.value` as const)} className="flex-1" />
              <Button type="button" variant="ghost" size="icon" onClick={() => features.remove(i)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" onClick={() => features.append({ value: "" })}>
          <Plus className="w-4 h-4 mr-2" />Add feature
        </Button>
      </Section>

      <Section title="SEO Override (Advanced)">
        <p className="text-xs text-ink/50 -mt-2">Leave blank to use the default — only override if you want to customise this property's search appearance.</p>
        <Field label="SEO title"><Input {...register("seo_title")} /></Field>
        <Field label="SEO description"><Textarea rows={2} {...register("seo_description")} /></Field>
        <Field label="SEO keywords"><Input {...register("seo_keywords")} /></Field>
        <Field label="OG image URL"><Input {...register("seo_og_image")} /></Field>
      </Section>

      <div className="flex items-center justify-between pt-6 border-t border-mist">
        <div>
          {id && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this property?</AlertDialogTitle>
                  <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/admin/properties" })}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </div>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl font-light pb-2 border-b border-mist">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function ImageField({ label, name, register, watch, error }: any) {
  const v = watch(name);
  return (
    <Field label={label} error={error}>
      <Input {...register(name)} placeholder="https://…" />
      {v && <img src={v} alt="" className="mt-2 w-48 h-32 object-cover rounded" />}
    </Field>
  );
}
