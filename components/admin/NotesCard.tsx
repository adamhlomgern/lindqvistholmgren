import { Card } from "@/components/ui/Card";
import { InternalOnlyBadge } from "@/components/admin/InternalOnlyBadge";

export function NotesCard({ notes, onEdit }: { notes?: string; onEdit: () => void }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-sm font-bold text-bone">Anteckningar</h2>
        <div className="flex items-center gap-2">
          <InternalOnlyBadge />
          <button type="button" onClick={onEdit} className="text-xs font-medium text-emerald hover:underline">
            Redigera
          </button>
        </div>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm text-stone">{notes || "Inga anteckningar ännu."}</p>
    </Card>
  );
}
