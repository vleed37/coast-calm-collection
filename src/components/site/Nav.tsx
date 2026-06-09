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
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 py-6 flex flex-col items-center gap-5">
        <Link to="/" className={`font-display text-2xl tracking-[0.3em] font-light ${textColor}`}>
          Lone Bull Rentals
        </Link>
        <nav className={`flex flex-wrap justify-center gap-x-8 gap-y-2 ${textColor}`}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="smallcaps link-underline"
              activeProps={{ className: "smallcaps link-underline text-warmth" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
