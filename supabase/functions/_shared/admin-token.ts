// Shared HMAC token + CORS helpers for admin edge functions.
const enc = new TextEncoder();

function b64urlEncode(bytes: Uint8Array): string {
  let s = btoa(String.fromCharCode(...bytes));
  return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecode(s: string): Uint8Array {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

export async function signToken(expSeconds = 60 * 60 * 24 * 7): Promise<string> {
  const secret = Deno.env.get("ADMIN_SESSION_SECRET");
  if (!secret) throw new Error("ADMIN_SESSION_SECRET not set");
  const payload = b64urlEncode(enc.encode(JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + expSeconds,
  })));
  const sig = b64urlEncode(await hmac(secret, payload));
  return `${payload}.${sig}`;
}

export async function verifyToken(token: string | null | undefined): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const secret = Deno.env.get("ADMIN_SESSION_SECRET");
  if (!secret) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = b64urlEncode(await hmac(secret, payload));
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff !== 0) return false;
  try {
    const data = JSON.parse(new TextDecoder().decode(b64urlDecode(payload)));
    if (typeof data.exp !== "number") return false;
    if (Math.floor(Date.now() / 1000) > data.exp) return false;
    return true;
  } catch { return false; }
}

export function getBearer(req: Request): string | null {
  const h = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!h) return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}