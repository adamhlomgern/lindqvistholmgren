"use client";

import { useState } from "react";
import { X } from "lucide-react";

type TagPickerProps = {
  name: string;
  availableTags: string[];
  defaultValue?: string[];
};

export function TagPicker({ name, availableTags, defaultValue = [] }: TagPickerProps) {
  const [selected, setSelected] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState("");

  const unselectedAvailable = availableTags.filter((tag) => !selected.includes(tag));

  function toggle(tag: string) {
    setSelected((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function addDraft() {
    const tag = draft.trim().toLowerCase();
    if (tag && !selected.includes(tag)) {
      setSelected((prev) => [...prev, tag]);
    }
    setDraft("");
  }

  return (
    <div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className="flex items-center gap-1 rounded-full bg-emerald/15 px-3 py-1 text-xs font-medium text-emerald"
            >
              {tag}
              <X size={12} strokeWidth={2.5} />
            </button>
          ))}
        </div>
      )}
      {unselectedAvailable.length > 0 && (
        <div className={`flex flex-wrap gap-1.5 ${selected.length > 0 ? "mt-3" : ""}`}>
          {unselectedAvailable.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className="rounded-full border border-bone/10 px-3 py-1 text-xs font-medium text-stone transition-colors hover:border-emerald/40 hover:text-emerald"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addDraft();
            }
          }}
          placeholder="Lägg till ny tagg…"
          className="flex-1 rounded-lg border border-bone/10 bg-bone/5 px-3 py-2 text-xs text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none"
        />
        <button
          type="button"
          onClick={addDraft}
          className="rounded-lg border border-bone/10 px-3 py-2 text-xs font-medium text-stone hover:text-bone"
        >
          Lägg till
        </button>
      </div>
      <input type="hidden" name={name} value={selected.join(",")} readOnly />
    </div>
  );
}
