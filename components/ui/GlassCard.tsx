import { ReactNode } from "react";
import { blobClasses, type Accent } from "@/lib/design/accents";

type GlassCardProps = {
  accent?: Accent;
  className?: string;
  children: ReactNode;
};

// className is applied to the inner flex container (content layout: gap,
// justify-content, align-items, text-align — anything that isn't `flex`
// itself, since flipping direction here would race Tailwind's generated
// utility order against the hardcoded flex-col default). The outer div's
// chrome (border, background, blobs, hover state) is fixed on purpose so
// every glass card in the site shares the exact same shell.
export function GlassCard({ accent = "emerald", className = "", children }: GlassCardProps) {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-bone/10 bg-charcoal/60 p-6 transition-colors group-hover:border-bone/20 group-hover:bg-charcoal/80">
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-[110px] ${blobClasses[accent].big}`}
      />
      <div
        className={`pointer-events-none absolute -bottom-16 -left-12 h-32 w-32 rounded-full blur-[100px] ${blobClasses[accent].small}`}
      />
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" />
      <div className={`relative z-10 flex h-full flex-col ${className}`}>{children}</div>
    </div>
  );
}
