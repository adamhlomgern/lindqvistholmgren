import { HTMLAttributes, ReactNode } from "react";

type SectionTone = "forest" | "charcoal" | "olive";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  tone?: SectionTone;
};

const toneClasses: Record<SectionTone, string> = {
  forest: "bg-forest text-bone",
  charcoal: "bg-charcoal text-bone",
  olive: "bg-olive text-bone",
};

export function Section({ tone = "forest", className = "", children, ...props }: SectionProps) {
  return (
    <section className={`py-24 md:py-32 ${toneClasses[tone]} ${className}`} {...props}>
      {children}
    </section>
  );
}
