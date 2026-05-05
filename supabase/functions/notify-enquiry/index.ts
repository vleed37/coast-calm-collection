// Notifies Linda by email when a new enquiry is submitted.
// Uses Resend when RESEND_API_KEY + LINDA_NOTIFY_EMAIL are set; otherwise logs.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const enquiry = await req.json();
    const to = Deno.env.get("LINDA_NOTIFY_EMAIL");
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
    const subject = `New enquiry from ${enquiry.name ?? "unknown"}`;

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