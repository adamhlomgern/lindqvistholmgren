import { CheckCircle2 } from "lucide-react";
import { OnboardingModal } from "@/components/demo/OnboardingModal";
import { servicePlatformConfig } from "@/features/service-platform/config/product";

const tips = [
  "Byt bransch högst upp för att se exempel för bilverkstad, VVS eller eget underhåll.",
  "Klicka på ett objekt för att se historik, planerade påminnelser och registrera service.",
  "Kryssa i ”Vi har själva ringt kunden” på ett objekt för att logga att ni följt upp manuellt.",
  "”Återställ demo” nollställer allt till exempeldata igen.",
];

export function ServicekollOnboarding() {
  return (
    <OnboardingModal storageKey="servicekoll-onboarding-seen" title={`Välkommen till ${servicePlatformConfig.name}`}>
      <p>Det här är en interaktiv demo med färdig exempeldata — inget ni gör här sparas permanent.</p>
      <ul className="flex flex-col gap-2.5">
        {tips.map((tip) => (
          <li key={tip} className="flex items-start gap-2.5">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-demo-primary" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </OnboardingModal>
  );
}
