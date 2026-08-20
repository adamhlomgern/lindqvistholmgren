import { CheckCircle2 } from "lucide-react";
import { OnboardingModal } from "@/components/demo/OnboardingModal";
import { mumsaConfig } from "@/features/restaurant-platform/config/product";

const tips = [
  "Du är nu i kundvyn — bläddra i menyn, lägg en pizza i varukorgen och gå igenom kassan.",
  "Byt till \"Restaurang\" högst upp för att se ordern dyka upp i köket och markera den som klar.",
  "\"Ägare\" visar statistik för dagens försäljning, beräknat från alla ordrar i demot.",
  "\"Återställ demo\" nollställer allt till exempeldata igen.",
];

export function MumsaOnboarding() {
  return (
    <OnboardingModal storageKey="mumsa-onboarding-seen" title={`Välkommen till ${mumsaConfig.name}`}>
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
