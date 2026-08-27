import { OptionCard } from "@/features/forma/components/OptionCard";
import { kitchenOptions } from "@/features/forma/data/options";
import type { Configuration } from "@/features/forma/types/configuration";

type KitchenStepProps = {
  configuration: Configuration;
  onChange: (patch: (config: Configuration) => Configuration) => void;
};

export function KitchenStep({ configuration, onChange }: KitchenStepProps) {
  return (
    <div className="flex flex-col gap-2">
      {kitchenOptions.map((option) => (
        <OptionCard
          key={option.id}
          name={option.name}
          priceDelta={option.priceDelta}
          swatchColor={option.swatch}
          selected={configuration.interior.kitchen === option.id}
          onSelect={() => onChange((c) => ({ ...c, interior: { ...c.interior, kitchen: option.id } }))}
        />
      ))}
    </div>
  );
}
