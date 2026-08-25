import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  ChevronRight,
  Gauge,
  Layers,
  Rocket,
  Scissors,
  Search,
  Store,
  UserCog,
  Users,
  Zap,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { accents } from "@/lib/design/accents";
import { bokadRoutes } from "@/features/booking-platform/config/product";

export const metadata: Metadata = {
  title: "Bokad — vår egen bokningsplattform",
  description:
    "Bokad är Lindqvist / Holmgrens egen bokningsmarknadsplats för salonger och kliniker — byggd och driven av oss, inte ett kundcase. Se en interaktiv demo.",
};

const differentiators = [
  {
    icon: Zap,
    title: "Snabbt bokningsflöde",
    description: "Från sök till bekräftad tid på under en minut — inget konto krävs för att boka.",
  },
  {
    icon: Search,
    title: "En riktig katalog",
    description: "Kunder söker, filtrerar på kategori och jämför salonger — inte bara en enda salongs egen sida.",
  },
  {
    icon: CalendarClock,
    title: "Tillgänglighet i realtid",
    description: "Lediga tider räknas fram live utifrån öppettider, personal och befintliga bokningar — inga krockar.",
  },
  {
    icon: Gauge,
    title: "Lika snabbt för salongen",
    description: "Bokningskö och beläggning utan krångel — salongen ser sin dag på en gång, inte i ett separat system.",
  },
];

const views = [
  { icon: Users, title: "Kund", description: "Söker, jämför och bokar tid hos valfri salong i katalogen — utan konto." },
  { icon: Scissors, title: "Salong", description: "Ser dagens och veckans bokningar, klarmarkerar eller markerar uteblivna." },
  { icon: Store, title: "Ägare", description: "Beläggning, intäkter och no-show-andel per vecka, plus tjänster och priser att redigera." },
];

export default function BokadMarketingPage() {
  return (
    <>
      <PageHero
        icon={Rocket}
        eyebrow="Vår egen produkt"
        title="Bokadirekt har dåliga betyg. Så vi byggde något bättre."
        description="Bokad är inte ett kundcase — det är en bokningsmarknadsplats för frisörer, skönhet, massage, PT, naglar och tandvård som vi själva bygger och driver. Ett bevis på att vi inte bara levererar åt andra, utan också äger egna produkter."
        breadcrumbs={[{ label: "Demos", href: "/demos" }, { label: "Bokad" }]}
      >
        <Button href={bokadRoutes.directory()}>
          Testa demon
          <ChevronRight size={16} strokeWidth={2.5} />
        </Button>
        <Button href={bokadRoutes.contactCta()} variant="secondary">
          Vill ni synas i Bokad?
        </Button>
      </PageHero>

      <Section tone="olive">
        <Container>
          <Eyebrow icon={Layers}>Egen produkt, inte kundleverans</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[0.95] tracking-tight text-bone md:text-4xl">
            Vi bygger byråarbete varje dag. Bokad äger vi själva.
          </h2>
          <p className="mt-4 max-w-xl text-stone">
            De flesta av våra demos visar hur vi kan bygga en lösning åt ert företag. Bokad är annorlunda — det är en
            plattform vi utvecklar, driver och på sikt kan skala som en riktig utmanare till Bokadirekt. Samma
            bokningsmotor som driver varje salong i katalogen nedan är den vi själva sitter och bygger vidare på.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((item, index) => {
              const accent = accents[index % accents.length];
              return (
                <GlassCard key={item.title} accent={accent}>
                  <AccentBadge icon={item.icon} accent={accent} />
                  <h3 className="mt-5 font-display text-lg font-bold text-bone">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">{item.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="forest">
        <Container>
          <Eyebrow icon={UserCog}>Tre vyer, en bokningsmotor</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[0.95] tracking-tight text-bone md:text-4xl">
            Kund, salong och ägare ser samma bokning
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {views.map((view, index) => {
              const accent = accents[index % accents.length];
              return (
                <GlassCard key={view.title} accent={accent}>
                  <AccentBadge icon={view.icon} accent={accent} />
                  <h3 className="mt-5 font-display text-lg font-bold text-bone">{view.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">{view.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="forest">
        <Container>
          <GlassCard accent="sky" className="-m-6 items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-bone md:text-3xl">
                Vill ni ha en yta i Bokad — eller bygga en egen plattform?
              </h2>
              <p className="mt-2 text-stone">
                Som salong kan ni höra av er om en plats i katalogen längre fram. Driver ni en annan typ av
                marknadsplats eller bokningstjänst? Vi bygger gärna er egen version av samma idé.
              </p>
            </div>
            <Link
              href={bokadRoutes.contactCta()}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-sky px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone"
            >
              Prata med oss
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
          </GlassCard>
        </Container>
      </Section>

      <Section tone="forest">
        <Container>
          <GlassCard accent="emerald" className="-m-6 items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-bone md:text-3xl">
                Klicka runt i en färdig demo
              </h2>
              <p className="mt-2 text-stone">
                Ingen inloggning behövs — sök bland åtta seedade salonger i Karlstad och Värmland, boka en tid som
                kund och se den dyka upp i salongens kö direkt.
              </p>
            </div>
            <Link
              href={bokadRoutes.directory()}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone"
            >
              Öppna Bokad
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
          </GlassCard>
        </Container>
      </Section>
    </>
  );
}
