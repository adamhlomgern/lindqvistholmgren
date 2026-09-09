"use client";

import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

// Styled as a dropdown menu item — its only use is inside
// CustomerWorkspaceHeader's "..." menu.
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
          role="menuitem"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-coral transition-colors hover:bg-coral/10"
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
