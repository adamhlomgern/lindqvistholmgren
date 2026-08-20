"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/types";
import type { ArticleCategory } from "@/lib/data/categories";
import { articleIcons, resolveCategoryVisual } from "@/lib/articles/visuals";
import { createArticle, updateArticle, type ArticleFormState } from "@/lib/actions/articles";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { TagPicker } from "@/components/admin/TagPicker";

const inputClasses =
  "w-full rounded-lg border border-bone/10 bg-bone/5 px-4 py-3 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none disabled:opacity-50";

// Windows renders <option> against the OS theme, not the page's CSS, unless
// each option carries its own explicit colors.
const optionStyle = { backgroundColor: "var(--color-forest)", color: "var(--color-bone)" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  // A <label> here would be nice for a11y, but native label-click-delegation
  // forwards any click inside it to the *first* labelable descendant — a
  // real problem once a field contains more than one control (toolbar
  // buttons, tag pills), where it hijacks clicks meant for something else.
  return (
    <div className="block">
      <span className="block text-xs font-medium uppercase tracking-label text-stone">{label}</span>
      <div className="mt-2">{children}</div>
    </div>
  );
}

type ArticleFormProps = {
  article?: Article;
  availableTags: string[];
  categories: ArticleCategory[];
};

export function ArticleForm({ article, availableTags, categories }: ArticleFormProps) {
  const isEditing = Boolean(article);
  const action = isEditing ? updateArticle.bind(null, article!.slug) : createArticle;
  const [state, formAction, pending] = useActionState<ArticleFormState, FormData>(action, undefined);

  const [category, setCategory] = useState(article?.category ?? categories[0]?.name ?? "");
  const { icon, accent } = resolveCategoryVisual(categories, category);
  const Icon = articleIcons[icon];

  if (categories.length === 0) {
    return (
      <p className="text-sm text-stone">
        Du behöver{" "}
        <Link href="/admin/kategorier" className="text-emerald hover:underline">
          lägga till en kategori
        </Link>{" "}
        innan du kan skapa en artikel.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Slug (url)">
          <input
            name="slug"
            defaultValue={article?.slug}
            readOnly={isEditing}
            required
            placeholder="min-artikel"
            className={inputClasses}
          />
        </Field>
        <Field label="Titel">
          <input name="title" defaultValue={article?.title} required className={inputClasses} />
        </Field>
      </div>

      <Field label="Ingress (visas i listan)">
        <textarea
          name="excerpt"
          defaultValue={article?.excerpt}
          required
          rows={2}
          className={inputClasses}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <Field label="Kategori">
          <select
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={`${inputClasses} cursor-pointer`}
            style={optionStyle}
          >
            {categories.map((value) => (
              <option key={value.name} value={value.name} style={optionStyle}>
                {value.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex items-center gap-2 pb-1">
          <AccentBadge icon={Icon} accent={accent} />
          <span className="text-xs text-stone">Ikon väljs automatiskt utifrån kategori</span>
        </div>
        <input type="hidden" name="icon" value={icon} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Datum (ÅÅÅÅ-MM-DD)">
          <input
            name="date"
            type="date"
            defaultValue={article?.date}
            required
            className={inputClasses}
          />
        </Field>
        <Field label="Lästid (t.ex. 4 min läsning)">
          <input
            name="readTime"
            defaultValue={article?.readTime}
            required
            className={inputClasses}
          />
        </Field>
      </div>

      <Field label="Taggar">
        <TagPicker name="tags" availableTags={availableTags} defaultValue={article?.tags ?? []} />
      </Field>

      <Field label="Innehåll">
        <RichTextEditor name="content" defaultValue={article?.content ?? ""} />
      </Field>

      {state?.error && <p className="text-sm text-coral">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
      >
        {pending ? "Sparar…" : isEditing ? "Spara ändringar" : "Skapa artikel"}
      </button>
    </form>
  );
}
