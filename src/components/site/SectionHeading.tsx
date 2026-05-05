export function SectionHeading({ kicker, heading, className = "" }: { kicker?: string; heading: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {kicker && <span className="smallcaps text-warmth">{kicker}</span>}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05]">{heading}</h2>
    </div>
  );
}
