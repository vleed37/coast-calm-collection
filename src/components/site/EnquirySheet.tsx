import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ReactNode, useState } from "react";
import { EnquiryForm } from "./EnquiryForm";

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
          <div className="px-6 pb-10 pt-6">
            <EnquiryForm defaultProperty={defaultProperty} onSubmitted={() => setSubmitted(true)} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
