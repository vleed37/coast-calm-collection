import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { adminAuth } from "@/lib/admin-client";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/admin_/login")({
  head: () => ({
    meta: [
      { title: "Admin Sign In | Lone Bull Rentals" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await adminAuth.login(password);
      navigate({ to: "/admin" });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <span className="smallcaps text-warmth">Private</span>
        <h1 className="font-display text-5xl md:text-6xl font-light mt-4 leading-[0.95]">Admin.</h1>
        <form onSubmit={onSubmit} className="mt-12 flex flex-col gap-8">
          <label className="flex flex-col gap-2">
            <span className="smallcaps text-ink/60">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-b border-mist focus:border-ocean focus:outline-none py-2 text-ink"
            />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-ocean text-cream px-8 py-3 uppercase tracking-[0.2em] text-xs hover:bg-ink transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
