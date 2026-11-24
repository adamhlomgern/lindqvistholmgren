"use client";

import { useActionState, useState } from "react";
import { createCategory, type CategoryFormState } from "@/lib/actions/categories";
import { accents, articleIcons, badgeClasses, type Accent } from "@/lib/articles/visuals";
import { articleIconKeys } from "@/lib/constants";
import type { ArticleIconKey } from "@/lib/types";

const inputClasses =
  "w-full rounded-lg border border-line-strong bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none";

export function CategoryForm() {
  const [state, formAction, pending] = useActionState<CategoryFormState, FormData>(
    createCategory,
    undefined,
  );
  const [icon, setIcon] = useState<ArticleIconKey>(articleIconKeys[0]);
  const [accent, setAccent] = useState<Accent>(accents[0]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <span className="block text-xs font-medium uppercase tracking-label text-fg-muted">Namn</span>
        <input name="name" required placeholder="Ny kategori" className={`${inputClasses} mt-2`} />
      </div>

      <div>
        <span className="block text-xs font-medium uppercase tracking-label text-fg-muted">Ikon</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {articleIconKeys.map((key) => {
            const Icon = articleIcons[key];
            const active = icon === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setIcon(key)}
                aria-label={key}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                  active
                    ? "border-primary bg-pine-100 text-pine-800"
                    : "border-line text-fg-muted hover:text-fg"
                }`}
              >
                <Icon size={16} strokeWidth={2} />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <span className="block text-xs font-medium uppercase tracking-label text-fg-muted">Färg</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {accents.map((value) => {
            const active = accent === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setAccent(value)}
                aria-label={value}
                className={`h-8 w-8 rounded-full border-2 transition-transform ${badgeClasses[value]} ${
                  active ? "scale-110 border-fg" : "border-transparent"
                }`}
              />
            );
          })}
        </div>
      </div>

      <input type="hidden" name="icon" value={icon} />
      <input type="hidden" name="accent" value={accent} />

      {state?.error && <p className="text-sm text-coral">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
      >
        {pending ? "Sparar…" : "Lägg till kategori"}
      </button>
    </form>
  );
}
