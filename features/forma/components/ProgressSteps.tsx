const STEP_LABELS = ["Modell", "Exteriör", "Planlösning", "Kök", "Badrum", "Tillval", "Tomt", "Sammanställning"];

export function ProgressSteps({ current }: { current: number }) {
  const label = STEP_LABELS[current] ?? "";
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-forma-text-muted">
        <span>
          {current + 1} av {STEP_LABELS.length} — {label}
        </span>
      </div>
      <div className="mt-2 flex gap-1">
        {STEP_LABELS.map((step, index) => (
          <div
            key={step}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              index <= current ? "bg-forma-accent" : "bg-forma-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
