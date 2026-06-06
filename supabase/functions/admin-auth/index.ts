import { signToken, verifyToken, getBearer, corsHeaders, json } from "../_shared/admin-token.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const url = new URL(req.url);
  const action = url.pathname.split("/").pop();

  try {
    if (action === "login" && req.method === "POST") {
      const { password } = await req.json().catch(() => ({}));
      const expected = Deno.env.get("ADMIN_PASSWORD");
      if (!expected) return json({ error: "ADMIN_PASSWORD not configured" }, 500);
      if (typeof password !== "string" || password.length === 0) {
        return json({ error: "Password required" }, 400);
      }
      // constant-time compare
      if (password.length !== expected.length) {
        await new Promise((r) => setTimeout(r, 400));
        return json({ error: "Invalid password" }, 401);
      }
      let diff = 0;
      for (let i = 0; i < expected.length; i++) diff |= password.charCodeAt(i) ^ expected.charCodeAt(i);
      if (diff !== 0) {
        await new Promise((r) => setTimeout(r, 400));
        return json({ error: "Invalid password" }, 401);
      }
      const token = await signToken();
      return json({ token });
    }

    if (action === "verify") {
      const token = getBearer(req);
      const ok = await verifyToken(token);
      return json({ ok });
    }

    return json({ error: "Not found" }, 404);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});