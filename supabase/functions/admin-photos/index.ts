import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { verifyToken, getBearer, corsHeaders, json } from "../_shared/admin-token.ts";

const BUCKET = "property-photos";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // 10 years

function admin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (!await verifyToken(getBearer(req))) return json({ error: "Unauthorized" }, 401);

  const url = new URL(req.url);
  const action = url.pathname.split("/").pop();
  const supabase = admin();

  try {
    if (action === "upload" && req.method === "POST") {
      const form = await req.formData();
      const file = form.get("file");
      const propertyId = String(form.get("property_id") || "");
      const width = Number(form.get("width") || 0) || null;
      const height = Number(form.get("height") || 0) || null;
      if (!(file instanceof File) || !propertyId) return json({ error: "file + property_id required" }, 400);

      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${propertyId}/${crypto.randomUUID()}.${ext}`;
      const buf = new Uint8Array(await file.arrayBuffer());
      const up = await supabase.storage.from(BUCKET).upload(path, buf, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });
      if (up.error) return json({ error: up.error.message }, 400);

      const signed = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
      if (signed.error || !signed.data) return json({ error: signed.error?.message || "sign failed" }, 400);

      // Append at end of sort order.
      const { data: maxRow } = await supabase
        .from("property_photos").select("sort_order")
        .eq("property_id", propertyId).order("sort_order", { ascending: false }).limit(1).maybeSingle();
      const nextOrder = (maxRow?.sort_order ?? -1) + 1;

      // First photo for this property becomes cover automatically.
      const { count } = await supabase
        .from("property_photos").select("id", { count: "exact", head: true })
        .eq("property_id", propertyId);
      const isCover = (count ?? 0) === 0;

      const ins = await supabase.from("property_photos").insert({
        property_id: propertyId,
        image_url: signed.data.signedUrl,
        storage_path: path,
        sort_order: nextOrder,
        is_cover: isCover,
        width, height,
      }).select().single();
      if (ins.error) return json({ error: ins.error.message }, 400);
      return json({ data: ins.data });
    }

    if (action === "set-cover" && req.method === "POST") {
      const { id, property_id } = await req.json();
      if (!id || !property_id) return json({ error: "id + property_id required" }, 400);
      const clr = await supabase.from("property_photos").update({ is_cover: false }).eq("property_id", property_id);
      if (clr.error) return json({ error: clr.error.message }, 400);
      const set = await supabase.from("property_photos").update({ is_cover: true }).eq("id", id);
      if (set.error) return json({ error: set.error.message }, 400);
      return json({ ok: true });
    }

    if (action === "reorder" && req.method === "POST") {
      const { items } = await req.json(); // [{id, sort_order}]
      if (!Array.isArray(items)) return json({ error: "items[] required" }, 400);
      for (const it of items) {
        const r = await supabase.from("property_photos").update({ sort_order: it.sort_order }).eq("id", it.id);
        if (r.error) return json({ error: r.error.message }, 400);
      }
      return json({ ok: true });
    }

    if (action === "delete" && req.method === "POST") {
      const { id } = await req.json();
      if (!id) return json({ error: "id required" }, 400);
      const { data: row } = await supabase.from("property_photos").select("storage_path, is_cover, property_id").eq("id", id).maybeSingle();
      const del = await supabase.from("property_photos").delete().eq("id", id);
      if (del.error) return json({ error: del.error.message }, 400);
      if (row?.storage_path) {
        await supabase.storage.from(BUCKET).remove([row.storage_path]);
      }
      // If we deleted the cover, promote the lowest sort_order as new cover.
      if (row?.is_cover && row.property_id) {
        const { data: next } = await supabase.from("property_photos")
          .select("id").eq("property_id", row.property_id)
          .order("sort_order", { ascending: true }).limit(1).maybeSingle();
        if (next?.id) {
          await supabase.from("property_photos").update({ is_cover: true }).eq("id", next.id);
        }
      }
      return json({ ok: true });
    }

    if (action === "refresh-signed-urls" && req.method === "POST") {
      // Utility to re-sign all stored photos (e.g. after long absence).
      const { data: rows, error } = await supabase.from("property_photos").select("id, storage_path").not("storage_path", "is", null);
      if (error) return json({ error: error.message }, 400);
      for (const r of rows || []) {
        if (!r.storage_path) continue;
        const s = await supabase.storage.from(BUCKET).createSignedUrl(r.storage_path, SIGNED_URL_TTL);
        if (s.data?.signedUrl) {
          await supabase.from("property_photos").update({ image_url: s.data.signedUrl }).eq("id", r.id);
        }
      }
      return json({ ok: true, count: rows?.length ?? 0 });
    }

    if (action === "upload-asset" && req.method === "POST") {
      // One-off image upload (e.g. setting image). Does NOT insert into property_photos.
      const form = await req.formData();
      const file = form.get("file");
      const folder = String(form.get("folder") || "assets");
      if (!(file instanceof File)) return json({ error: "file required" }, 400);
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const buf = new Uint8Array(await file.arrayBuffer());
      const up = await supabase.storage.from(BUCKET).upload(path, buf, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });
      if (up.error) return json({ error: up.error.message }, 400);
      const signed = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
      if (signed.error || !signed.data) return json({ error: signed.error?.message || "sign failed" }, 400);
      return json({ url: signed.data.signedUrl, storage_path: path });
    }

    return json({ error: "Not found" }, 404);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});