import { OptionCard } from "@/features/forma/components/OptionCard";
import { layoutOptions } from "@/features/forma/data/layouts";
import type { Configuration } from "@/features/forma/types/configuration";

type LayoutStepProps = {
  configuration: Configuration;
  onChange: (patch: (config: Configuration) => Configuration) => void;
};

export function LayoutStep({ configuration, onChange }: LayoutStepProps) {
  return (
    <div className="flex flex-col gap-2">
      {layoutOptions.map((option) => (
        <OptionCard
          key={option.id}
          name={option.name}
          description={option.description}
          priceDelta={0}
          selected={configuration.layout === option.id}
          onSelect={() => onChange((c) => ({ ...c, layout: option.id }))}
        />
      ))}
    </div>
  );
}
