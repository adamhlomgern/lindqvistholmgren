import type { Metadata } from "next";
import { Gauge, LayoutTemplate } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SiteAudit } from "@/components/tools/SiteAudit";
import { SiteBuilder } from "@/components/tools/SiteBuilder";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Gratis verktyg",
  description:
    "Hemsidekollen ger er sajt ett betyg på hastighet, mobil, Google och förtroende. Sajtbyggaren visar hur er nya hemsida kan se ut. Gratis och utan konto.",
  alternates: { canonical: "/verktyg" },
};

const jump = [
  { href: "#hemsidekollen", icon: Gauge, name: "Hemsidekollen", text: "Få ett betyg på er nuvarande sajt" },
  { href: "#sajtbyggaren", icon: LayoutTemplate, name: "Sajtbyggaren", text: "Se hur er nya sajt kan se ut" },
];

export default function ToolsPage() {
  return (
    <>
      <Section tone="pine" className="pb-16 pt-12 md:pb-20 md:pt-16">
        <Container>
          <Breadcrumbs items={[{ label: "Hem", href: "/" }, { label: "Verktyg" }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-medium text-fg-muted">Gratis verktyg</p>
              <h1 className="mt-3 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.035em] md:text-6xl">
                Testa själva, <span className="text-highlight">helt gratis.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
                Två verktyg vi byggt för att ni ska kunna se var ni står och vart ni kan komma. Inget konto,
                inga krav.
              </p>
            </div>
            <div className="grid gap-2">
              {jump.map((j) => (
                <a
                  key={j.href}
                  href={j.href}
                  className="group flex items-center gap-4 rounded-2xl bg-surface p-4 ring-1 ring-line transition-colors hover:bg-pine-700"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-fg/10 text-highlight">
                    <j.icon size={20} />
                  </span>
                  <span>
                    <span className="block font-medium">{j.name}</span>
                    <span className="block text-sm text-fg-muted">{j.text}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="light" id="hemsidekollen" className="scroll-mt-20">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-fg-muted">Hemsidekollen</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-fg md:text-5xl">
              Hur mår er hemsida?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-fg-muted">
              Ett 40-tal kontroller av hastighet, Google, mobil, säkerhet och förtroende, plus Googles egen mätning i
              mobilen. Ni får en åtgärdsplan med det som ger mest effekt först, anpassad efter plattformen ni kör på.
            </p>
          </div>
          <div className="mt-10">
            <SiteAudit />
          </div>
        </Container>
      </Section>

      <Section tone="subtle" id="sajtbyggaren" className="scroll-mt-20">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-fg-muted">Sajtbyggaren</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-fg md:text-5xl">
              Hur kan er nya sajt se ut?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-fg-muted">
              Välj bransch, namn, färg och stil. Skissen uppdateras medan ni klickar. Gillar ni den bygger vi den
              på riktigt, anpassad efter er.
            </p>
          </div>
          <div className="mt-10">
            <SiteBuilder />
          </div>
        </Container>
      </Section>
      <CtaBanner />
    </>
  );
}
