"use client";

import { useEffect, useState } from "react";
import type { OutlineHeading } from "@/lib/articles/outline";

export function ArticleOutline({
  headings,
  onNavigate,
}: {
  headings: OutlineHeading[];
  onNavigate?: () => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-90px 0px -70% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return <p className="text-xs text-stone">Rubriker (H2/H3) i artikeln visas här.</p>;
  }

  const minLevel = Math.min(...headings.map((h) => h.level));

  return (
    <nav aria-label="Artikelstruktur" className="flex flex-col gap-0.5">
      {headings.map((heading) => (
        <a
          key={`${heading.id}-${heading.text}`}
          href={`#${heading.id}`}
          onClick={(event) => {
            event.preventDefault();
            document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            onNavigate?.();
          }}
          style={{ paddingLeft: `${(heading.level - minLevel) * 12}px` }}
          className={`flex items-center gap-1.5 truncate rounded-lg px-2 py-1.5 text-xs transition-colors ${
            activeId === heading.id ? "text-emerald" : "text-stone hover:text-bone"
          }`}
        >
          {activeId === heading.id && <span className="h-1 w-1 shrink-0 rounded-full bg-emerald" />}
          <span className="truncate">{heading.text || "(Rubrik)"}</span>
        </a>
      ))}
    </nav>
  );
}
