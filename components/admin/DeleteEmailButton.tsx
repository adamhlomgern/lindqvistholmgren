"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type DeleteEmailButtonProps = {
  action: () => void | Promise<void>;
  subject: string;
  // Only needed on the email's own detail page — deleting it there leaves
  // you on a page for an email that no longer exists, so navigate away once
  // the action resolves. Omit on the list page: the row just disappears in
  // place via the action's revalidatePath, no navigation needed.
  redirectTo?: string;
};

export function DeleteEmailButton({ action, subject, redirectTo }: DeleteEmailButtonProps) {
  const router = useRouter();

  async function handleConfirm() {
    await action();
    if (redirectTo) router.push(redirectTo);
  }

  return (
    <ConfirmDialog
      trigger={
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-coral/30 px-3.5 py-2 text-xs font-medium text-coral transition-colors hover:bg-coral/10"
        >
          <Trash2 size={14} strokeWidth={2.25} />
          Radera
        </button>
      }
      title={`Radera mejlet "${subject}" från dashboarden?`}
      description="Det finns kvar i den riktiga inkorgen."
      confirmLabel="Radera"
      destructive
      onConfirm={handleConfirm}
    />
  );
}
