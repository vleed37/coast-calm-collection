// Notifies Linda by email when a new enquiry is submitted.
// Accepts only an enquiry_id and fetches the row server-side via the service-role
// client, so callers cannot inject arbitrary email content.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const payload = await req.json().catch(() => ({}));
    const enquiryId = typeof payload?.enquiry_id === "string" ? payload.enquiry_id : null;
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!enquiryId || !uuidRe.test(enquiryId)) {
      return new Response(JSON.stringify({ ok: false, error: "invalid enquiry_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: enquiry, error: fetchErr } = await admin
      .from("enquiries")
      .select("name, email, phone, property_of_interest, check_in, check_out, message")
      .eq("id", enquiryId)
      .maybeSingle();
    if (fetchErr || !enquiry) {
      return new Response(JSON.stringify({ ok: false, error: "enquiry not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const to = Deno.env.get("LINDA_NOTIFY_EMAIL") ?? "rental@lonebullgroup.co.za";
    const apiKey = Deno.env.get("RESEND_API_KEY");
    const fromAddr = Deno.env.get("ENQUIRY_FROM_EMAIL") ?? "onboarding@resend.dev";

    const fields = [
      ["Name", enquiry.name],
      ["Email", enquiry.email],
      ["Phone", enquiry.phone],
      ["Property of interest", enquiry.property_of_interest],
      ["Check-in", enquiry.check_in],
      ["Check-out", enquiry.check_out],
      ["Message", enquiry.message],
    ];
    const body = fields
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    const propertyLabel = enquiry.property_of_interest ?? "General";
    const subject = `New enquiry — ${propertyLabel} — ${enquiry.name ?? "unknown"}`;

    if (!to || !apiKey) {
      console.log("[notify-enquiry] (no email config) ", subject, "\n", body);
      return new Response(JSON.stringify({ ok: true, sent: false, reason: "missing-config" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddr,
        to: [to],
        subject,
        text: body,
        reply_to: enquiry.email,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend error", res.status, errText);
      return new Response(JSON.stringify({ ok: false, error: errText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ ok: true, sent: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("notify-enquiry error", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});