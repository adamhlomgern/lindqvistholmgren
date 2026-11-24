import { HTMLAttributes, ReactNode } from "react";

// light = vit (standard), subtle = ljusgrå för att skilja sektioner åt,
// pine = mörkgrönt block, lilac = mjukt lila block. Varje tone skriver om de
// semantiska färgerna (fg, primary, line …) för allt innehåll i sektionen.
// forest/charcoal/olive är de gamla namnen och pekar på light/subtle.
type SectionTone = "light" | "subtle" | "pine" | "lilac" | "forest" | "charcoal" | "olive";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  tone?: SectionTone;
};

const toneClasses: Record<SectionTone, string> = {
  light: "tone-light",
  subtle: "tone-subtle",
  pine: "tone-pine",
  lilac: "tone-lilac",
  forest: "tone-light",
  charcoal: "tone-subtle",
  olive: "tone-subtle",
};

export function Section({ tone = "light", className = "", children, ...props }: SectionProps) {
  return (
    <section className={`py-20 md:py-28 ${toneClasses[tone]} ${className}`} {...props}>
      {children}
    </section>
  );
}
