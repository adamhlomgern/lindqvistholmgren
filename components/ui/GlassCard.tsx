import { ReactNode } from "react";
import { accentHex, type Accent } from "@/lib/design/accents";

type GlassCardProps = {
  accent?: Accent;
  className?: string;
  children: ReactNode;
};

// className is applied to the inner flex container (content layout: gap,
// justify-content, align-items, text-align — anything that isn't `flex`
// itself, since flipping direction here would race Tailwind's generated
// utility order against the hardcoded flex-col default). The outer div's
// chrome (border, background, glow, hover state) is fixed on purpose so
// every glass card in the site shares the exact same shell.
//
// The glow used to be two small divs blurred with `blur-[110px]`. That's a
// full-page-cost filter repeated on every card (dozens per page), and was
// the main cause of the janky/disappearing-content scrolling on mobile.
// A radial-gradient reads the same but is essentially free to paint.
export function GlassCard({ accent = "emerald", className = "", children }: GlassCardProps) {
  const glow = accentHex[accent];
  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-bone/10 bg-charcoal/60 p-6 transition-colors group-hover:border-bone/20 group-hover:bg-charcoal/80">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(220px 220px at 88% -10%, ${glow}14, transparent 70%), radial-gradient(180px 180px at -5% 110%, ${glow}0c, transparent 70%)`,
        }}
      />
      <div className={`relative z-10 flex h-full flex-col ${className}`}>{children}</div>
    </div>
  );
}
