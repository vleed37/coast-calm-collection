import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminData } from "@/lib/admin-client";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/guide-articles/")({
  component: ArticlesList,
});

function ArticlesList() {
  const [rows, setRows] = useState<any[] | null>(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const data = await adminData<any[]>({
        table: "guide_articles", op: "list",
        select: "id,title,category,is_published,updated_at,sort_order",
        order: { column: "sort_order", ascending: true },
      });
      setRows(data ?? []);
    } catch (e) { toast.error((e as Error).message); }
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    try {
      await adminData({ table: "guide_articles", op: "delete", id });
      toast.success("Deleted"); load();
    } catch (e) { toast.error((e as Error).message); }
  };

  return (
    <>
      <AdminPageHeader
        title="Guide Articles"
        description="Local guide entries."
        action={<Button onClick={() => navigate({ to: "/admin/guide-articles/new" })}><Plus className="w-4 h-4 mr-2" />New Article</Button>}
      />
      {!rows ? <p className="text-ink/60">Loading…</p> : (
        <div className="bg-white border border-mist rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-mist/40 text-ink/60 smallcaps">
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Updated</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-mist hover:bg-cream/50">
                  <td className="px-4 py-3 font-display text-lg">{r.title}</td>
                  <td className="px-4 py-3 text-ink/70">{r.category}</td>
                  <td className="px-4 py-3">
                    <span className={`smallcaps px-2 py-1 rounded ${r.is_published ? "bg-ocean/10 text-ocean" : "bg-mist text-ink/60"}`}>
                      {r.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/60 text-xs">{new Date(r.updated_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => navigate({ to: "/admin/guide-articles/$id", params: { id: r.id } })}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost"><Trash2 className="w-4 h-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {r.title}?</AlertDialogTitle>
                            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => remove(r.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-ink/50">No articles yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
