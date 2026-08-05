import { ChevronRight, Code2, Palette, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { StartProjectButton } from "@/components/contact/StartProjectButton";

const tags = [
  { icon: Code2, label: "Webb" },
  { icon: Palette, label: "Design" },
  { icon: TrendingUp, label: "Tillväxt" },
];

export function Hero() {
  return (
    <Section tone="forest" className="pt-20 md:pt-28">
      <Container>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.label}
              className="inline-flex items-center gap-1.5 rounded-full bg-bone/5 px-3 py-1.5 text-xs font-medium uppercase tracking-label text-stone"
            >
              <tag.icon className="text-emerald" size={14} strokeWidth={2.25} />
              {tag.label}
            </span>
          ))}
        </div>
        <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[0.92] tracking-[-0.04em] text-bone md:text-7xl">
          Två frilansare. <span className="text-emerald">Ett team.</span> Er digitala
          partner i Karlstad.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone">
          Vi är ett litet, familjärt team som hjälper lokala företag i Karlstad och
          Värmland med webb, design och digital marknadsföring — nära, personligt och
          pålitligt.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <StartProjectButton>
            Starta ett projekt
            <ChevronRight size={16} strokeWidth={2.5} />
          </StartProjectButton>
          <Button href="/projekt" variant="ghost">
            Se vårt arbete
          </Button>
        </div>
      </Container>
    </Section>
  );
}
