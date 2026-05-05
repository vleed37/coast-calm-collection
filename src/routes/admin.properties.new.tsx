import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const Route = createFileRoute("/admin/properties/new")({
  component: () => (
    <>
      <AdminPageHeader title="New Property" />
      <PropertyForm />
    </>
  ),
});
