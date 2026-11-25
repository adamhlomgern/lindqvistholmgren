import { CalendarClock, CreditCard } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { paymentModels } from "@/lib/data/service-plans";

const icons = { engang: CreditCard, manad: CalendarClock };

// De två sätten att betala, sida vid sida. Visas på tjänster och undersidor
// som inte har den interaktiva upplägg-planeraren.
export function EngagementModels({ tone = "light" }: { tone?: "light" | "subtle" }) {
  return (
    <Section tone={tone}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-sm font-medium text-fg-muted">Två sätt att betala</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-fg md:text-[2.5rem]">
              Allt på en gång, eller per månad.
            </h2>
            <p className="mt-5 max-w-md text-fg-muted">
              Vi har ingen prislista, eftersom inga projekt är lika. Ni får alltid en offert innan något
              börjar, och vi hjälper er välja det som passar.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {paymentModels.map((model, index) => {
              const Icon = icons[model.key];
              return (
                <Reveal key={model.key} delay={index * 0.08}>
                  <div className={`flex h-full flex-col rounded-3xl p-7 ${index === 0 ? "bg-surface shadow-card ring-1 ring-line" : "tone-lilac"}`}>
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fg/[0.06] text-fg">
                      <Icon size={20} />
                    </span>
                    <p className="mt-6 font-display text-2xl font-semibold tracking-[-0.02em] text-fg">{model.title}</p>
                    <p className="mt-1 text-sm font-medium text-fg-muted">{model.short}</p>
                    <p className="mt-4 leading-relaxed text-fg-muted">{model.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
