import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ServiceExplorer } from "@/components/sections/ServiceExplorer";

export function Services() {
  return (
    <Section tone="subtle">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-fg-muted">Våra tjänster</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-[1.06] tracking-[-0.03em] text-fg md:text-[2.75rem]">
              Allt ni behöver för att synas, sälja och{" "}
              <span className="text-fg-subtle">driva företaget digitalt.</span>
            </h2>
          </div>
          <Button href="/tjanster" variant="secondary" className="shrink-0">
            Alla tjänster
            <ChevronRight size={16} strokeWidth={2.5} />
          </Button>
        </div>
        <div className="mt-12">
          <ServiceExplorer />
        </div>
      </Container>
    </Section>
  );
}
