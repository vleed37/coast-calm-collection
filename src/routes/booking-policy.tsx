import { createFileRoute } from "@tanstack/react-router";
import { buildHead, faqGraph } from "@/lib/seo";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="pb-6 border-b border-mist last:border-0">
        <h2 className="font-display text-3xl md:text-4xl font-light">{title}</h2>
        <div className="mt-6 text-base text-ink/85" style={{ lineHeight: 1.8 }}>
          {children}
        </div>
      </section>
    </Reveal>
  );
}

function CancellationTable({
  title,
  rows,
}: {
  title: string;
  rows: { notice: string; refund: string }[];
}) {
  return (
    <div className="mt-6">
      <h3 className="text-sm smallcaps text-warmth mb-3">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-mist">
              <th className="py-2 pr-6 font-normal text-ink/60">Notice before check-in</th>
              <th className="py-2 font-normal text-ink/60">Deposit refunded</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.notice} className="border-b border-mist/50">
                <td className="py-2 pr-6">{row.notice}</td>
                <td className="py-2">{row.refund}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/booking-policy")({
  head: () =>
    buildHead({
      title: "Booking Policy | Lone Bull Rentals",
      description:
        "How to stay with us — reservations, payment terms, cancellation policy, house rules, and check-in details for our West Coast villas.",
      path: "/booking-policy",
      type: "article",
      structuredData: faqGraph([
        { q: "Payment Terms", a: "A 50% deposit secures the dates. The balance is due 30 days before arrival. Bookings made within 30 days of arrival are payable in full at the time of booking." },
        { q: "Cancellation", a: "Standard and holiday-season cancellation policies apply. We strongly recommend travel insurance." },
        { q: "House Rules", a: "Maximum 4 guests. No smoking, parties, or pets. Quiet hours 10 PM – 7 AM. Minimum booking age 21." },
        { q: "Check-In & Check-Out", a: "Check-in from 2:00 PM. Check-out strictly by 10:00 AM. We kindly ask that guests adhere to the above times, so that our team can prepare the space flawlessly for our next arrivals. Any times outside of the above must please be arranged directly with the property manager." },
      ]),
    }),
  component: PolicyPage,
});

function PolicyPage() {
  return (
    <div className="page-fade bg-cream min-h-screen">
      <Nav />
      <div className="pt-28 md:pt-32" />
      <section className="max-w-2xl mx-auto px-6 pb-20 md:pb-32 pt-4">
        <Reveal>
          <span className="smallcaps text-warmth">The Fine Print</span>
          <h1 className="font-display text-5xl md:text-7xl mt-4 font-light leading-[1]">Booking Policy</h1>
          <p className="mt-8 text-lg text-ink/80 leading-[1.8]">
            We keep this short and human. If anything is unclear, write to us.
          </p>
        </Reveal>

        <div className="mt-12 space-y-6">
          <Section title="Rates & Minimum Stay">
            <p>
              All rates are based on exclusive use of the property and are subject to seasonal variation. Guests staying 7 nights or longer may qualify for discounted rates during off-peak periods. Minimum stays apply year-round: a standard 2-night minimum, with extended minimums of 3 to 7 nights during peak holiday seasons.
            </p>
          </Section>

          <Section title="Payment Terms">
            <p>
              A 50% deposit secures the dates. The balance is due 30 days before arrival. Bookings made within 30 days of arrival are payable in full at the time of booking.
            </p>
          </Section>

          <Section title="Breakage Deposit">
            <p>
              A refundable breakage deposit is required for all bookings. Provided no damages are found after departure, it is refunded within 5 business days of check-out.
            </p>
          </Section>

          <Section title="Cancellation">
            <p>Our cancellation policy varies over holiday periods.</p>
            <CancellationTable
              title="Standard cancellation"
              rows={[
                { notice: "More than 1 month", refund: "100%" },
                { notice: "More than 1 week", refund: "50%" },
                { notice: "Less than 1 week", refund: "0%" },
              ]}
            />
            <CancellationTable
              title="Holiday-season cancellation"
              rows={[
                { notice: "More than 2 months", refund: "100%" },
                { notice: "More than 1 month", refund: "50%" },
                { notice: "Less than 1 month", refund: "0%" },
              ]}
            />
            <p className="mt-6">We strongly recommend travel insurance.</p>
          </Section>

          <Section title="House Rules">
            <ul className="list-disc pl-5 space-y-2">
              <li>Maximum of 4 guests may sleep at the property.</li>
              <li>Visitors must be pre-approved with the property manager.</li>
              <li>Minimum booking age is 21.</li>
              <li>Children of all ages are welcome. Cribs are available on request for ages 0–3, subject to availability.</li>
              <li>No smoking.</li>
              <li>No parties or events.</li>
              <li>No pets.</li>
              <li>Quiet hours are between 10:00 PM and 7:00 AM.</li>
            </ul>
          </Section>

          <Section title="Check-In & Check-Out">
            <p>
              Check-in from 2:00 PM. Check-out strictly by 10:00 AM. We kindly ask that guests adhere to the above times, so that our team can prepare the space flawlessly for our next arrivals. Any times outside of the above must please be arranged directly with the property manager.
            </p>
          </Section>

          <Section title="Documents">
            <p>
              All guests are required to sign our Terms &amp; Conditions before arrival and submit a copy of their ID or driver&apos;s licence, along with confirmation of their vehicle details by the latest 24-hours before arrival.
            </p>
          </Section>
        </div>
      </section>
      <Footer />
    </div>
  );
}

