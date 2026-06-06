import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Home, Building2, BookOpen, Mail } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

const links = [
  { to: "/admin", label: "Dashboard", icon: Home, exact: true },
  { to: "/admin/properties", label: "Properties", icon: Building2 },
  { to: "/admin/guide-articles", label: "Guide Articles", icon: BookOpen },
  { to: "/admin/enquiries", label: "Enquiries", icon: Mail },
] as const;

export function AdminShell() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-cream flex">
      <aside className="w-64 bg-ink text-cream flex flex-col fixed inset-y-0 left-0">
        <div className="px-6 py-8 border-b border-cream/10">
          <span className="font-display text-2xl font-light">Lone Bull Properties</span>
          <p className="smallcaps text-cream/50 mt-2">Admin</p>
        </div>
        <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
          {links.map((l) => {
            const active = isActive(l.to, "exact" in l ? l.exact : false);
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                  active ? "bg-cream/5 text-warmth" : "text-cream/80 hover:bg-cream/5 hover:text-cream"
                }`}
              >
                <Icon className="w-4 h-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={signOut}
          className="m-3 flex items-center gap-3 px-3 py-2.5 rounded text-sm text-cream/70 hover:bg-cream/5 hover:text-cream transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </aside>
      <main className="flex-1 ml-64 p-10">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-8 pb-6 border-b border-mist">
      <div>
        <h1 className="font-display text-4xl font-light">{title}</h1>
        {description && <p className="text-ink/60 mt-2 text-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
