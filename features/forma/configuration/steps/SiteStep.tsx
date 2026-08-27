import { Info } from "lucide-react";
import type { AccessId, Configuration, TerrainId, YesNoUnknown } from "@/features/forma/types/configuration";

type SiteStepProps = {
  configuration: Configuration;
  onChange: (patch: (config: Configuration) => Configuration) => void;
};

const terrainOptions: { id: TerrainId; label: string }[] = [
  { id: "plan", label: "Plan" },
  { id: "lutande", label: "Lätt sluttande" },
  { id: "kraftigt-lutande", label: "Kraftigt sluttande" },
  { id: "vet-inte", label: "Vet inte" },
];

const yesNoUnknownOptions: { id: YesNoUnknown; label: string }[] = [
  { id: "ja", label: "Ja" },
  { id: "nej", label: "Nej" },
  { id: "vet-inte", label: "Vet inte" },
];

const accessOptions: { id: AccessId; label: string }[] = [
  { id: "ja", label: "Ja" },
  { id: "begransad", label: "Begränsad åtkomst" },
  { id: "vet-inte", label: "Vet inte" },
];

function Pill<T extends string>({ options, value, onSelect }: { options: { id: T; label: string }[]; value: T | null; onSelect: (id: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            aria-pressed={selected}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              selected
                ? "border-forma-accent bg-forma-accent-soft text-forma-accent-soft-text"
                : "border-forma-border bg-forma-surface text-forma-text-muted hover:border-forma-text-faint"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function SiteStep({ configuration, onChange }: SiteStepProps) {
  const { site } = configuration;
  const needsReview = site.terrain !== "plan" || site.waterAndSewer !== "ja" || site.access !== "ja";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-label text-forma-text-faint" htmlFor="municipality">
          Var ska huset byggas?
        </label>
        <input
          id="municipality"
          type="text"
          value={site.municipality}
          onChange={(e) => onChange((c) => ({ ...c, site: { ...c.site, municipality: e.target.value } }))}
          placeholder="Postnummer eller kommun"
          className="w-full rounded-lg border border-forma-border bg-forma-surface px-3 py-2 text-sm text-forma-text outline-none focus:border-forma-accent"
        />
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-label text-forma-text-faint">Hur ser tomten ut?</p>
        <Pill options={terrainOptions} value={site.terrain} onSelect={(id) => onChange((c) => ({ ...c, site: { ...c.site, terrain: id } }))} />
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-label text-forma-text-faint">Finns vatten och avlopp?</p>
        <Pill
          options={yesNoUnknownOptions}
          value={site.waterAndSewer}
          onSelect={(id) => onChange((c) => ({ ...c, site: { ...c.site, waterAndSewer: id } }))}
        />
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-label text-forma-text-faint">Finns väg fram till byggplatsen?</p>
        <Pill options={accessOptions} value={site.access} onSelect={(id) => onChange((c) => ({ ...c, site: { ...c.site, access: id } }))} />
      </div>

      {needsReview && (
        <div className="flex items-start gap-2 rounded-lg border border-forma-border bg-forma-surface px-3 py-2.5 text-xs text-forma-text-muted">
          <Info size={14} className="mt-0.5 shrink-0" />
          <p>Markarbete ingår inte i uppskattningen eftersom tomtens förutsättningar behöver bedömas.</p>
        </div>
      )}
    </div>
  );
}
