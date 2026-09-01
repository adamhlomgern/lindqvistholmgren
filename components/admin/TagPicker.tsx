"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Search, X } from "lucide-react";

type TagPickerProps = {
  name: string;
  availableTags: string[];
  defaultValue?: string[];
};

export function TagPicker({ name, availableTags, defaultValue = [] }: TagPickerProps) {
  const [selected, setSelected] = useState<string[]>(defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function toggle(tag: string) {
    setSelected((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function addNew() {
    const tag = query.trim().toLowerCase();
    if (tag && !selected.includes(tag)) {
      setSelected((prev) => [...prev, tag]);
    }
    setQuery("");
  }

  const matches = availableTags.filter(
    (tag) => !selected.includes(tag) && tag.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const exactMatchExists = availableTags.some((tag) => tag.toLowerCase() === query.trim().toLowerCase());

  return (
    <div ref={ref} className="relative">
      <div className="flex flex-wrap items-center gap-1.5">
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
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 rounded-full border border-dashed border-bone/20 px-3 py-1 text-xs font-medium text-stone transition-colors hover:border-emerald/40 hover:text-emerald"
        >
          <Plus size={12} strokeWidth={2.5} />
          Lägg till taggar
        </button>
      </div>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1.5 w-64 overflow-hidden rounded-xl border border-bone/10 bg-forest shadow-xl">
          <div className="flex items-center gap-2 border-b border-bone/10 px-3 py-2">
            <Search size={13} strokeWidth={2.25} className="shrink-0 text-stone" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (matches.length > 0) {
                    toggle(matches[0]);
                    setQuery("");
                  } else if (!exactMatchExists) {
                    addNew();
                  }
                }
              }}
              placeholder="Sök taggar…"
              className="w-full bg-transparent text-xs text-bone placeholder:text-stone/60 focus:outline-none"
            />
          </div>
          <div className="max-h-48 overflow-y-auto p-1.5">
            {matches.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  toggle(tag);
                  setQuery("");
                }}
                className="flex w-full items-center rounded-lg px-2.5 py-2 text-left text-sm text-bone transition-colors hover:bg-bone/10"
              >
                {tag}
              </button>
            ))}
            {matches.length === 0 && !query && <p className="px-2.5 py-2 text-xs text-stone">Inga fler taggar.</p>}
            {query.trim() && !exactMatchExists && (
              <button
                type="button"
                onClick={addNew}
                className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-emerald transition-colors hover:bg-emerald/10"
              >
                <Plus size={13} strokeWidth={2.5} />
                Skapa &quot;{query.trim()}&quot;
              </button>
            )}
          </div>
        </div>
      )}

      <input type="hidden" name={name} value={selected.join(",")} readOnly />
    </div>
  );
}
