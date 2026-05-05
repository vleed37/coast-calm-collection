import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const Route = createFileRoute("/admin/properties/$id")({
  component: EditProperty,
});

function EditProperty() {
  const { id } = Route.useParams();
  return (
    <>
      <AdminPageHeader title="Edit Property" />
      <PropertyForm id={id} />
    </>
  );
}
