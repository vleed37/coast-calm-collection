import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { adminData } from "@/lib/admin-client";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/enquiries")({
  component: Enquiries,
});

type Row = {
  id: string; name: string; email: string; phone: string | null;
  property_of_interest: string | null; check_in: string | null;
  check_out: string | null; message: string | null; status: string;
  created_at: string;
};

const STATUSES = ["new", "replied", "closed"];

function Enquiries() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const load = async () => {
    try {
      const data = await adminData<Row[]>({
        table: "enquiries", op: "list",
        order: { column: "created_at", ascending: false },
      });
      setRows(data);
    } catch (e) { toast.error((e as Error).message); }
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminData({ table: "enquiries", op: "update", id, payload: { status } });
      setRows((rs) => rs?.map((r) => r.id === id ? { ...r, status } : r) ?? null);
      toast.success("Updated");
    } catch (e) { toast.error((e as Error).message); }
  };

  const exportCsv = () => {
    if (!rows) return;
    const headers = ["created_at","name","email","phone","property_of_interest","check_in","check_out","status","message"];
    const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => esc((r as any)[h])).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = `enquiries-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <AdminPageHeader
        title="Enquiries"
        description="Submissions from the contact form."
        action={<Button variant="outline" onClick={exportCsv}><Download className="w-4 h-4 mr-2" />Export CSV</Button>}
      />
      {!rows ? <p className="text-ink/60">Loading…</p> : (
        <div className="bg-white border border-mist rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-mist/40 text-ink/60 smallcaps">
              <tr>
                <th className="w-8"></th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Property</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <React.Fragment key={r.id}>
                  <tr
                    className="border-t border-mist hover:bg-cream/50 cursor-pointer"
                    onClick={() => setOpen((o) => ({ ...o, [r.id]: !o[r.id] }))}
                  >
                    <td className="pl-3">{open[r.id] ? <ChevronDown className="w-4 h-4 text-ink/40" /> : <ChevronRight className="w-4 h-4 text-ink/40" />}</td>
                    <td className="px-4 py-3 text-ink/70 text-xs">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3">{r.name}</td>
                    <td className="px-4 py-3 text-ink/70">{r.email}</td>
                    <td className="px-4 py-3 text-ink/70">{r.property_of_interest ?? "—"}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                        <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                  {open[r.id] && (
                    <tr className="bg-cream/30 border-t border-mist">
                      <td></td>
                      <td colSpan={5} className="px-4 py-4 text-sm space-y-2">
                        <div className="grid grid-cols-3 gap-4">
                          <div><span className="smallcaps text-ink/50">Phone</span><div>{r.phone ?? "—"}</div></div>
                          <div><span className="smallcaps text-ink/50">Check in</span><div>{r.check_in ?? "—"}</div></div>
                          <div><span className="smallcaps text-ink/50">Check out</span><div>{r.check_out ?? "—"}</div></div>
                        </div>
                        <div>
                          <span className="smallcaps text-ink/50">Message</span>
                          <p className="mt-1 whitespace-pre-wrap text-ink/80">{r.message ?? "—"}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-ink/50">No enquiries yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
