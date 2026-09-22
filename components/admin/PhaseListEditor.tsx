"use client";

import { Check, ChevronDown, ChevronUp, Plus, X } from "lucide-react";

type Props = {
  labels: string[];
  current: number;
  onChange: (labels: string[], current: number) => void;
};

// Replaces the old "Faser, kommaseparerat" text field — audit feedback was
// that it gave no way to see how to pick the current phase or mark one
// done. A real ordered list: add, reorder (buttons, not drag — a menu
// alternative to dragging was explicitly asked for, so it's built as the
// only way rather than a fallback), remove, and click to mark current.
export function PhaseListEditor({ labels, current, onChange }: Props) {
  function updateLabel(index: number, value: string) {
    const next = [...labels];
    next[index] = value;
    onChange(next, current);
  }

  function addPhase() {
    onChange([...labels, ""], current);
  }

  function removePhase(index: number) {
    const next = labels.filter((_, i) => i !== index);
    let nextCurrent = current;
    if (index < current) nextCurrent = current - 1;
    else if (index === current) nextCurrent = Math.min(current, next.length - 1);
    onChange(next, Math.max(nextCurrent, 0));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= labels.length) return;
    const next = [...labels];
    [next[index], next[target]] = [next[target], next[index]];
    let nextCurrent = current;
    if (current === index) nextCurrent = target;
    else if (current === target) nextCurrent = index;
    onChange(next, nextCurrent);
  }

  return (
    <div className="flex flex-col gap-1.5">
      {labels.map((label, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onChange(labels, index)}
            aria-label={index === current ? "Aktuell fas" : `Markera "${label || "fas"}" som aktuell`}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
              index === current ? "bg-emerald text-charcoal" : "bg-bone/10 text-stone hover:bg-bone/15"
            }`}
          >
            {index === current && <Check size={13} strokeWidth={2.5} />}
          </button>
          <input
            value={label}
            onChange={(event) => updateLabel(index, event.target.value)}
            placeholder="Fasnamn"
            className="w-full min-w-0 flex-1 rounded-lg border border-bone/10 bg-bone/5 px-3 py-2 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none"
          />
          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              aria-label="Flytta upp"
              className="flex h-8 w-8 items-center justify-center text-stone transition-colors hover:text-bone disabled:opacity-30"
            >
              <ChevronUp size={14} strokeWidth={2.25} />
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === labels.length - 1}
              aria-label="Flytta ner"
              className="flex h-8 w-8 items-center justify-center text-stone transition-colors hover:text-bone disabled:opacity-30"
            >
              <ChevronDown size={14} strokeWidth={2.25} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => removePhase(index)}
            aria-label={`Ta bort "${label || "fas"}"`}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-stone transition-colors hover:text-coral"
          >
            <X size={14} strokeWidth={2.25} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addPhase}
        className="mt-1 flex items-center gap-1.5 self-start text-xs font-medium text-emerald hover:underline"
      >
        <Plus size={13} strokeWidth={2.5} />
        Lägg till fas
      </button>
    </div>
  );
}
