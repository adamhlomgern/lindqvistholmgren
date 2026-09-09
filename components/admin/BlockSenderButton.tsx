"use client";

import { useRouter } from "next/navigation";
import { Ban } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { blockSender } from "@/lib/actions/emails";

type BlockSenderButtonProps = {
  email: string;
  // Only needed on an email's own detail page — blocking its sender deletes
  // that email too, leaving you on a page for something that no longer
  // exists, so navigate away once it resolves. Omit on the list page: the
  // row(s) just disappear in place via the action's revalidatePath.
  redirectTo?: string;
};

export function BlockSenderButton({ email, redirectTo }: BlockSenderButtonProps) {
  const router = useRouter();

  async function handleConfirm() {
    await blockSender(email);
    if (redirectTo) router.push(redirectTo);
  }

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
      onConfirm={handleConfirm}
    />
  );
}
