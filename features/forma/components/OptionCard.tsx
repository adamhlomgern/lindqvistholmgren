import { Check } from "lucide-react";
import { PriceDelta } from "@/features/forma/components/PriceDelta";

type OptionCardProps = {
  name: string;
  description?: string;
  priceDelta: number;
  selected: boolean;
  swatchColor?: string;
  onSelect: () => void;
};

// Generic "radio card" primitive used across every configurator step for
// facade/roof/window/layout/kitchen/flooring/package choices — see the
// brief's UI-principer ("radio cards", "material swatches").
export function OptionCard({ name, description, priceDelta, selected, swatchColor, onSelect }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left shadow-sm transition-all hover:shadow-md ${
        selected
          ? "border-forma-accent bg-forma-accent-soft shadow-forma-accent/10"
          : "border-forma-border bg-forma-surface hover:-translate-y-px hover:border-forma-text-faint"
      }`}
    >
      {swatchColor && (
        <span
          className="relative h-8 w-8 shrink-0 rounded-full border border-black/10 shadow-inner"
          style={{ backgroundColor: swatchColor }}
          aria-hidden
        >
          {selected && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/15">
              <Check size={14} className="text-white drop-shadow" strokeWidth={3} />
            </span>
          )}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={`block text-sm font-semibold ${selected ? "text-forma-accent-soft-text" : "text-forma-text"}`}>
          {name}
        </span>
        {description && <span className="mt-0.5 block text-xs text-forma-text-muted">{description}</span>}
      </span>
      <PriceDelta amount={priceDelta} />
      {!swatchColor && (
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
            selected ? "border-forma-accent bg-forma-accent" : "border-forma-border bg-transparent group-hover:border-forma-text-faint"
          }`}
          aria-hidden
        >
          {selected && <Check size={12} className="text-white" strokeWidth={3} />}
        </span>
      )}
    </button>
  );
}
