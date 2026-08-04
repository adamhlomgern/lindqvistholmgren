import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function CtaBanner() {
  return (
    <Section tone="forest">
      <Container>
        <Card className="flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-bone md:text-3xl">
              Har du ett projekt på gång?
            </h2>
            <p className="mt-2 text-stone">
              Vi hjälper er komma från idé till en färdig lösning — snabbt, personligt
              och utan krångel.
            </p>
          </div>
          <Button href="/kontakt" className="shrink-0">
            Kontakta oss
            <ChevronRight size={16} strokeWidth={2.5} />
          </Button>
        </Card>
      </Container>
    </Section>
  );
}
