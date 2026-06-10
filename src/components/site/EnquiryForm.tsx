import { useState, useEffect, ReactNode } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block uppercase tracking-[0.2em] text-xs text-warmth font-sans mb-3">
      {children}
    </label>
  );
}

const inputCls =
  "bg-transparent border-0 border-b border-mist focus:border-ocean transition-colors duration-300 py-4 px-0 outline-none w-full text-ink placeholder:text-ink/40 font-sans";

function DateField({ value, onChange }: { value?: Date; onChange: (d?: Date) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "bg-transparent border-0 border-b border-mist focus:border-ocean transition-colors duration-300 py-4 px-0 outline-none w-full text-left flex items-center justify-between font-sans",
            value ? "text-ink" : "text-ink/40"
          )}
        >
          <span>{value ? format(value, "d MMMM yyyy") : "Select date"}</span>
          <CalendarIcon className="h-4 w-4 text-warmth" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
      </PopoverContent>
    </Popover>
  );
}

export function EnquiryForm({
  defaultProperty,
  onSubmitted,
}: {
  defaultProperty?: string;
  onSubmitted?: () => void;
}) {
  const [checkin, setCheckin] = useState<Date | undefined>();
  const [checkout, setCheckout] = useState<Date | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [propertyOptions, setPropertyOptions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("properties")
      .select("slug, name")
      .eq("is_published", true)
      .eq("coming_soon", false)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (!cancelled && data) {
          setPropertyOptions(data.map((p) => ({ id: p.slug, name: p.name })));
        }
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <form
      className="space-y-8"
      onSubmit={async (e) => {
        e.preventDefault();
        if (submitting) return;
        const fd = new FormData(e.currentTarget);
        const payload = {
          name: String(fd.get("name") || "").trim(),
          email: String(fd.get("email") || "").trim(),
          phone: String(fd.get("phone") || "").trim() || null,
          property_of_interest: String(fd.get("property") || "") || null,
          check_in: checkin ? format(checkin, "yyyy-MM-dd") : null,
          check_out: checkout ? format(checkout, "yyyy-MM-dd") : null,
          message: String(fd.get("message") || "").trim() || null,
        };
        const schema = z.object({
          name: z.string().min(1, "Please add your name").max(200),
          email: z.string().email("Please use a valid email").max(320),
          phone: z.string().max(50).nullable(),
          property_of_interest: z.string().nullable(),
          check_in: z.string().nullable(),
          check_out: z.string().nullable(),
          message: z.string().max(5000).nullable(),
        });
        const parsed = schema.safeParse(payload);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0]?.message ?? "Please check the form and try again.");
          return;
        }
        setSubmitting(true);
        const { data: newId, error } = await supabase.rpc("submit_enquiry", {
          p_name: parsed.data.name,
          p_email: parsed.data.email,
          p_phone: parsed.data.phone,
          p_property_of_interest: parsed.data.property_of_interest,
          p_check_in: parsed.data.check_in,
          p_check_out: parsed.data.check_out,
          p_message: parsed.data.message,
        } as never);
        if (error || !newId) {
          setSubmitting(false);
          toast.error("Couldn't send right now. Please try again.");
          return;
        }
        // Fire-and-forget notification
        supabase.functions.invoke("notify-enquiry", { body: { enquiry_id: newId } }).catch(() => {});
        toast.success("Enquiry sent — we'll reply within a day.");
        setSubmitting(false);
        (e.target as HTMLFormElement).reset();
        setCheckin(undefined);
        setCheckout(undefined);
        onSubmitted?.();
      }}
    >
      <div>
        <FieldLabel>Name</FieldLabel>
        <input type="text" name="name" className={inputCls} />
      </div>
      <div>
        <FieldLabel>Email</FieldLabel>
        <input type="email" name="email" className={inputCls} />
      </div>
      <div>
        <FieldLabel>Phone</FieldLabel>
        <input type="tel" name="phone" className={inputCls} />
      </div>
      <div>
        <FieldLabel htmlFor="property-interest">Property of interest</FieldLabel>
        <select id="property-interest" name="property" defaultValue={defaultProperty ?? ""} className={inputCls}>
          <option value="">I'm not sure yet</option>
          {propertyOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <FieldLabel>Check-In</FieldLabel>
          <DateField value={checkin} onChange={setCheckin} />
        </div>
        <div>
          <FieldLabel>Check-Out</FieldLabel>
          <DateField value={checkout} onChange={setCheckout} />
        </div>
      </div>
      <div>
        <FieldLabel>Message</FieldLabel>
        <textarea name="message" rows={4} className={cn(inputCls, "resize-none")} />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-ocean text-cream py-5 uppercase tracking-[0.2em] text-sm hover:bg-ink transition-colors duration-300 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}