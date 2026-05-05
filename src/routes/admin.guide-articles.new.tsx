import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const Route = createFileRoute("/admin/guide-articles/new")({
  component: () => (<><AdminPageHeader title="New Article" /><ArticleForm /></>),
});
