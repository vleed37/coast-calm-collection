import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ReactNode, useState } from "react";
import { properties } from "@/data/properties";

export function EnquirySheet({ trigger, defaultProperty }: { trigger: ReactNode; defaultProperty?: string }) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-[480px] bg-cream border-l border-mist overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-4xl font-light">Enquire</SheetTitle>
          <p className="text-ink/70 text-sm">We reply within a day, often sooner.</p>
        </SheetHeader>
        {submitted ? (
          <div className="px-6 py-12 text-center">
            <p className="font-display italic text-2xl text-ocean">Thank you.</p>
            <p className="text-ink/70 mt-3">We'll be in touch.</p>
          </div>
        ) : (
          <form
            className="px-6 pb-10 space-y-5"
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          >
            <Field label="Name" name="name" />
            <Field label="Email" name="email" type="email" />
            <Field label="Phone" name="phone" type="tel" />
            <div className="flex flex-col gap-2">
              <label className="smallcaps text-ink/60">Property of interest</label>
              <select name="property" defaultValue={defaultProperty ?? ""} className="bg-transparent border-b border-mist py-2 focus:outline-none focus:border-ocean">
                <option value="">I'm not sure yet</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Check-in" name="checkin" type="date" />
              <Field label="Check-out" name="checkout" type="date" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="smallcaps text-ink/60">Message</label>
              <textarea rows={4} className="bg-transparent border-b border-mist py-2 focus:outline-none focus:border-ocean resize-none" />
            </div>
            <button type="submit" className="w-full bg-ocean text-cream py-4 smallcaps hover:bg-ink transition-colors">
              Send enquiry
            </button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="smallcaps text-ink/60">{label}</label>
      <input type={type} name={name} className="bg-transparent border-b border-mist py-2 focus:outline-none focus:border-ocean" />
    </div>
  );
}
