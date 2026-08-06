"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TagRow } from "@/components/admin/TagRow";

export function TagsManager({ tags }: { tags: [string, number][] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tags;
    return tags.filter(([tag]) => tag.toLowerCase().includes(q));
  }, [tags, query]);

  return (
    <div>
      <div className="relative mt-8 max-w-sm">
        <Search
          size={16}
          strokeWidth={2.25}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Sök tagg…"
          aria-label="Sök tagg"
          className="w-full rounded-xl border border-bone/10 bg-bone/5 py-2.5 pl-10 pr-4 text-sm text-bone placeholder:text-stone/50 transition-colors focus:border-emerald/60 focus:outline-none"
        />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {filtered.map(([tag, count]) => (
          <TagRow key={tag} tag={tag} count={count} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-stone">
            {tags.length === 0 ? "Inga taggar ännu." : `Inga taggar matchar "${query}".`}
          </p>
        )}
      </div>
    </div>
  );
}
