"use client";

import { X } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function DeleteBillingItemButton({
  action,
  itemName,
}: {
  action: () => void;
  itemName: string;
}) {
  return (
    <ConfirmDialog
      trigger={
        <button type="button" aria-label={`Ta bort ${itemName}`} className="text-stone hover:text-coral">
          <X size={16} strokeWidth={2.25} />
        </button>
      }
      title={`Radera "${itemName}"?`}
      description="Det går inte att ångra."
      confirmLabel="Radera"
      destructive
      onConfirm={action}
    />
  );
}
