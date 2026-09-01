"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useTransition, type ReactNode } from "react";

type ConfirmDialogProps = {
  trigger: ReactNode;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
};

// Themed replacement for window.confirm() — every destructive/consequential
// action in admin routes through this instead of the browser's native
// dialog, which looks foreign against the rest of the UI.
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Bekräfta",
  cancelLabel = "Avbryt",
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  const [pending, startTransition] = useTransition();

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-sm" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-bone/10 bg-forest p-6 shadow-2xl focus:outline-none">
          <AlertDialog.Title className="font-display text-base font-bold text-bone">{title}</AlertDialog.Title>
          {description && (
            <AlertDialog.Description className="mt-2 text-sm text-stone">{description}</AlertDialog.Description>
          )}
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                className="rounded-full px-4 py-2 text-sm font-medium text-stone transition-colors hover:text-bone"
              >
                {cancelLabel}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                disabled={pending}
                onClick={() => startTransition(onConfirm)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
                  destructive
                    ? "bg-coral text-charcoal hover:bg-coral/90"
                    : "bg-emerald text-charcoal hover:bg-bone"
                }`}
              >
                {pending ? "…" : confirmLabel}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
