import { ChevronRight, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CtaReassurance } from "@/components/ui/CtaReassurance";
import { StartProjectButton } from "@/components/contact/StartProjectButton";

// Avslutande CTA på de flesta sidor. Två vägar: den guidade förfrågan (för den
// som vet ungefär vad hen vill ha) och ett vanligt mejl (för den som bara vill
// ställa en fråga först). Trygghetstexten tar bort den vanligaste tveksamheten.
export function CtaBanner() {
  return (
    <Section tone="light" className="py-16 md:py-20">
      <Container>
        <div className="tone-pine flex flex-col gap-10 rounded-3xl p-8 sm:p-12 md:flex-row md:items-end md:justify-between md:p-14">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] md:text-5xl">
              Har ni ett projekt på gång? <span className="text-highlight">Hör av er.</span>
            </h2>
            <p className="mt-4 text-lg text-fg-muted">
              Skriv några rader om vad ni behöver. Vi svarar inom ett dygn med frågor eller ett förslag.
            </p>
            <CtaReassurance className="mt-6" />
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
            <StartProjectButton trackingLocation="cta-banner">
              Få ett förslag
              <ChevronRight size={16} strokeWidth={2.5} />
            </StartProjectButton>
            <Button href="mailto:info@lindqvistholmgren.se" variant="ghost" className="ring-1 ring-inset ring-fg/25">
              <Mail size={16} strokeWidth={2.25} />
              Mejla oss
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
