import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/guide", label: "Local Guide" },
  { to: "/booking-policy", label: "Booking Policy" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav({ transparentOverHero = false }: { transparentOverHero?: boolean }) {
  const [solid, setSolid] = useState(!transparentOverHero);
  useEffect(() => {
    if (!transparentOverHero) return;
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOverHero]);

  const textColor = solid ? "text-ink" : "text-cream";
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        solid ? "bg-cream border-b border-mist" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-6 md:px-8 lg:px-10 py-5 md:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 lg:gap-8">
        <Link
          to="/"
          className={`font-display text-2xl md:text-3xl lg:text-4xl tracking-[0.18em] font-light text-center md:text-left whitespace-nowrap ${textColor}`}
        >
          Lone Bull Rentals
        </Link>
        <nav className={`flex flex-wrap md:flex-nowrap md:whitespace-nowrap justify-center gap-x-5 lg:gap-x-6 gap-y-2 md:justify-center ${textColor}`}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="smallcaps link-underline text-[0.78rem] md:text-[0.8rem] tracking-[0.14em]"
              activeProps={{ className: "smallcaps link-underline text-warmth text-[0.78rem] md:text-[0.8rem] tracking-[0.14em]" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/enquire"
          className={`smallcaps px-6 py-2.5 border transition-colors duration-300 text-[0.75rem] whitespace-nowrap self-center md:self-auto ${
            solid
              ? "bg-ocean text-cream border-ocean hover:bg-ink hover:border-ink"
              : "border-cream/70 text-cream hover:bg-cream hover:text-ocean"
          }`}
        >
          Enquire Now
        </Link>
      </div>
    </header>
  );
}
