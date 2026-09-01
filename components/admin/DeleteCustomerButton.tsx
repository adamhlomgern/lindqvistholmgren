"use client";

import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function DeleteCustomerButton({
  action,
  customerName,
}: {
  action: () => void;
  customerName: string;
}) {
  return (
    <ConfirmDialog
      trigger={
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-coral/30 px-3.5 py-2 text-xs font-medium text-coral transition-colors hover:bg-coral/10"
        >
          <Trash2 size={14} strokeWidth={2.25} />
          Radera kund
        </button>
      }
      title={`Radera kunden "${customerName}"?`}
      description="Det går inte att ångra."
      confirmLabel="Radera"
      destructive
      onConfirm={action}
    />
  );
}
