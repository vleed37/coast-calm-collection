import { supabase } from "@/integrations/supabase/client";

const TOKEN_KEY = "lb_admin_token";
const FUNCTIONS_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const adminToken = {
  get: () => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

function headers(extra: Record<string, string> = {}) {
  const t = adminToken.get();
  return {
    "apikey": ANON,
    "Authorization": t ? `Bearer ${t}` : "",
    ...extra,
  };
}

async function call(fn: string, action: string, init: RequestInit) {
  const res = await fetch(`${FUNCTIONS_BASE}/${fn}/${action}`, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `${res.status} ${res.statusText}`);
  return body;
}

export const adminAuth = {
  async login(password: string) {
    const body = await call("admin-auth", "login", {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": ANON },
      body: JSON.stringify({ password }),
    });
    adminToken.set(body.token);
    return body.token as string;
  },
  async verify() {
    if (!adminToken.get()) return false;
    try {
      const r = await call("admin-auth", "verify", { method: "GET", headers: headers() });
      return !!r.ok;
    } catch { return false; }
  },
  logout() { adminToken.clear(); },
};

type DataArgs = {
  table: "properties" | "guide_articles" | "enquiries" | "property_photos";
  op: "list" | "select" | "insert" | "update" | "delete" | "upsert";
  id?: string;
  payload?: unknown;
  filter?: Record<string, unknown>;
  select?: string;
  order?: { column: string; ascending?: boolean };
};

export async function adminData<T = unknown>(args: DataArgs): Promise<T> {
  const body = await call("admin-data", "", {
    method: "POST",
    headers: headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(args),
  });
  return body.data as T;
}

export const adminPhotos = {
  async upload(file: File, propertyId: string) {
    // Resize client-side to max 2400px wide, JPEG q82.
    const resized = await resizeImage(file, 2400, 0.82);
    const form = new FormData();
    form.append("file", resized.blob, resized.name);
    form.append("property_id", propertyId);
    form.append("width", String(resized.width));
    form.append("height", String(resized.height));
    return call("admin-photos", "upload", {
      method: "POST",
      headers: headers(),
      body: form,
    });
  },
  setCover(id: string, property_id: string) {
    return call("admin-photos", "set-cover", {
      method: "POST",
      headers: headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ id, property_id }),
    });
  },
  reorder(items: { id: string; sort_order: number }[]) {
    return call("admin-photos", "reorder", {
      method: "POST",
      headers: headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ items }),
    });
  },
  remove(id: string) {
    return call("admin-photos", "delete", {
      method: "POST",
      headers: headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ id }),
    });
  },
  async uploadAsset(file: File, folder = "assets"): Promise<{ url: string; storage_path: string }> {
    const resized = await resizeImage(file, 2400, 0.82);
    const form = new FormData();
    form.append("file", resized.blob, resized.name);
    form.append("folder", folder);
    const body = await call("admin-photos", "upload-asset", {
      method: "POST",
      headers: headers(),
      body: form,
    });
    return { url: body.url, storage_path: body.storage_path };
  },
};

async function resizeImage(file: File, maxWidth: number, quality: number) {
  const dataUrl = await new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = dataUrl;
  });
  const scale = Math.min(1, maxWidth / img.naturalWidth);
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  const blob = await new Promise<Blob>((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("canvas toBlob failed"))), "image/jpeg", quality)
  );
  const baseName = file.name.replace(/\.[^.]+$/, "");
  return { blob, name: `${baseName}.jpg`, width: w, height: h };
}

// Re-export supabase for convenience in admin read paths that hit public-allowed data.
export { supabase };