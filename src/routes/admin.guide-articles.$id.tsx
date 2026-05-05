import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const Route = createFileRoute("/admin/guide-articles/$id")({
  component: Edit,
});

function Edit() {
  const { id } = Route.useParams();
  return (<><AdminPageHeader title="Edit Article" /><ArticleForm id={id} /></>);
}
