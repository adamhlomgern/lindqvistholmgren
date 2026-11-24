import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarCheck,
  ChevronRight,
  FileSpreadsheet,
  LayoutDashboard,
  Plug,
  ShoppingBag,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { demos } from "@/lib/data/demos";

// Sajten handlade nästan bara om webb och design. Den här sektionen visar att
// vi också bygger affärssystem — och bevisar det med demos man kan klicka i
// själv, plus det system vi själva driver företaget i (admin + kundportal).
const systemTypes = [
  { icon: CalendarCheck, label: "Bokningssystem" },
  { icon: ShoppingBag, label: "Beställning & order" },
  { icon: Users, label: "Kundportaler" },
  { icon: LayoutDashboard, label: "Interna verktyg & dashboards" },
  { icon: FileSpreadsheet, label: "Offert & fakturering" },
  { icon: Plug, label: "Integrationer" },
];

export function SystemsShowcase() {
  const liveDemos = demos.filter((demo) => demo.status === "live");

  return (
    <Section tone="pine">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-medium text-fg-muted">Affärssystem</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-5xl">
              Mer än hemsidor. <span className="text-highlight">Vi bygger systemen</span> ni driver företaget i.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-fg-muted">
              Bokning, beställningar, kundportaler eller ett internt verktyg som ersätter Excel och
              mejltrådar — byggt för hur just ni jobbar, inte en färdig mall ni får anpassa er efter.
            </p>
          </div>
        </div>

        <ul className="mt-10 flex flex-wrap gap-2">
          {systemTypes.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 rounded-full bg-fg/[0.08] py-1.5 pl-2.5 pr-3.5 text-sm font-medium text-fg"
            >
              <Icon size={15} strokeWidth={2.25} className="text-highlight" />
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {liveDemos.map((demo) => (
            <Link
              key={demo.slug}
              href={`/demos/${demo.slug}`}
              className="group flex flex-col justify-between rounded-2xl bg-surface p-6 ring-1 ring-line transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-pine-700"
            >
              <div>
                {demo.logo ? (
                  <Image src={demo.logo} alt="" width={40} height={40} className="h-10 w-10" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fg/10 text-fg">
                    <demo.icon size={20} strokeWidth={2} />
                  </span>
                )}
                <p className="mt-4 font-display text-lg font-semibold tracking-[-0.01em] text-fg">{demo.title}</p>
                <p className="mt-1 text-sm text-fg-muted">{demo.tagline}</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-fg transition-[gap] duration-200 group-hover:gap-2.5">
                Testa demon
                <ArrowUpRight size={16} strokeWidth={2.25} />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-6 rounded-2xl bg-pine-950/60 p-6 ring-1 ring-line sm:p-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="font-display text-xl font-semibold tracking-[-0.01em] text-fg">
              Vi kör vårt eget företag i ett system vi byggt själva.
            </p>
            <p className="mt-2 text-fg-muted">
              Kunder, projekt, fakturor, inkorg och en kundportal där våra kunder godkänner leveranser —
              samma sorts lösning kan vi bygga åt er.
            </p>
          </div>
          <StartProjectButton trackingLocation="system-sektion" className="shrink-0">
            Berätta om ert behov
            <ChevronRight size={16} strokeWidth={2.5} />
          </StartProjectButton>
        </div>
      </Container>
    </Section>
  );
}
