import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { verifyToken, getBearer, corsHeaders, json } from "../_shared/admin-token.ts";

const ALLOWED = new Set(["properties", "guide_articles", "enquiries", "property_photos"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (!await verifyToken(getBearer(req))) return json({ error: "Unauthorized" }, 401);

  try {
    const body = await req.json();
    const { table, op, id, payload, match, filter, select, order } = body || {};
    if (!ALLOWED.has(table)) return json({ error: "Invalid table" }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let q;
    if (op === "insert") {
      q = supabase.from(table).insert(payload).select().single();
    } else if (op === "update") {
      if (!id) return json({ error: "id required for update" }, 400);
      q = supabase.from(table).update(payload).eq("id", id).select().single();
    } else if (op === "delete") {
      if (!id) return json({ error: "id required for delete" }, 400);
      q = supabase.from(table).delete().eq("id", id);
    } else if (op === "upsert") {
      q = supabase.from(table).upsert(payload).select().single();
    } else if (op === "select") {
      // Convenience for fetching a single row by id (e.g. duplicate flow).
      if (!id) return json({ error: "id required for select" }, 400);
      q = supabase.from(table).select("*").eq("id", id).single();
    } else if (op === "list") {
      let lq = supabase.from(table).select(select || "*");
      if (filter && typeof filter === "object") {
        for (const [k, v] of Object.entries(filter)) lq = lq.eq(k, v as never);
      }
      if (order && order.column) {
        lq = lq.order(order.column, { ascending: order.ascending !== false });
      }
      q = lq;
    } else if (op === "bulk_update" && Array.isArray(match)) {
      // match: [{ id, payload }]
      const results = [];
      for (const m of match) {
        const r = await supabase.from(table).update(m.payload).eq("id", m.id);
        if (r.error) return json({ error: r.error.message }, 400);
        results.push(r);
      }
      return json({ ok: true });
    } else {
      return json({ error: "Invalid op" }, 400);
    }

    const { data, error } = await q;
    if (error) return json({ error: error.message }, 400);
    return json({ data });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});