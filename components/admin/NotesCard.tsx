import { Card } from "@/components/ui/Card";

export function NotesCard({ notes, onEdit }: { notes?: string; onEdit: () => void }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-bone">Anteckningar</h2>
        <button type="button" onClick={onEdit} className="text-xs font-medium text-emerald hover:underline">
          Redigera
        </button>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm text-stone">{notes || "Inga anteckningar ännu."}</p>
    </Card>
  );
}
