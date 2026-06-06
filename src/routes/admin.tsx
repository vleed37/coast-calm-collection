import { createFileRoute, redirect } from "@tanstack/react-router";
import { adminAuth, adminToken } from "@/lib/admin-client";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin | Lone Bull Properties" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    if (!adminToken.get()) throw redirect({ to: "/admin/login" });
    const ok = await adminAuth.verify();
    if (!ok) {
      adminAuth.logout();
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminShell,
});
