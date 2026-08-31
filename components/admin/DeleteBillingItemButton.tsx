"use client";

import { X } from "lucide-react";

export function DeleteBillingItemButton({
  action,
  itemName,
}: {
  action: () => void;
  itemName: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(`Radera "${itemName}"? Det går inte att ångra.`)) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit" aria-label={`Ta bort ${itemName}`} className="text-stone hover:text-coral">
        <X size={16} strokeWidth={2.25} />
      </button>
    </form>
  );
}
