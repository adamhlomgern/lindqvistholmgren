import { Lock } from "lucide-react";

// Static — unlike MaterialVisibilityToggle, tasks and notes have no
// customer-visible counterpart to switch to, so this is a label, not a
// control. Audit feedback: an admin shouldn't have to open "Visa som kund"
// to find out whether something on the project page is customer-facing.
export function InternalOnlyBadge() {
  return (
    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-fg/10 px-2.5 py-1 text-xs font-medium text-fg-muted">
      <Lock size={11} strokeWidth={2.5} />
      Endast internt
    </span>
  );
}
