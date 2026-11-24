import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export function CtaBanner() {
  return (
    <Section tone="light" className="py-16 md:py-20">
      <Container>
        <div className="tone-pine flex flex-col items-start gap-8 rounded-3xl p-8 sm:p-12 md:flex-row md:items-end md:justify-between md:p-14">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] md:text-5xl">
              Har ni ett projekt på gång? <span className="text-highlight">Hör av er.</span>
            </h2>
            <p className="mt-4 text-lg text-fg-muted">
              Vi hjälper er från idé till färdig lösning — snabbt, personligt och utan krångel.
            </p>
          </div>
          <Button href="/kontakt" className="shrink-0">
            Kontakta oss
            <ChevronRight size={16} strokeWidth={2.5} />
          </Button>
        </div>
      </Container>
    </Section>
  );
}
