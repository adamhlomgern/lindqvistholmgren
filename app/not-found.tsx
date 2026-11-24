import { ArrowLeft, Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section tone="light" className="py-28 md:py-40">
      <Container>
        <Eyebrow icon={Compass}>404</Eyebrow>
        <h1 className="mt-5 max-w-2xl font-display text-5xl font-semibold leading-[1.05] tracking-[-0.035em] text-fg md:text-6xl">
          Sidan finns inte. <span className="text-fg-subtle">Men vi gör det.</span>
        </h1>
        <p className="mt-6 max-w-md text-lg text-fg-muted">
          Länken kan vara gammal eller felstavad. Börja om från startsidan eller hör av er direkt.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/">
            <ArrowLeft size={16} strokeWidth={2.5} />
            Till startsidan
          </Button>
          <Button href="/kontakt" variant="secondary">
            Kontakta oss
          </Button>
        </div>
      </Container>
    </Section>
  );
}
