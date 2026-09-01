"use client";

import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function DeleteClientProjectButton({
  action,
  projectTitle,
}: {
  action: () => void;
  projectTitle: string;
}) {
  return (
    <ConfirmDialog
      trigger={
        <button
          type="button"
          role="menuitem"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-coral transition-colors hover:bg-coral/10"
        >
          <Trash2 size={14} strokeWidth={2.25} />
          Radera projekt
        </button>
      }
      title={`Radera projektet "${projectTitle}"?`}
      description="Det går inte att ångra."
      confirmLabel="Radera"
      destructive
      onConfirm={action}
    />
  );
}
