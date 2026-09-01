"use client";

import { Trash2 } from "lucide-react";

export function DeleteEmailButton({ action, subject }: { action: () => void; subject: string }) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(`Radera mejlet "${subject}" från dashboarden? Det finns kvar i den riktiga inkorgen.`)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="flex items-center gap-1.5 rounded-full border border-coral/30 px-3.5 py-2 text-xs font-medium text-coral transition-colors hover:bg-coral/10"
      >
        <Trash2 size={14} strokeWidth={2.25} />
        Radera
      </button>
    </form>
  );
}
