import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";

export function Lightbox({ images, trigger, startIndex = 0 }: { images: string[]; trigger: ReactNode; startIndex?: number }) {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(startIndex);
  const next = () => setI((p) => (p + 1) % images.length);
  const prev = () => setI((p) => (p - 1 + images.length) % images.length);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setI(startIndex)}>{trigger}</DialogTrigger>
      <DialogContent className="max-w-none w-screen h-screen bg-ink/95 border-0 p-0 rounded-none flex items-center justify-center">
        <button onClick={() => setOpen(false)} className="absolute top-6 right-6 text-cream/80 hover:text-cream"><X size={28} /></button>
        <button onClick={prev} className="absolute left-6 text-cream/80 hover:text-cream"><ChevronLeft size={36} /></button>
        <img src={images[i]} alt="" className="max-h-[88vh] max-w-[90vw] object-contain" />
        <button onClick={next} className="absolute right-6 text-cream/80 hover:text-cream"><ChevronRight size={36} /></button>
        <div className="absolute bottom-6 smallcaps text-cream/60">{i + 1} / {images.length}</div>
      </DialogContent>
    </Dialog>
  );
}
