import { Card } from "@/components/ui/Card";

export function OverviewCard({ overview, onEdit }: { overview?: string; onEdit: () => void }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold text-fg">Översikt</h2>
        <button type="button" onClick={onEdit} className="text-xs font-medium text-primary hover:underline">
          Redigera
        </button>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm text-fg-muted">{overview || "Ingen översikt ännu."}</p>
    </Card>
  );
}
