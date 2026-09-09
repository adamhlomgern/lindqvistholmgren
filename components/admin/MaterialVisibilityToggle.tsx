"use client";

import { Globe, Lock } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { setMaterialItemVisibility } from "@/lib/actions/material";
import type { MaterialVisibility } from "@/lib/types";

type Props = { customerId: string; itemId: string; visibility: MaterialVisibility; itemTitle: string };

// Icon always paired with a text label — a bare lock icon is exactly what
// the audit flagged as unclear. Going internal -> shared is confirmed
// (irreversible-feeling for the customer, who may see it immediately);
// shared -> internal (hiding it again) isn't.
export function MaterialVisibilityToggle({ customerId, itemId, visibility, itemTitle }: Props) {
  const label = visibility === "shared" ? "Delat med kund" : "Internt";
  const classes =
    visibility === "shared"
      ? "bg-emerald/15 text-emerald hover:bg-emerald/25"
      : "bg-bone/10 text-stone hover:bg-bone/15";

  if (visibility === "internal") {
    return (
      <ConfirmDialog
        trigger={
          <button
            type="button"
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${classes}`}
          >
            <Lock size={11} strokeWidth={2.5} />
            {label}
          </button>
        }
        title="Dela med kunden?"
        description={`"${itemTitle}" blir synligt för kunden i deras materialbibliotek.`}
        confirmLabel="Dela"
        onConfirm={() => setMaterialItemVisibility(customerId, itemId, "shared")}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setMaterialItemVisibility(customerId, itemId, "internal")}
      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${classes}`}
    >
      <Globe size={11} strokeWidth={2.5} />
      {label}
    </button>
  );
}
