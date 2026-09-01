"use client";

import { Ban } from "lucide-react";
import { blockSender } from "@/lib/actions/emails";

export function BlockSenderButton({ email }: { email: string }) {
  const action = blockSender.bind(null, email);
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (
          !confirm(
            `Blockera ${email}? Alla mejl från adressen försvinner från dashboarden, och framtida mejl synkas inte längre in.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="flex items-center gap-1.5 rounded-full border border-bone/15 px-3.5 py-2 text-xs font-medium text-stone transition-colors hover:border-coral/30 hover:text-coral"
      >
        <Ban size={14} strokeWidth={2.25} />
        Blockera avsändare
      </button>
    </form>
  );
}
