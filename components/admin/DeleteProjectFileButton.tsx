"use client";

import { X } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function DeleteProjectFileButton({ action, filename }: { action: () => void; filename: string }) {
  return (
    <ConfirmDialog
      trigger={
        <button
          type="button"
          aria-label={`Radera ${filename}`}
          className="flex h-7 w-7 items-center justify-center rounded-full text-stone/70 transition-colors hover:bg-coral/10 hover:text-coral"
        >
          <X size={14} strokeWidth={2.25} />
        </button>
      }
      title={`Radera filen "${filename}"?`}
      confirmLabel="Radera"
      destructive
      onConfirm={action}
    />
  );
}
