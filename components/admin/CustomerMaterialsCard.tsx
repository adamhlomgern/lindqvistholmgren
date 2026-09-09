"use client";

import { useActionState, useEffect, useRef } from "react";
import { File as FileIcon, Lock, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { addCustomerMaterial, deleteCustomerMaterial } from "@/lib/actions/customer-materials";
import type { CustomerMaterial } from "@/lib/types";

const inputClasses =
  "w-full min-w-0 rounded-lg border border-bone/10 bg-bone/5 px-3.5 py-2.5 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none";

function MaterialRow({
  customerId,
  material,
}: {
  customerId: string;
  material: CustomerMaterial & { url: string | null };
}) {
  return (
    <div className="rounded-xl bg-bone/5 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-bone">{material.title}</p>
          {material.note && (
            <p className="mt-1 flex items-start gap-1.5 whitespace-pre-wrap text-sm text-stone">
              <Lock size={12} strokeWidth={2.25} className="mt-0.5 shrink-0 text-stone/60" />
              {material.note}
            </p>
          )}
          {material.filename && (
            <a
              href={material.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-emerald hover:underline"
            >
              <FileIcon size={12} strokeWidth={2.25} />
              {material.filename}
            </a>
          )}
        </div>
        <ConfirmDialog
          trigger={
            <button
              type="button"
              aria-label={`Radera ${material.title}`}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-stone/70 transition-colors hover:bg-coral/10 hover:text-coral"
            >
              ×
            </button>
          }
          title={`Radera "${material.title}"?`}
          description="Kunden kan inte längre se eller hämta det här."
          confirmLabel="Radera"
          destructive
          onConfirm={deleteCustomerMaterial.bind(null, customerId, material.id, material.storagePath ?? null)}
        />
      </div>
    </div>
  );
}

export function CustomerMaterialsCard({
  customerId,
  materials,
}: {
  customerId: string;
  materials: (CustomerMaterial & { url: string | null })[];
}) {
  const action = addCustomerMaterial.bind(null, customerId);
  const [state, formAction, pending] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state?.error) formRef.current?.reset();
  }, [pending, state]);

  return (
    <Card>
      <h2 className="font-display text-sm font-bold text-bone">Material</h2>
      <p className="mt-1 text-xs text-stone">
        Filer och information kunden alltid ska kunna hämta — logotyp, inloggningsuppgifter, varumärkesmaterial.
      </p>

      <div className="mt-3 flex flex-col gap-2">
        {materials.length === 0 && <p className="text-sm text-stone">Inget tillagt ännu.</p>}
        {materials.map((material) => (
          <MaterialRow key={material.id} customerId={customerId} material={material} />
        ))}
      </div>

      <form ref={formRef} action={formAction} className="mt-4 flex flex-col gap-2 border-t border-bone/10 pt-4">
        <input name="title" required placeholder="Titel, t.ex. Logotyp eller Inloggning webbplats" className={inputClasses} />
        <textarea
          name="note"
          rows={2}
          placeholder="Text (valfritt om en fil bifogas), t.ex. inloggningsuppgifter — krypteras innan den sparas"
          className={inputClasses}
        />
        <div className="flex items-center gap-2">
          <input
            type="file"
            name="file"
            className="w-full min-w-0 text-xs text-stone file:mr-3 file:rounded-full file:border-0 file:bg-bone/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-bone hover:file:bg-bone/15"
          />
          <button
            type="submit"
            disabled={pending}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald px-4 py-2.5 text-xs font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
          >
            <Plus size={14} strokeWidth={2.5} />
            Lägg till
          </button>
        </div>
      </form>
      {state?.error && <p className="mt-2 text-sm text-coral">{state.error}</p>}
    </Card>
  );
}
