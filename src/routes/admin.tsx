import { createFileRoute, redirect } from "@tanstack/react-router";
import { adminToken } from "@/lib/admin-client";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin | Lone Bull Rentals" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    if (!adminToken.get()) throw redirect({ to: "/admin/login" });
    // Token validity is enforced server-side on every admin call;
    // if it's expired, edge functions return 401 and the UI shows the error.
  },
  component: AdminShell,
});
