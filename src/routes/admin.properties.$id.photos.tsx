import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { adminPhotos, adminData } from "@/lib/admin-client";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, ArrowUp, ArrowDown, Star, Trash2, Upload, Loader2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/properties/$id/photos")({
  component: PhotosPage,
});

type Photo = {
  id: string;
  image_url: string;
  is_cover: boolean;
  sort_order: number;
};

function PhotosPage() {
  const { id } = Route.useParams();
  const [propName, setPropName] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const prop = await adminData<{ name: string }>({ table: "properties", op: "select", id });
      setPropName(prop.name);
      const data = await adminData<Photo[]>({
        table: "property_photos", op: "list",
        select: "id, image_url, is_cover, sort_order",
        filter: { property_id: id },
        order: { column: "sort_order", ascending: true },
      });
      setPhotos(data ?? []);
    } catch (e) { toast.error((e as Error).message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(files.length);
    let done = 0;
    for (const file of Array.from(files)) {
      try {
        await adminPhotos.upload(file, id);
      } catch (e) {
        toast.error(`${file.name}: ${(e as Error).message}`);
      }
      done++;
      setUploading(files.length - done);
    }
    toast.success("Uploaded");
    if (fileRef.current) fileRef.current.value = "";
    load();
  };

  const setCover = async (photoId: string) => {
    try {
      await adminPhotos.setCover(photoId, id);
      toast.success("Cover set");
      load();
    } catch (e) { toast.error((e as Error).message); }
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const sorted = [...photos].sort((a, b) =>
      (a.is_cover === b.is_cover ? a.sort_order - b.sort_order : a.is_cover ? -1 : 1)
    );
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= sorted.length) return;
    const a = sorted[idx], b = sorted[newIdx];
    const items = [
      { id: a.id, sort_order: b.sort_order },
      { id: b.id, sort_order: a.sort_order },
    ];
    try {
      await adminPhotos.reorder(items);
      load();
    } catch (e) { toast.error((e as Error).message); }
  };

  const remove = async (photoId: string) => {
    try {
      await adminPhotos.remove(photoId);
      toast.success("Deleted");
      load();
    } catch (e) { toast.error((e as Error).message); }
  };

  const sorted = [...photos].sort((a, b) =>
    a.is_cover === b.is_cover ? a.sort_order - b.sort_order : a.is_cover ? -1 : 1
  );

  return (
    <>
      <AdminPageHeader
        title={`Photos — ${propName || "…"}`}
        description="Upload, reorder, set cover, delete."
        action={
          <Link to="/admin/properties/$id" params={{ id }}>
            <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to property</Button>
          </Link>
        }
      />

      <div className="bg-white border border-mist rounded p-6 mb-6">
        <label className="flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onUpload(e.target.files)}
          />
          <Button type="button" onClick={() => fileRef.current?.click()} disabled={uploading > 0}>
            {uploading > 0 ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {uploading > 0 ? `Uploading… (${uploading} left)` : "Upload photos"}
          </Button>
          <p className="text-xs text-ink/60">
            Multiple files supported. Images are resized to max 2400px wide and compressed before upload.
          </p>
        </label>
      </div>

      {loading ? (
        <p className="text-ink/60">Loading…</p>
      ) : sorted.length === 0 ? (
        <p className="text-ink/60">No photos yet. Upload some above.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sorted.map((p, idx) => (
            <div key={p.id} className="bg-white border border-mist rounded overflow-hidden flex flex-col">
              <div className="relative aspect-[4/3] bg-mist/40">
                <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                {p.is_cover && (
                  <span className="absolute top-2 left-2 bg-ocean text-cream text-[10px] uppercase tracking-widest px-2 py-1 rounded">
                    Cover
                  </span>
                )}
              </div>
              <div className="p-2 flex items-center justify-between gap-1">
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => move(idx, -1)} title="Move up">
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => move(idx, 1)} title="Move down">
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  {!p.is_cover && (
                    <Button size="icon" variant="ghost" onClick={() => setCover(p.id)} title="Set as cover">
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost" title="Delete">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
                      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => remove(p.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}