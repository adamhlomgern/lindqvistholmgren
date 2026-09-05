"use client";

import { useOptimistic, useState, useTransition } from "react";
import { ArrowRight, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { addChecklistItem, deleteChecklistItem, toggleChecklistItem } from "@/lib/actions/project-checklist";
import type { ProjectChecklistItem } from "@/lib/types";

type OptimisticAction =
  | { type: "toggle"; id: string; done: boolean }
  | { type: "delete"; id: string }
  | { type: "add"; item: ProjectChecklistItem };

export function ProjectChecklist({ projectId, items }: { projectId: string; items: ProjectChecklistItem[] }) {
  const [label, setLabel] = useState("");
  const [, startTransition] = useTransition();
  const [optimisticItems, applyOptimistic] = useOptimistic(items, (state, action: OptimisticAction) => {
    switch (action.type) {
      case "toggle":
        return state.map((item) => (item.id === action.id ? { ...item, done: action.done } : item));
      case "delete":
        return state.filter((item) => item.id !== action.id);
      case "add":
        return [...state, action.item];
    }
  });
  const doneCount = optimisticItems.filter((item) => item.done).length;
  const nextId = optimisticItems.find((item) => !item.done)?.id;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-bone">Att göra</h2>
        {optimisticItems.length > 0 && (
          <span className="text-xs text-stone">
            {doneCount} av {optimisticItems.length} klara
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        {optimisticItems.map((item) => (
          <div key={item.id} className="group flex items-center gap-2.5 rounded-lg px-1 py-1.5 hover:bg-bone/[0.04]">
            <button
              type="button"
              onClick={() => {
                const done = !item.done;
                startTransition(async () => {
                  applyOptimistic({ type: "toggle", id: item.id, done });
                  await toggleChecklistItem(projectId, item.id, done);
                });
              }}
              aria-pressed={item.done}
              aria-label={item.done ? "Markera som ej klar" : "Markera som klar"}
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                item.done ? "border-emerald bg-emerald text-charcoal" : "border-bone/30 text-transparent"
              }`}
            >
              ✓
            </button>
            <span className="flex min-w-0 flex-1 items-center gap-1.5">
              <span className={`truncate text-sm ${item.done ? "text-stone line-through" : "text-bone"}`}>
                {item.label}
              </span>
              {item.id === nextId && (
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-peach/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-label text-peach">
                  <ArrowRight size={9} strokeWidth={2.5} />
                  Nästa
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={() => {
                startTransition(async () => {
                  applyOptimistic({ type: "delete", id: item.id });
                  await deleteChecklistItem(projectId, item.id);
                });
              }}
              aria-label={`Ta bort "${item.label}"`}
              className="opacity-0 transition-opacity hover:text-coral group-hover:opacity-100"
            >
              <X size={13} strokeWidth={2.25} />
            </button>
          </div>
        ))}
        {optimisticItems.length === 0 && <p className="px-1 py-1 text-sm text-stone">Inga punkter ännu.</p>}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!label.trim()) return;
          const value = label.trim();
          const position = optimisticItems.length;
          setLabel("");
          startTransition(async () => {
            applyOptimistic({
              type: "add",
              item: {
                id: `temp-${Date.now()}`,
                projectId,
                label: value,
                done: false,
                position,
                createdAt: new Date().toISOString(),
              },
            });
            await addChecklistItem(projectId, value, position);
          });
        }}
        className="mt-3 flex items-center gap-2 border-t border-bone/10 pt-3"
      >
        <input
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Lägg till punkt…"
          className="w-full rounded-lg border border-bone/10 bg-bone/5 px-3 py-2 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none"
        />
        <button
          type="submit"
          disabled={!label.trim()}
          aria-label="Lägg till punkt"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald text-charcoal transition-colors hover:bg-bone disabled:opacity-40"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </form>
    </Card>
  );
}
