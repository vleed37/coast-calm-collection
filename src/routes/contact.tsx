import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Facebook } from "lucide-react";
import contactCover from "@/assets/contact-cover.jpg.asset.json";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildHead({
      title: "Contact Us | Lone Bull Rentals",
      description:
        "Get in touch with Lone Bull Rentals — email, operating hours, and our head office on the Cape Town waterfront.",
      path: "/contact",
      type: "website",
    }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="page-fade bg-cream">
      <Nav />
      <div className="pt-32" />
      <section className="grid md:grid-cols-2 min-h-[calc(100vh-8rem)]">
        <div className="relative aspect-[4/5] md:aspect-auto bg-mist overflow-hidden">
          <img src={contactCover.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="bg-cream py-20 md:py-24 px-6 md:px-16 flex items-center">
          <div className="w-full max-w-lg">
            <span className="smallcaps text-warmth">Contact</span>
            <h1 className="font-display text-6xl md:text-8xl mt-4 font-light leading-[0.95]">Get in touch.</h1>

            <div className="mt-12 space-y-10 text-ink/80">
              <div>
                <h2 className="smallcaps text-ocean text-[0.78rem] tracking-[0.14em]">Get in touch</h2>
                <p className="mt-3">
                  Email:{" "}
                  <a
                    href="mailto:rental@lonebullgroup.co.za"
                    className="link-underline text-ink"
                  >
                    rental@lonebullgroup.co.za
                  </a>
                </p>
              </div>

              <div>
                <h2 className="smallcaps text-ocean text-[0.78rem] tracking-[0.14em]">Operating Hours</h2>
                <p className="mt-3">Monday – Friday: 08:00 AM – 04:00 PM</p>
                <p>Saturday, Sunday and Public Holidays: 08:30 AM – 12:00 PM</p>
              </div>

              <div>
                <h2 className="smallcaps text-ocean text-[0.78rem] tracking-[0.14em]">Head Office Location</h2>
                <p className="mt-3">
                  Waterfront Terraces, Tyger Waterfront, Bellville, Cape Town, South Africa
                </p>
              </div>

              <div>
                <h2 className="smallcaps text-ocean text-[0.78rem] tracking-[0.14em]">Connect with us</h2>
                <a
                  href="https://www.facebook.com/profile.php?id=61575300506735"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Facebook"
                  className="mt-4 inline-flex items-center justify-center w-11 h-11 border border-ink/30 text-ink hover:bg-ocean hover:text-cream hover:border-ocean transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
