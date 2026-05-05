import { createFileRoute } from "@tanstack/react-router";
import { buildHead, faqGraph } from "@/lib/seo";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";

const sections = [
  { h: "Reservations", b: "Houses are held by enquiry. We confirm in writing, often within the day. A reservation is held for seven days from confirmation while the deposit is arranged." },
  { h: "Payment Terms", b: "A 50% deposit secures the dates. The balance is due thirty days before arrival. Stays inside thirty days are payable in full at confirmation." },
  { h: "Cancellation", b: "Cancellations more than sixty days before arrival receive a full refund less an administrative fee. Inside sixty days, the deposit is forfeit. Inside thirty days, the full stay is non-refundable. We strongly recommend travel insurance." },
  { h: "House Rules", b: "These are quiet houses. No events, no loud music after ten, no smoking inside. Pets by prior arrangement. Numbers must not exceed the stated guest count without written agreement." },
  { h: "Check-In & Check-Out", b: "Arrival from 14:00. Departure by 11:00. We can sometimes hold luggage on either side. Late departures by arrangement, subject to availability." },
];

export const Route = createFileRoute("/booking-policy")({
  head: () =>
    buildHead({
      title: "Booking Policy | [BRAND]",
      description:
        "How to stay with us — reservations, payment terms, cancellation policy, house rules, and check-in details for our West Coast villas.",
      path: "/booking-policy",
      type: "article",
      structuredData: faqGraph(sections.map((s) => ({ q: s.h, a: s.b }))),
    }),
  component: PolicyPage,
});

function PolicyPage() {
  return (
    <div className="page-fade bg-cream min-h-screen">
      <Nav />
      <div className="pt-40 md:pt-48" />
      <section className="max-w-2xl mx-auto px-6 py-20 md:py-32">
        <Reveal>
          <span className="smallcaps text-warmth">The Fine Print</span>
          <h1 className="font-display text-5xl md:text-7xl mt-4 font-light leading-[1]">Booking Policy</h1>
          <p className="mt-8 text-lg text-ink/80 leading-[1.8]">
            We keep this short and human. If anything is unclear, write to us.
          </p>
        </Reveal>

        <div className="mt-20 space-y-12">
          {sections.map((s) => (
            <Reveal key={s.h}>
              <section className="pb-12 border-b border-mist last:border-0">
                <h2 className="font-display text-3xl md:text-4xl font-light">{s.h}</h2>
                <p className="mt-6 text-base text-ink/85" style={{ lineHeight: 1.8 }}>{s.b}</p>
              </section>
            </Reveal>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
