import { Link } from "@tanstack/react-router";
import type { Property } from "@/lib/queries/properties";

export function PropertyCard({ property, offset = false }: { property: Property; offset?: boolean }) {
  if (property.comingSoon) {
    return (
      <article className={`group ${offset ? "md:translate-y-20 lg:translate-y-32" : ""}`}>
        <div className="block">
          <div className="relative overflow-hidden bg-mist aspect-[3/4]">
            <img
              src={property.heroImage}
              alt={`${property.name} — luxury villa on South Africa's West Coast`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
            <span className="absolute top-4 left-4 bg-cream/95 text-ink smallcaps px-3 py-2">
              Coming Soon
            </span>
          </div>
          <div className="pt-6 flex flex-col gap-3">
            <span className="smallcaps text-ink/60">{property.location}</span>
            <h3 className="font-display text-2xl md:text-3xl">{property.name}</h3>
            <div className="pt-3 border-t border-mist mt-2">
              <span className="smallcaps text-ink/60">New to the collection — details to follow.</span>
            </div>
          </div>
        </div>
      </article>
    );
  }
  return (
    <article className={`group ${offset ? "md:translate-y-20 lg:translate-y-32" : ""}`}>
      <Link to="/properties/$slug" params={{ slug: property.id }} className="block">
        <div className="relative overflow-hidden bg-mist aspect-[3/4]">
          <img
            src={property.heroImage}
            alt={`${property.name} — luxury villa on South Africa's West Coast`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="pt-6 flex flex-col gap-3">
          <span className="smallcaps text-ink/60">{property.location}</span>
          <h3 className="font-display text-2xl md:text-3xl">{property.name}</h3>
          <div className="flex items-center gap-5 text-sm text-ink/70">
            <Stat label={`${property.beds} beds`} />
            <Stat label={`${property.baths} baths`} />
            <Stat label={`${property.guests} guests`} />
          </div>
          <div className="flex items-end justify-between pt-3 border-t border-mist mt-2">
            <span className="text-sm text-ink/70">From <span className="text-ink">{property.fromPrice}</span></span>
            <span className="smallcaps text-ocean link-underline">View Property →</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function Stat({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="inline-block w-1 h-1 rounded-full bg-warmth" />
      {label}
    </span>
  );
}
