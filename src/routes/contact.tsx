import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildHead({
      title: "Begin a Conversation | Lone Bull Properties",
      description:
        "Direct booking enquiries for our West Coast villas. We reply within a day, often sooner.",
      path: "/contact",
      type: "website",
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
              <div className="mt-12">
                <EnquiryForm onSubmitted={() => setSent(true)} />
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
