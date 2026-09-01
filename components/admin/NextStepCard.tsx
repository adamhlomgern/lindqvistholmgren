"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Check, Pencil, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { setProjectNextStep } from "@/lib/actions/client-projects";

export function NextStepCard({ projectId, nextStep }: { projectId: string; nextStep?: string }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(nextStep ?? "");
  const [saved, setSaved] = useState(nextStep ?? "");
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <Card>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              await setProjectNextStep(projectId, value);
              setSaved(value);
              setEditing(false);
            });
          }}
          className="flex flex-col gap-3"
        >
          <span className="text-xs font-medium uppercase tracking-label text-stone">Nästa steg</span>
          <input
            autoFocus
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="T.ex. Skicka förslag till kunden"
            className="w-full rounded-lg border border-bone/10 bg-bone/5 px-4 py-2.5 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={pending}
              className="flex items-center gap-1.5 rounded-full bg-emerald px-4 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
            >
              <Check size={13} strokeWidth={2.5} />
              Spara
            </button>
            <button
              type="button"
              onClick={() => {
                setValue(saved);
                setEditing(false);
              }}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-stone transition-colors hover:text-bone"
            >
              <X size={13} strokeWidth={2.5} />
              Avbryt
            </button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs font-medium uppercase tracking-label text-stone">Nästa steg</span>
          {saved ? (
            <p className="mt-1.5 flex items-center gap-2 text-sm font-medium text-bone">
              <ArrowRight size={14} strokeWidth={2.25} className="shrink-0 text-peach" />
              {saved}
            </p>
          ) : (
            <p className="mt-1.5 text-sm text-stone">Inget nästa steg satt.</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label="Redigera nästa steg"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/5 hover:text-bone"
        >
          <Pencil size={13} strokeWidth={2.25} />
        </button>
      </div>
    </Card>
  );
}
