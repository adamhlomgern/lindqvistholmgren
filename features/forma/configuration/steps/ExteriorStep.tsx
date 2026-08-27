import { OptionCard } from "@/features/forma/components/OptionCard";
import { facadeOptions, roofOptions, windowOptions } from "@/features/forma/data/options";
import type { Configuration } from "@/features/forma/types/configuration";

type ExteriorStepProps = {
  configuration: Configuration;
  onChange: (patch: (config: Configuration) => Configuration) => void;
};

export function ExteriorStep({ configuration, onChange }: ExteriorStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-label text-forma-text-faint">Fasad</h3>
        <div className="flex flex-col gap-2">
          {facadeOptions.map((option) => (
            <OptionCard
              key={option.id}
              name={option.name}
              priceDelta={option.priceDelta}
              swatchColor={option.swatch}
              selected={configuration.exterior.facade === option.id}
              onSelect={() => onChange((c) => ({ ...c, exterior: { ...c.exterior, facade: option.id } }))}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-label text-forma-text-faint">Tak</h3>
        <div className="flex flex-col gap-2">
          {roofOptions.map((option) => (
            <OptionCard
              key={option.id}
              name={option.name}
              priceDelta={option.priceDelta}
              swatchColor={option.swatch}
              selected={configuration.exterior.roof === option.id}
              onSelect={() => onChange((c) => ({ ...c, exterior: { ...c.exterior, roof: option.id } }))}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-label text-forma-text-faint">Fönster</h3>
        <div className="flex flex-col gap-2">
          {windowOptions.map((option) => (
            <OptionCard
              key={option.id}
              name={option.name}
              description={option.description}
              priceDelta={option.priceDelta}
              selected={configuration.exterior.windows === option.id}
              onSelect={() => onChange((c) => ({ ...c, exterior: { ...c.exterior, windows: option.id } }))}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
