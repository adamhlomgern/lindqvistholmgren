"use client";

import { Ban } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { blockSender } from "@/lib/actions/emails";

export function BlockSenderButton({ email }: { email: string }) {
  return (
    <ConfirmDialog
      trigger={
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-bone/15 px-3.5 py-2 text-xs font-medium text-stone transition-colors hover:border-coral/30 hover:text-coral"
        >
          <Ban size={14} strokeWidth={2.25} />
          Blockera avsändare
        </button>
      }
      title={`Blockera ${email}?`}
      description="Alla mejl från adressen försvinner från dashboarden, och framtida mejl synkas inte längre in."
      confirmLabel="Blockera"
      destructive
      onConfirm={() => blockSender(email)}
    />
  );
}
