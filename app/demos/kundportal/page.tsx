import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  FolderOpen,
  LayoutDashboard,
  MessagesSquare,
  Route,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { CtaReassurance } from "@/components/ui/CtaReassurance";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { accents } from "@/lib/design/accents";

export const metadata: Metadata = {
  title: "Kundportal — demo",
  description:
    "En egen kundportal där kunden följer projektet, godkänner leveranser och hittar alla filer på ett ställe. Klicka runt i en interaktiv demo.",
};

const DEMO = "/demo/kundportal";
const DEMO_APPROVAL = "/demo/kundportal/godkannande/demo-approval-slutlig";

const features = [
  {
    icon: Route,
    title: "Projektstatus i realtid",
    description: "Kunden ser vilken fas projektet är i, vad som händer nu och när nästa leverans kommer.",
  },
  {
    icon: CheckCircle2,
    title: "Godkännanden med ett klick",
    description: "Förslag skickas för granskning, kunden godkänner eller ber om ändringar — allt sparas.",
  },
  {
    icon: FolderOpen,
    title: "Ett ordnat materialbibliotek",
    description: "Skisser, slutfiler och riktlinjer i tydliga mappar, med förhandsvisning och nedladdning.",
  },
  {
    icon: MessagesSquare,
    title: "Meddelanden på ett ställe",
    description: "Frågor och svar kopplade till projektet, i stället för utspridda i mejltrådar.",
  },
];

const views = [
  {
    icon: Users,
    title: "Kunden",
    description:
      "Loggar in och ser direkt vad som väntar på dem. Granskar förslag, godkänner, laddar ner filer och skickar frågor.",
  },
  {
    icon: LayoutDashboard,
    title: "Ni",
    description:
      "Skapar projekt och faser, laddar upp material, begär godkännanden och ser vad kunden har gjort — i er egen admin.",
  },
  {
    icon: Upload,
    title: "Leveransen",
    description:
      "När allt är godkänt låses slutfilerna upp för kunden. Inga mejlade bilagor, inga frågor om vilken version som gäller.",
  },
];

const fits = [
  "Byråer och frilansare",
  "Konsulter",
  "Arkitekter och byggföretag",
  "Hantverkare med större uppdrag",
  "Fotografer och filmare",
  "Redovisning och juridik",
];

// Presentationssida för kundportal-demot (app/demo/kundportal). Portalen är
// samma som våra egna kunder använder — demot kör den med påhittad data
// (Glänta Trädgård) i minnet i webbläsaren, så inget sparas.
export default function KundportalMarketingPage() {
  return (
    <>
      <PageHero
        icon={Sparkles}
        eyebrow="Produktdemo"
        title="Kunden vet alltid var projektet står"
        description="Ge era kunder en egen inloggning för status, godkännanden, filer och meddelanden. Färre mejl, snabbare beslut och en leverans som känns proffsig hela vägen."
        breadcrumbs={[{ label: "Demos", href: "/demos" }, { label: "Kundportal" }]}
        visual={
          <div className="relative mx-auto w-full max-w-[540px] lg:mx-0 lg:w-[520px]">
            <div className="overflow-hidden rounded-2xl bg-surface shadow-pop ring-1 ring-line">
              <div className="flex items-center gap-1.5 border-b border-line bg-surface-sunken px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
              </div>
              <Image
                src="/images/demos/kundportal/overview.webp"
                alt="Översikten i kundportalen: ett godkännande väntar och projektets faser"
                width={2560}
                height={1560}
                sizes="(min-width: 1024px) 520px, 100vw"
                className="h-auto w-full"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden w-56 overflow-hidden rounded-xl bg-surface shadow-pop ring-1 ring-line sm:block lg:-left-10">
              <Image
                src="/images/demos/kundportal/approval.webp"
                alt="Ett godkännande i kundportalen"
                width={2560}
                height={1560}
                sizes="224px"
                className="h-auto w-full"
              />
            </div>
          </div>
        }
      >
        <Button href={DEMO}>
          Testa demon
          <ChevronRight size={16} strokeWidth={2.5} />
        </Button>
        <Button href={DEMO_APPROVAL} variant="secondary">
          Se ett godkännande
        </Button>
      </PageHero>

      <Section tone="subtle">
        <Container>
          <Eyebrow icon={Sparkles}>Vad kunden får</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-[1.05] tracking-[-0.025em] text-fg md:text-4xl">
            Allt om projektet, på ett ställe
          </h2>
          <p className="mt-4 max-w-xl text-fg-muted">
            I stället för mejltrådar, WeTransfer-länkar och &rdquo;vilken version var det nu?&rdquo;.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const accent = accents[index % accents.length];
              return (
                <GlassCard key={feature.title} accent={accent}>
                  <AccentBadge icon={feature.icon} accent={accent} />
                  <h3 className="mt-5 font-display text-lg font-semibold text-fg">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{feature.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="light">
        <Container>
          <Eyebrow icon={LayoutDashboard}>Ett system, två sidor</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-[1.05] tracking-[-0.025em] text-fg md:text-4xl">
            Kunden ser portalen. Ni styr allt från admin.
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {views.map((view, index) => {
              const accent = accents[(index + 2) % accents.length];
              return (
                <GlassCard key={view.title} accent={accent}>
                  <AccentBadge icon={view.icon} accent={accent} />
                  <h3 className="mt-5 font-display text-lg font-semibold text-fg">{view.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{view.description}</p>
                </GlassCard>
              );
            })}
          </div>
          <div className="mt-12 rounded-2xl bg-surface-sunken p-6 ring-1 ring-line sm:p-8">
            <p className="font-display text-lg font-semibold tracking-[-0.01em] text-fg">Passar alla som levererar i etapper</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {fits.map((fit) => (
                <li
                  key={fit}
                  className="rounded-full bg-surface px-3 py-1.5 text-sm font-medium text-fg-muted ring-1 ring-inset ring-line"
                >
                  {fit}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-fg-muted">
              Vi använder själva samma portal med våra egna kunder. Er version byggs efter era faser,
              ert varumärke och de filer ni levererar.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="light" className="pt-0 md:pt-0">
        <Container>
          <div className="tone-pine flex flex-col gap-8 rounded-3xl p-8 sm:p-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] md:text-4xl">
                Klicka runt som kund. <span className="text-highlight">Inget sparas.</span>
              </h2>
              <p className="mt-3 text-fg-muted">
                Godkänn en leverans, öppna materialbiblioteket och läs meddelandena — med &rdquo;Återställ
                demo&rdquo; börjar du om när du vill.
              </p>
              <CtaReassurance className="mt-6" />
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
              <Button href={DEMO}>
                Öppna kundportalen
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </Button>
              <StartProjectButton trackingLocation="demo-kundportal" variant="ghost" className="ring-1 ring-inset ring-fg/25">
                Vill ni ha en egen?
              </StartProjectButton>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
