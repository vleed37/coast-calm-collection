import { useRef, useState } from "react";
import { adminPhotos } from "@/lib/admin-client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Loader2, X } from "lucide-react";

export function SingleImageUploader({
  label, value, onChange, folder = "assets",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handle = async (files: FileList | File[] | null) => {
    const file = files && files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please drop an image file"); return; }
    setUploading(true);
    try {
      const { url } = await adminPhotos.uploadAsset(file, folder);
      onChange(url);
      toast.success("Uploaded");
    } catch (e) { toast.error((e as Error).message); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handle(e.dataTransfer.files); }}
        className={`border-2 border-dashed rounded p-4 transition-colors ${
          dragOver ? "border-ocean bg-ocean/5" : "border-mist bg-white"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handle(e.target.files)}
        />
        {value ? (
          <div className="flex items-start gap-3">
            <img src={value} alt="" className="w-32 h-20 object-cover rounded" />
            <div className="flex flex-col gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Replace"}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => onChange("")}>
                <X className="w-4 h-4 mr-1" />Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Upload className="w-6 h-6 mx-auto mb-2 text-ink/40" />
            <p className="text-xs text-ink/60 mb-2">Drag &amp; drop or</p>
            <Button type="button" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading…</> : "Choose file"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}