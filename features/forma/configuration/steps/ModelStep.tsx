import { models } from "@/features/forma/data/models";
import { formatSek } from "@/features/forma/utils/format";
import type { Configuration } from "@/features/forma/types/configuration";

type ModelStepProps = {
  configuration: Configuration;
  onChange: (patch: (config: Configuration) => Configuration) => void;
};

export function ModelStep({ configuration, onChange }: ModelStepProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {models.map((model) => {
        const selected = configuration.model === model.id;
        return (
          <button
            key={model.id}
            type="button"
            onClick={() => onChange((c) => ({ ...c, model: model.id }))}
            aria-pressed={selected}
            className={`rounded-xl border px-4 py-3.5 text-left shadow-sm transition-all hover:shadow-md ${
              selected
                ? "border-forma-accent bg-forma-accent-soft"
                : "border-forma-border bg-forma-surface hover:-translate-y-px hover:border-forma-text-faint"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className={`font-forma text-base font-bold ${selected ? "text-forma-accent-soft-text" : "text-forma-text"}`}>
                {model.name}
              </span>
              <span className="text-xs font-medium text-forma-text-muted">{model.sizeSqm} m²</span>
            </div>
            <p className="mt-1 text-xs text-forma-text-muted">{model.tagline}</p>
            <p className="mt-2 text-sm font-semibold text-forma-text">Från {formatSek(model.basePrice)}</p>
          </button>
        );
      })}
    </div>
  );
}
