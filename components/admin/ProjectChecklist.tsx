"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { addChecklistItem, deleteChecklistItem, toggleChecklistItem } from "@/lib/actions/project-checklist";
import type { ProjectChecklistItem } from "@/lib/types";

export function ProjectChecklist({ projectId, items }: { projectId: string; items: ProjectChecklistItem[] }) {
  const [label, setLabel] = useState("");
  const [pending, startTransition] = useTransition();
  const doneCount = items.filter((item) => item.done).length;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-bone">Att göra</h2>
        {items.length > 0 && (
          <span className="text-xs text-stone">
            {doneCount} av {items.length} klara
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        {items.map((item) => (
          <div key={item.id} className="group flex items-center gap-2.5 rounded-lg px-1 py-1.5 hover:bg-bone/[0.04]">
            <button
              type="button"
              onClick={() =>
                startTransition(() => {
                  toggleChecklistItem(projectId, item.id, !item.done);
                })
              }
              aria-pressed={item.done}
              aria-label={item.done ? "Markera som ej klar" : "Markera som klar"}
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                item.done ? "border-emerald bg-emerald text-charcoal" : "border-bone/30 text-transparent"
              }`}
            >
              ✓
            </button>
            <span className={`flex-1 text-sm ${item.done ? "text-stone line-through" : "text-bone"}`}>
              {item.label}
            </span>
            <button
              type="button"
              onClick={() =>
                startTransition(() => {
                  deleteChecklistItem(projectId, item.id);
                })
              }
              aria-label={`Ta bort "${item.label}"`}
              className="opacity-0 transition-opacity hover:text-coral group-hover:opacity-100"
            >
              <X size={13} strokeWidth={2.25} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="px-1 py-1 text-sm text-stone">Inga punkter ännu.</p>}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!label.trim()) return;
          const value = label;
          setLabel("");
          startTransition(() => {
            addChecklistItem(projectId, value);
          });
        }}
        className="mt-3 flex items-center gap-2 border-t border-bone/10 pt-3"
      >
        <input
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Lägg till punkt…"
          disabled={pending}
          className="w-full rounded-lg border border-bone/10 bg-bone/5 px-3 py-2 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={pending || !label.trim()}
          aria-label="Lägg till punkt"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald text-charcoal transition-colors hover:bg-bone disabled:opacity-40"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </form>
    </Card>
  );
}
