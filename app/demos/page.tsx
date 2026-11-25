import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { demos } from "@/lib/data/demos";

export const metadata: Metadata = {
  title: "Demos",
  description:
    "Klicka runt i fungerande system byggda av Lindqvist / Holmgren: bokning, beställningar, service, produktkonfigurator och kundportal. Sedan bygger vi en version för er.",
};

// Vad varje demo visar och vem den är till för. Själva demona ligger under
// /demo/* och kör med påhittad data i webbläsaren.
const details: Record<string, { openHref: string; image: string; fits: string; tryThis: string[] }> = {
  servicekoll: {
    openHref: "/demo/servicekoll",
    image: "/images/demos/screens/servicekoll.webp",
    fits: "Verkstäder, VVS-firmor och alla som servar kunders bilar, maskiner eller anläggningar.",
    tryThis: ["Ring, sms:a eller mejla en kund direkt från ett objekt", "Boka en servicetid och se den under Bokningar", "Påminn alla kunder med försenad service med ett klick"],
  },
  mumsa: {
    openHref: "/demo/mumsa",
    image: "/images/demos/screens/mumsa.webp",
    fits: "Restauranger och caféer som vill ta emot beställningar på sin egen sajt.",
    tryThis: ["Beställ en pizza som kund", "Byt till restaurangvyn och se ordern landa i köket", "Se dagens försäljning som ägare"],
  },
  bokad: {
    openHref: "/demo/bokad",
    image: "/images/demos/screens/bokad.webp",
    fits: "Salonger, kliniker, PT och andra som tar emot bokningar.",
    tryThis: ["Sök och jämför salonger i Värmland", "Boka en tid i några få steg", "Byt till salongens och ägarens vy"],
  },
  forma: {
    openHref: "/demo/forma",
    image: "/images/demos/screens/forma.webp",
    fits: "Företag som säljer produkter med många val, till exempel hus, kök eller maskiner.",
    tryThis: ["Bygg ett attefallshus steg för steg", "Se priset ändras medan du väljer", "Skicka en färdig offertförfrågan"],
  },
  kundportal: {
    openHref: "/demo/kundportal",
    image: "/images/demos/kundportal/overview.webp",
    fits: "Byråer, konsulter och alla som levererar till kunder i flera steg.",
    tryThis: ["Granska och godkänn en leverans", "Hitta rätt fil i materialbiblioteket", "Läs och svara på meddelanden"],
  },
};

const steps = [
  { title: "Testa en demo", text: "Klicka runt som kund, personal eller ägare. Inget sparas." },
  { title: "Berätta vad som ska vara annorlunda", text: "Ert namn, era tjänster, era rutiner. Eller något helt eget." },
  { title: "Vi bygger er version", text: "Anpassad efter hur ni jobbar, med er logga och era färger." },
];

function BrowserFrame({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-pop ring-1 ring-line">
      <div className="flex items-center gap-1.5 border-b border-line bg-surface-sunken px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
      </div>
      <Image src={src} alt={alt} width={2560} height={1600} sizes="(min-width: 1024px) 600px, 100vw" className="h-auto w-full" priority={priority} />
    </div>
  );
}

export default function DemosPage() {
  const live = demos.filter((demo) => demo.status === "live" && details[demo.slug]);

  return (
    <>
      <Section tone="light" className="pb-16 pt-12 md:pb-24 md:pt-16">
        <Container>
          <Breadcrumbs items={[{ label: "Hem", href: "/" }, { label: "Demos" }]} />
          <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <p className="text-sm font-medium text-fg-muted">Demos</p>
              <h1 className="mt-3 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.035em] text-fg sm:text-[3.25rem]">
                Klicka runt i system vi redan byggt.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
                Allt här är riktiga, fungerande system med påhittad data. Hittar ni något som liknar det ni
                behöver, bygger vi en version för ert företag.
              </p>
              <ol className="mt-10 grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-3 xl:flex-col">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fg font-display text-sm font-semibold text-canvas">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-fg">{step.title}</p>
                      <p className="mt-1 text-sm text-fg-muted">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <Reveal delay={0.15} className="relative hidden pb-16 sm:block lg:pb-20">
              <div className="w-[82%]">
                <BrowserFrame src={details.servicekoll.image} alt="Servicekoll" priority />
              </div>
              <div className="absolute bottom-0 right-0 w-[62%] rotate-[1.5deg]">
                <BrowserFrame src={details.bokad.image} alt="Bokad" />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container className="space-y-20 md:space-y-28">
          {live.map((demo, index) => {
            const d = details[demo.slug];
            const flip = index % 2 === 1;
            return (
              <Reveal key={demo.slug}>
                <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <Link href={d.openHref} className={`group block ${flip ? "lg:order-2" : ""}`} aria-label={`Öppna ${demo.title}`}>
                    <div className="transition-transform duration-500 ease-out group-hover:-translate-y-1">
                      <BrowserFrame src={d.image} alt={`${demo.title}: ${demo.tagline}`} />
                    </div>
                  </Link>
                  <div>
                    <div className="flex items-center gap-3">
                      {demo.logo ? (
                        <Image src={demo.logo} alt="" width={40} height={40} className="h-10 w-10" />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fg text-canvas">
                          <demo.icon size={20} />
                        </span>
                      )}
                      <span className="text-sm font-medium text-fg-muted">{demo.tagline}</span>
                    </div>
                    <h2 className="mt-5 font-display text-4xl font-semibold tracking-[-0.03em] text-fg">{demo.title}</h2>
                    <p className="mt-3 text-lg leading-relaxed text-fg-muted">{demo.description}</p>
                    <p className="mt-6 text-sm">
                      <span className="font-semibold text-fg">Passar för: </span>
                      <span className="text-fg-muted">{d.fits}</span>
                    </p>
                    <div className="mt-6 rounded-2xl bg-surface p-5 ring-1 ring-line">
                      <p className="text-sm font-semibold text-fg">Testa det här</p>
                      <ol className="mt-3 space-y-2">
                        {d.tryThis.map((item, n) => (
                          <li key={item} className="flex gap-3 text-[15px] text-fg">
                            <span className="w-4 shrink-0 font-display text-sm font-semibold text-fg-subtle">{n + 1}</span>
                            {item}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button href={d.openHref}>
                        Öppna demon
                        <ArrowUpRight size={16} strokeWidth={2.25} />
                      </Button>
                      <Button href={`/demos/${demo.slug}`} variant="secondary">
                        Läs mer
                        <ChevronRight size={16} strokeWidth={2.25} />
                      </Button>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </Container>
      </Section>
      <CtaBanner />
    </>
  );
}
