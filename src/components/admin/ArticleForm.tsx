import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

const CATEGORIES = ["Eat", "Drink", "Walk", "Watch", "Wander"] as const;

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const schema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  category: z.enum(CATEGORIES),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  image: z.string().url(),
  body: z.string().optional(),
  is_published: z.boolean(),
  sort_order: z.coerce.number().int(),
  seo_title: z.string().max(200).optional(),
  seo_description: z.string().max(500).optional(),
});

type Values = z.infer<typeof schema>;

export function ArticleForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!id);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: "", category: "Eat", title: "", description: "", image: "",
      body: "", is_published: true, sort_order: 0, seo_title: "", seo_description: "",
    },
  });
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = form;

  const title = watch("title");
  useEffect(() => { if (autoSlug) setValue("slug", slugify(title || "")); }, [title, autoSlug, setValue]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase.from("guide_articles").select("*").eq("id", id).single();
      if (error || !data) { toast.error("Could not load"); return; }
      form.reset({
        slug: data.slug, category: data.category as any, title: data.title,
        description: data.description, image: data.image, body: data.body ?? "",
        is_published: data.is_published, sort_order: data.sort_order,
        seo_title: data.seo_title ?? "", seo_description: data.seo_description ?? "",
      });
      setLoading(false);
    })();
  }, [id]);

  const onSubmit = async (v: Values) => {
    setSaving(true);
    const payload = {
      ...v, body: v.body || null,
      seo_title: v.seo_title || null, seo_description: v.seo_description || null,
    };
    const res = id
      ? await supabase.from("guide_articles").update(payload).eq("id", id)
      : await supabase.from("guide_articles").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(id ? "Saved" : "Created");
    navigate({ to: "/admin/guide-articles" });
  };

  const onDelete = async () => {
    if (!id) return;
    const { error } = await supabase.from("guide_articles").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    navigate({ to: "/admin/guide-articles" });
  };

  if (loading) return <p className="text-ink/60">Loading…</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <Field label="Title" error={errors.title?.message}><Input {...register("title")} /></Field>
      <Field label="Slug" error={errors.slug?.message}>
        <Input {...register("slug")} onFocus={() => setAutoSlug(false)} />
      </Field>
      <Field label="Category">
        <Controller control={control} name="category" render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        )} />
      </Field>
      <Field label="Description" error={errors.description?.message}>
        <Textarea rows={4} {...register("description")} />
      </Field>
      <Field label="Image URL" error={errors.image?.message}>
        <Input {...register("image")} placeholder="https://…" />
        {watch("image") && <img src={watch("image")} alt="" className="mt-2 w-48 h-32 object-cover rounded" />}
      </Field>
      <Field label="Body (optional)"><Textarea rows={6} {...register("body")} /></Field>
      <Field label="Sort order"><Input type="number" {...register("sort_order")} /></Field>
      <Controller control={control} name="is_published" render={({ field }) => (
        <div className="flex items-center gap-3"><Switch checked={field.value} onCheckedChange={field.onChange} /><Label>Published</Label></div>
      )} />

      <section className="pt-6 border-t border-mist space-y-4">
        <h3 className="font-display text-xl">SEO Override (Advanced)</h3>
        <p className="text-xs text-ink/50">Leave blank to use the default — only override if you want to customise this article's search appearance.</p>
        <Field label="SEO title"><Input {...register("seo_title")} /></Field>
        <Field label="SEO description"><Textarea rows={2} {...register("seo_description")} /></Field>
      </section>

      <div className="flex items-center justify-between pt-6 border-t border-mist">
        {id ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this article?</AlertDialogTitle>
                <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : <span />}
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/admin/guide-articles" })}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </div>
      </div>
    </form>
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
