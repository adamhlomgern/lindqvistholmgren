import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  description:
    "Så samlar, använder och skyddar Lindqvist / Holmgren dina personuppgifter när du kontaktar oss eller skickar en projektförfrågan.",
};

type PolicySection = {
  title: string;
  body: string[];
};

const sections: PolicySection[] = [
  {
    title: "Vem är personuppgiftsansvarig",
    body: [
      "Lindqvist / Holmgren, Karlstad, är personuppgiftsansvarig för de personuppgifter som samlas in via den här webbplatsen. Har du frågor om hur vi hanterar dina uppgifter når du oss på info@lindqvistholmgren.se.",
    ],
  },
  {
    title: "Vilka uppgifter vi samlar in",
    body: [
      "När du använder kontaktformuläret eller skickar en projektförfrågan sparar vi de uppgifter du själv fyller i: namn, e-postadress, eventuellt företag och telefonnummer, samt beskrivningen av ditt projekt, budget och önskad tidsram.",
      "Vi samlar inte in fler uppgifter än vad som behövs för att kunna svara på din förfrågan.",
    ],
  },
  {
    title: "Varför vi behandlar uppgifterna",
    body: [
      "Uppgifterna används uteslutande för att kunna kontakta dig, besvara din förfrågan och ge dig ett relevant förslag. Den rättsliga grunden är berättigat intresse — att kunna bedriva vår verksamhet och svara på förfrågningar som du själv initierat.",
      "Vi använder inte uppgifterna för marknadsföring eller säljer dem vidare till tredje part.",
    ],
  },
  {
    title: "Var uppgifterna lagras",
    body: [
      "Uppgifterna lagras hos vår databasleverantör Supabase, som agerar personuppgiftsbiträde åt oss. Endast Lindqvist / Holmgren har tillgång till uppgifterna via ett lösenordsskyddat admingränssnitt.",
    ],
  },
  {
    title: "Hur länge vi sparar uppgifterna",
    body: [
      "Förfrågningar sparas så länge som krävs för att kunna hantera dialogen med dig, och raderas därefter. Vill du att vi tar bort dina uppgifter tidigare är det bara att höra av dig, se kontaktuppgifter nedan.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "Den publika delen av webbplatsen sätter inga cookies för spårning, statistik eller marknadsföring. I vår administrationspanel (/admin) används en teknisk sessionscookie för att hålla dig inloggad — den är nödvändig för att funktionen ska fungera och kräver inte samtycke.",
      "Om vi i framtiden lägger till analys- eller marknadsföringscookies uppdaterar vi den här sidan och ber om ditt samtycke innan de aktiveras.",
    ],
  },
  {
    title: "Dina rättigheter",
    body: [
      "Du har rätt att begära ett utdrag av vilka uppgifter vi har om dig, få felaktiga uppgifter rättade, begära radering, invända mot behandlingen eller be om att den begränsas. Du har också rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY) om du anser att vi hanterar dina uppgifter felaktigt.",
    ],
  },
  {
    title: "Kontakt",
    body: ["Frågor om den här policyn eller dina uppgifter skickas till info@lindqvistholmgren.se."],
  },
];

export default function IntegritetspolicyPage() {
  return (
    <>
      <PageHero
        icon={ShieldCheck}
        eyebrow="Integritetspolicy"
        title="Så hanterar vi dina uppgifter"
        description="Vi tror på att vara tydliga med vilka uppgifter vi samlar in, varför, och hur du kan påverka det. Senast uppdaterad 6 augusti 2026."
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
