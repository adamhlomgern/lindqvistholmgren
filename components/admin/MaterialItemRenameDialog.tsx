"use client";

import { useActionState, useEffect, useRef } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { renameMaterialItem, type MaterialFormState } from "@/lib/actions/material";

const inputClasses =
  "w-full rounded-lg border border-line-strong bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none disabled:opacity-50";

type Props = {
  open: boolean;
  onClose: () => void;
  customerId: string;
  itemId: string;
  title: string;
};

export function MaterialItemRenameDialog({ open, onClose, customerId, itemId, title }: Props) {
  const action = async (_prevState: MaterialFormState, formData: FormData): Promise<MaterialFormState> =>
    renameMaterialItem(customerId, itemId, String(formData.get("title") ?? ""));
  const [state, formAction, pending] = useActionState<MaterialFormState, FormData>(action, undefined);

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) onClose();
    wasPending.current = pending;
  }, [pending, state, onClose]);

  return (
    <SlideOver open={open} onClose={onClose} title="Byt namn">
      <form action={formAction} className="flex flex-col gap-5">
        <div>
          <span className="block text-xs font-medium uppercase tracking-label text-fg-muted">Namn</span>
          <input name="title" defaultValue={title} required autoFocus className={`mt-2 ${inputClasses}`} />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {pending ? "Sparar…" : "Spara"}
          </button>
          {state?.error && <p className="text-sm text-coral">{state.error}</p>}
        </div>
      </form>
    </SlideOver>
  );
}
