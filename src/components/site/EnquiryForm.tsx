import { useState, ReactNode } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { properties } from "@/data/properties";

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="block uppercase tracking-[0.2em] text-xs text-warmth font-sans mb-3">
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

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
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
        <FieldLabel>Property of interest</FieldLabel>
        <select name="property" defaultValue={defaultProperty ?? ""} className={inputCls}>
          <option value="">I'm not sure yet</option>
          {properties.map((p) => (
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
        <textarea rows={4} className={cn(inputCls, "resize-none")} />
      </div>
      <button
        type="submit"
        className="w-full bg-ocean text-cream py-5 uppercase tracking-[0.2em] text-sm hover:bg-ink transition-colors duration-300"
      >
        Send enquiry
      </button>
    </form>
  );
}