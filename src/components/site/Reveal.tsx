import { useInView } from "@/hooks/use-in-view";
import { ReactNode } from "react";

export function Reveal({ children, className = "", as: As = "div" as any, delay = 0 }: { children: ReactNode; className?: string; as?: any; delay?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  return (
    <As
      ref={ref as any}
      style={{ animationDelay: `${delay}ms` }}
      className={`reveal ${inView ? "in-view" : ""} ${className}`}
    >
      {children}
    </As>
  );
}
