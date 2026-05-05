import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-cream px-6 md:px-12 py-24">
      <div className="max-w-3xl mx-auto">
        <span className="smallcaps text-warmth">Admin</span>
        <h1 className="font-display text-5xl md:text-7xl font-light mt-4 leading-[0.95]">Welcome.</h1>
        {email && <p className="mt-6 text-ink/70">Signed in as {email}</p>}
        <button
          onClick={signOut}
          className="mt-12 bg-ocean text-cream px-8 py-3 uppercase tracking-[0.2em] text-xs hover:bg-ink transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
