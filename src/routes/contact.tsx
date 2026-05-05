import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { properties } from "@/data/properties";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — [BRAND]" },
      { name: "description", content: "Begin a conversation. We reply within a day." },
      { property: "og:title", content: "Contact — [BRAND]" },
      { property: "og:description", content: "Begin a conversation. We reply within a day." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="page-fade bg-cream">
      <Nav />
      <div className="pt-32" />
      <section className="grid md:grid-cols-2 min-h-[calc(100vh-8rem)]">
        <div className="relative aspect-[4/5] md:aspect-auto bg-mist overflow-hidden">
          <img src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1600&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="bg-cream py-20 md:py-24 px-6 md:px-16 flex items-center">
          <div className="w-full max-w-lg">
            <span className="smallcaps text-warmth">Contact</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 font-light leading-[1.05]">Begin a conversation.</h1>
            <p className="mt-6 text-ink/80">We reply within a day, often sooner.</p>

            {sent ? (
              <p className="mt-12 font-display italic text-3xl text-ocean">Thank you. We'll be in touch.</p>
            ) : (
              <form className="mt-12 space-y-6" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <Field label="Name" name="name" />
                <Field label="Email" name="email" type="email" />
                <Field label="Phone" name="phone" type="tel" />
                <div className="flex flex-col gap-2">
                  <label className="smallcaps text-ink/60">Property of interest</label>
                  <select className="bg-transparent border-b border-mist py-2 focus:outline-none focus:border-ocean">
                    {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    <option value="">I'm not sure yet</option>
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
          </div>
        </div>
      </section>
      <Footer />
    </div>
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
