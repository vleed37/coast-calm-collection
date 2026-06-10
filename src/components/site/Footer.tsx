import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-mist py-24 text-center px-6">
      <div className="max-w-[1320px] mx-auto flex flex-col items-center gap-8">
        <div className="font-display text-4xl md:text-5xl tracking-[0.2em] font-light">Lone Bull Rentals</div>
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-ink">
          {["/", "/properties", "/guide", "/booking-policy", "/contact", "/enquire"].map((to, i) => (
            <Link key={to} to={to} className="smallcaps link-underline">
              {["Home", "Properties", "Local Guide", "Booking Policy", "Contact", "Enquire"][i]}
            </Link>
          ))}
        </nav>
        <p className="font-display italic text-xl text-ink/70">Made on the West Coast.</p>
        <p className="smallcaps text-ink/50">A division of Lone Bull Group</p>
        <p className="smallcaps text-ink/50">© {new Date().getFullYear()} Lone Bull Rentals. All rights reserved.</p>
      </div>
    </footer>
  );
}
