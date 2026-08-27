import { OptionCard } from "@/features/forma/components/OptionCard";
import { AutoAddNotice } from "@/features/forma/components/RuleNotice";
import { bathroomPrice } from "@/features/forma/data/options";
import { requireRules } from "@/features/forma/rules/configurationRules";
import type { Configuration } from "@/features/forma/types/configuration";

type BathroomStepProps = {
  configuration: Configuration;
  onChange: (patch: (config: Configuration) => Configuration) => void;
};

const bathroomRule = requireRules.find((rule) => rule.id === "bathroom-requires-va")!;

export function BathroomStep({ configuration, onChange }: BathroomStepProps) {
  return (
    <div className="flex flex-col gap-2">
      <OptionCard
        name="Badrum"
        description="Fullständigt badrum med dusch, wc och handfat."
        priceDelta={bathroomPrice}
        selected={configuration.interior.bathroom}
        onSelect={() => onChange((c) => ({ ...c, interior: { ...c.interior, bathroom: true } }))}
      />
      <OptionCard
        name="Inget badrum"
        priceDelta={0}
        selected={!configuration.interior.bathroom}
        onSelect={() => onChange((c) => ({ ...c, interior: { ...c.interior, bathroom: false } }))}
      />
      {configuration.interior.bathroom && <AutoAddNotice message={bathroomRule.message(configuration)} />}
    </div>
  );
}
