"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Modal } from "@/components/demo/Modal";
import { Button } from "@/components/demo/Button";

type OnboardingModalProps = {
  // Unique per product so multiple demos on the same domain don't share
  // dismissal state.
  storageKey: string;
  title: string;
  dismissLabel?: string;
  children: ReactNode;
};

// Shown once per browser tab (sessionStorage) the first time a demo app
// mounts — a light, dismissible explainer so a first-time visitor
// understands what they're looking at before they start clicking around.
export function OnboardingModal({ storageKey, title, dismissLabel = "Jag förstår, kör igång", children }: OnboardingModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // One-shot check on mount, not a subscription to an external store, so
    // useSyncExternalStore doesn't fit — sessionStorage isn't available
    // during SSR and there's nothing to react to after this first read.
    if (!sessionStorage.getItem(storageKey)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    }
  }, [storageKey]);

  function dismiss() {
    sessionStorage.setItem(storageKey, "1");
    setOpen(false);
  }

  return (
    <Modal open={open} onClose={dismiss} title={title}>
      <div className="flex flex-col gap-4 text-sm text-demo-text-muted">{children}</div>
      <div className="mt-6 flex justify-end">
        <Button onClick={dismiss}>{dismissLabel}</Button>
      </div>
    </Modal>
  );
}
