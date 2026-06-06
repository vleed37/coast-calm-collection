import { useEffect, useRef, useState } from "react";
import { adminPhotos, adminData } from "@/lib/admin-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Star, Trash2, Upload, Loader2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Photo = {
  id: string;
  image_url: string;
  is_cover: boolean;
  sort_order: number;
};

export function PhotoManager({ propertyId }: { propertyId: string }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const data = await adminData<Photo[]>({
        table: "property_photos", op: "list",
        select: "id, image_url, is_cover, sort_order",
        filter: { property_id: propertyId },
        order: { column: "sort_order", ascending: true },
      });
      setPhotos(data ?? []);
    } catch (e) { toast.error((e as Error).message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [propertyId]);

  const handleFiles = async (files: FileList | File[] | null) => {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) {
      toast.error("Please drop image files only");
      return;
    }
    setUploading(arr.length);
    let done = 0;
    for (const file of arr) {
      try { await adminPhotos.upload(file, propertyId); }
      catch (e) { toast.error(`${file.name}: ${(e as Error).message}`); }
      done++;
      setUploading(arr.length - done);
    }
    toast.success(`Uploaded ${arr.length} photo${arr.length === 1 ? "" : "s"}`);
    if (fileRef.current) fileRef.current.value = "";
    load();
  };

  const setCover = async (photoId: string) => {
    try { await adminPhotos.setCover(photoId, propertyId); toast.success("Cover set"); load(); }
    catch (e) { toast.error((e as Error).message); }
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= sorted.length) return;
    const a = sorted[idx], b = sorted[newIdx];
    try {
      await adminPhotos.reorder([
        { id: a.id, sort_order: b.sort_order },
        { id: b.id, sort_order: a.sort_order },
      ]);
      load();
    } catch (e) { toast.error((e as Error).message); }
  };

  const remove = async (photoId: string) => {
    try { await adminPhotos.remove(photoId); toast.success("Deleted"); load(); }
    catch (e) { toast.error((e as Error).message); }
  };

  const sorted = [...photos].sort((a, b) =>
    a.is_cover === b.is_cover ? a.sort_order - b.sort_order : a.is_cover ? -1 : 1
  );

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded p-8 text-center transition-colors ${
          dragOver ? "border-ocean bg-ocean/5" : "border-mist bg-white"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload className="w-8 h-8 mx-auto mb-3 text-ink/40" />
        <p className="text-sm text-ink/70 mb-3">
          Drag &amp; drop images here, or
        </p>
        <Button type="button" onClick={() => fileRef.current?.click()} disabled={uploading > 0}>
          {uploading > 0 ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading… ({uploading} left)</> : "Choose files"}
        </Button>
        <p className="text-xs text-ink/50 mt-3">
          Multiple files supported · resized to max 2400px · JPEG compressed
        </p>
      </div>

      {loading ? (
        <p className="text-ink/60 text-sm">Loading photos…</p>
      ) : sorted.length === 0 ? (
        <p className="text-ink/60 text-sm">No photos yet.</p>
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
                  <Button type="button" size="icon" variant="ghost" onClick={() => move(idx, -1)} title="Move up">
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" onClick={() => move(idx, 1)} title="Move down">
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  {!p.is_cover && (
                    <Button type="button" size="icon" variant="ghost" onClick={() => setCover(p.id)} title="Set as cover">
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" size="icon" variant="ghost" title="Delete">
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
    </div>
  );
}