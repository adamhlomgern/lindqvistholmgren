import type { Metadata } from "next";
import { ScrollText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Allmänna villkor",
  description:
    "Villkoren som gäller när Lindqvist / Holmgren tar sig an ett kunduppdrag — offert, betalning, leverans, rättigheter och ansvar.",
  alternates: {
    canonical: "/allmanna-villkor",
  },
};

type TermsSection = {
  title: string;
  body: string[];
};

const sections: TermsSection[] = [
  {
    title: "Vem villkoren gäller för",
    body: [
      "Dessa villkor gäller mellan Lindqvist / Holmgren, Karlstad, och den kund (företag eller organisation) som anlitar oss för ett uppdrag inom webb, design, marknadsföring eller närliggande tjänster.",
      "Villkoren blir en del av avtalet så snart en offert eller projektbeskrivning godkänns, muntligt eller skriftligt.",
    ],
  },
  {
    title: "Offert och uppdrag",
    body: [
      "Varje uppdrag inleds med en offert eller projektbeskrivning där omfattning, pris och tidsram framgår. Offerten är giltig i 30 dagar om inget annat anges.",
      "Uppdraget anses bekräftat när kunden godkänner offerten skriftligt (t.ex. via e-post) eller genom att betala en eventuell startfaktura.",
    ],
  },
  {
    title: "Priser och betalning",
    body: [
      "Priser anges exklusive moms om inget annat framgår. Beroende på uppdragets storlek fakturerar vi antingen ett fast pris i en eller flera delbetalningar, eller löpande på timmar enligt offerten.",
      "Betalningsvillkor är 30 dagar netto om inget annat avtalats. Vid försenad betalning debiteras dröjsmålsränta enligt räntelagen samt eventuell påminnelseavgift.",
      "Vid större projekt förbehåller vi oss rätten att fakturera en delbetalning innan arbetet påbörjas.",
    ],
  },
  {
    title: "Ändringar och tilläggsarbete",
    body: [
      "Arbete som ligger utanför den ursprungliga offerten — nya funktioner, ändrad omfattning, extra revideringsrundor — offereras separat och påverkar leveranstid.",
      "Vi kontaktar alltid kunden och stämmer av innan tilläggsarbete påbörjas och faktureras.",
    ],
  },
  {
    title: "Kundens medverkan",
    body: [
      "För att kunna hålla en satt tidsplan behöver vi rätt underlag i tid — text, bilder, inloggningsuppgifter, godkännanden och liknande. Uteblir underlag eller svar under en längre period kan tidsplanen förskjutas utan att det räknas som en försening från vår sida.",
    ],
  },
  {
    title: "Immateriella rättigheter",
    body: [
      "När uppdraget är slutbetalt övergår rättigheterna till det som tagits fram specifikt för kunden — design, texter och kod som skrivits för projektet — till kunden, om inget annat avtalats.",
      "Vi behåller rätten att använda generella komponenter, interna verktyg och tekniska lösningar som återanvänds mellan projekt, samt att visa upp arbetet i vårt portfolio om inget annat avtalats.",
    ],
  },
  {
    title: "Tredjepartslicenser",
    body: [
      "Vissa delar av en leverans kan bygga på tredjepartsprodukter — typsnitt, bildbyråmaterial, plugins, hosting eller andra tjänster. Dessa omfattas av respektive leverantörs egna licensvillkor, och eventuella löpande kostnader (t.ex. hosting eller licenser) står kunden själv för om inget annat avtalats.",
    ],
  },
  {
    title: "Sekretess",
    body: [
      "Vi behandlar information vi får ta del av i ett uppdrag konfidentiellt och delar den inte med utomstående, förutom när det krävs för att genomföra uppdraget (t.ex. med underleverantörer som är bundna av motsvarande sekretess).",
    ],
  },
  {
    title: "Ansvar och ansvarsbegränsning",
    body: [
      "Vi utför uppdraget med den omsorg som kan förväntas av en professionell leverantör. Vårt ansvar för eventuell skada är begränsat till vad som fakturerats för det aktuella uppdraget, och omfattar inte indirekta skador såsom utebliven vinst eller förlorad data.",
    ],
  },
  {
    title: "Force majeure",
    body: [
      "Vi ansvarar inte för förseningar eller brister som beror på omständigheter utanför vår kontroll — till exempel driftstörningar hos tredjepartsleverantörer, myndighetsbeslut eller andra force majeure-händelser.",
    ],
  },
  {
    title: "Uppsägning av uppdrag",
    body: [
      "Endera part kan avbryta ett pågående uppdrag med skriftlig uppsägning. Redan utfört arbete faktureras enligt offererad timkostnad eller motsvarande andel av ett fast pris.",
    ],
  },
  {
    title: "Tvist och tillämplig lag",
    body: [
      "Svensk lag gäller för dessa villkor. Tvist som inte kan lösas i samförstånd avgörs i första hand av allmän domstol med Värmlands tingsrätt som första instans.",
    ],
  },
  {
    title: "Ändringar av villkoren",
    body: [
      "Vi kan uppdatera dessa villkor löpande. Ändringar gäller för nya uppdrag från och med publiceringsdatumet — pågående uppdrag följer de villkor som gällde vid avtalets ingående.",
    ],
  },
  {
    title: "Kontakt",
    body: ["Frågor om dessa villkor skickas till info@lindqvistholmgren.se."],
  },
];

export default function AllmannaVillkorPage() {
  return (
    <>
      <PageHero
        icon={ScrollText}
        eyebrow="Allmänna villkor"
        title="Villkor för våra kunduppdrag"
        description="Så här jobbar vi tillsammans, från offert till leverans — offert, betalning, rättigheter och ansvar. Senast uppdaterad 31 augusti 2026."
      />
      <Section tone="olive">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col gap-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="font-display text-xl font-bold text-bone">{section.title}</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {section.body.map((paragraph, index) => (
                    <p key={index} className="text-base leading-relaxed text-stone">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
