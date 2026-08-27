import { Info, TriangleAlert, Sparkles } from "lucide-react";

type ResolutionAction = { label: string; onClick: () => void };

export function AutoAddNotice({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-forma-accent-soft px-3 py-2.5 text-sm text-forma-accent-soft-text">
      <Info size={16} className="mt-0.5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

export function IncompatibleNotice({
  message,
  resolutions,
}: {
  message: string;
  resolutions: ResolutionAction[];
}) {
  return (
    <div className="rounded-lg border border-forma-danger/30 bg-forma-danger-soft px-3 py-3 text-sm text-forma-danger">
      <div className="flex items-start gap-2">
        <TriangleAlert size={16} className="mt-0.5 shrink-0" />
        <p>{message}</p>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-2 pl-6">
        {resolutions.map((resolution) => (
          <button
            key={resolution.label}
            type="button"
            onClick={resolution.onClick}
            className="rounded-full border border-forma-danger/40 bg-white px-3 py-1 text-xs font-semibold text-forma-danger transition-colors hover:bg-forma-danger-soft"
          >
            {resolution.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RecommendNotice({ message, onAdd, onDismiss }: { message: string; onAdd: () => void; onDismiss: () => void }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-forma-border bg-forma-surface px-3 py-2.5 text-sm text-forma-text">
      <Sparkles size={16} className="mt-0.5 shrink-0 text-forma-accent" />
      <div className="flex-1">
        <p>{message}</p>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={onAdd}
            className="rounded-full bg-forma-accent px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-forma-accent-hover"
          >
            Lägg till
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full px-3 py-1 text-xs font-medium text-forma-text-muted transition-colors hover:text-forma-text"
          >
            Nej tack
          </button>
        </div>
      </div>
    </div>
  );
}
