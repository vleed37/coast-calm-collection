import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminData } from "@/lib/admin-client";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PhotoManager } from "@/components/admin/PhotoManager";

export const Route = createFileRoute("/admin/properties/$id/photos")({
  component: PhotosPage,
});

function PhotosPage() {
  const { id } = Route.useParams();
  const [propName, setPropName] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const prop = await adminData<{ name: string }>({ table: "properties", op: "select", id });
        setPropName(prop.name);
      } catch (e) { toast.error((e as Error).message); }
    })();
  }, [id]);

  return (
    <>
      <AdminPageHeader
        title={`Photos — ${propName || "…"}`}
        description="Drag & drop to upload, reorder, set cover, delete."
        action={
          <Link to="/admin/properties/$id" params={{ id }}>
            <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to property</Button>
          </Link>
        }
      />
      <PhotoManager propertyId={id} />
    </>
  );
}