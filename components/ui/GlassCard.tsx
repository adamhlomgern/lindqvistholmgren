import { ReactNode } from "react";
import type { Accent } from "@/lib/design/accents";

type GlassCardProps = {
  // Behålls för bakåtkompatibilitet: kortet var tidigare tonat med en glöd i
  // accentfärgen. I det ljusa systemet bär ikonen/badgen färgen i stället.
  accent?: Accent;
  className?: string;
  padding?: "default" | "compact";
  children: ReactNode;
};

const paddingClasses = {
  default: "p-6",
  compact: "p-4 sm:p-6",
};

// className is applied to the inner flex container (content layout: gap,
// justify-content, align-items, text-align — anything that isn't `flex`
// itself). The outer div's chrome is fixed on purpose so every card in the
// site shares the exact same shell: vit yta, tunn kant, lätt skugga som växer
// och lyfter kortet när föräldern (group) hovras.
export function GlassCard({ className = "", padding = "default", children }: GlassCardProps) {
  return (
    <div
      className={`relative h-full overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line transition-[box-shadow,transform] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:shadow-raised group-hover:ring-line-strong ${paddingClasses[padding]}`}
    >
      <div className={`relative z-10 flex h-full flex-col ${className}`}>{children}</div>
    </div>
  );
}
