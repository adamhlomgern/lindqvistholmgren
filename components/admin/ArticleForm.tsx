"use client";

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MoreHorizontal, Trash2, X } from "lucide-react";
import type { Article, ArticleStatus } from "@/lib/types";
import type { ArticleCategory } from "@/lib/data/categories";
import { articleIcons, resolveCategoryVisual } from "@/lib/articles/visuals";
import { createArticle, updateArticle, deleteArticle, type ArticleFormState } from "@/lib/actions/articles";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Select } from "@/components/ui/Select";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { TagPicker } from "@/components/admin/TagPicker";
import { ArticleOutline } from "@/components/admin/ArticleOutline";
import { AutoGrowTextarea } from "@/components/admin/AutoGrowTextarea";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Card } from "@/components/ui/Card";
import type { OutlineHeading } from "@/lib/articles/outline";

const inputClasses =
  "w-full min-w-0 rounded-lg border border-bone/10 bg-bone/5 px-4 py-3 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none disabled:opacity-50";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  // A <label> here would be nice for a11y, but native label-click-delegation
  // forwards any click inside it to the *first* labelable descendant — a
  // real problem once a field contains more than one control (toolbar
  // buttons, tag pills), where it hijacks clicks meant for something else.
  return (
    <div className="block min-w-0">
      <span className="block text-xs font-medium uppercase tracking-label text-stone">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-stone/70">{hint}</span>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

type Tab = "innehall" | "publicering" | "seo";

const tabs: { value: Tab; label: string }[] = [
  { value: "innehall", label: "Innehåll" },
  { value: "publicering", label: "Publicering" },
  { value: "seo", label: "SEO" },
];

const statusOptions: { value: ArticleStatus; label: string }[] = [
  { value: "publicerad", label: "Publicerad" },
  { value: "utkast", label: "Utkast" },
  { value: "schemalagd", label: "Schemalagd" },
  { value: "avpublicerad", label: "Avpublicerad" },
];

type ArticleFormProps = {
  article?: Article;
  availableTags: string[];
  categories: ArticleCategory[];
};

export function ArticleForm({ article, availableTags, categories }: ArticleFormProps) {
  const isEditing = Boolean(article);
  const action = isEditing ? updateArticle.bind(null, article!.slug) : createArticle;
  const [state, formAction, pending] = useActionState<ArticleFormState, FormData>(action, undefined);

  const [tab, setTab] = useState<Tab>("innehall");
  const [category, setCategory] = useState(article?.category ?? categories[0]?.name ?? "");
  const [status, setStatus] = useState<ArticleStatus>(article?.status ?? "publicerad");
  const [outline, setOutline] = useState<OutlineHeading[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [titleValue, setTitleValue] = useState(article?.title ?? "");
  const [excerptValue, setExcerptValue] = useState(article?.excerpt ?? "");
  const [slugValue, setSlugValue] = useState(article?.slug ?? "");
  const [seoTitleValue, setSeoTitleValue] = useState(article?.seoTitle ?? "");
  const [metaDescriptionValue, setMetaDescriptionValue] = useState(article?.metaDescription ?? "");
  const [menuOpen, setMenuOpen] = useState(false);
  const [structureOpen, setStructureOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { icon, accent } = resolveCategoryVisual(categories, category);
  const Icon = articleIcons[icon];
  const readMinutes = Math.max(1, Math.round(wordCount / 200));

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
    <form action={formAction} className="flex flex-col gap-6">
      <div ref={sentinelRef} aria-hidden className="h-px" />

      <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-bone/10 bg-charcoal/95 px-4 py-2 backdrop-blur sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/admin/artiklar"
            aria-label="Tillbaka till artiklar"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/5 hover:text-bone md:hidden"
          >
            <ArrowLeft size={16} strokeWidth={2.25} />
          </Link>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-bone">{titleValue || "Ny artikel"}</p>
            {!compact && (
              <p className="text-xs text-stone">
                {wordCount > 0 ? `${wordCount} ord · cirka ${readMinutes} min läsning` : "Inget innehåll ännu"}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isEditing && (
            <Link
              href={`/admin/artiklar/${article!.slug}/forhandsgranska`}
              target="_blank"
              aria-label="Förhandsgranska"
              title="Förhandsgranska"
              className="flex items-center gap-1 text-xs font-medium text-emerald hover:underline"
            >
              <span className="hidden sm:inline">Förhandsgranska</span>
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </Link>
          )}
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-emerald px-4 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60 sm:px-5"
          >
            {pending ? "Sparar…" : isEditing ? "Spara" : "Skapa"}
          </button>
          {isEditing && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Fler alternativ"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/5 hover:text-bone"
              >
                <MoreHorizontal size={16} strokeWidth={2.25} />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-20 mt-1.5 w-52 rounded-xl border border-bone/10 bg-forest p-1.5 shadow-xl"
                >
                  <ConfirmDialog
                    trigger={
                      <button
                        type="button"
                        role="menuitem"
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-coral transition-colors hover:bg-coral/10"
                      >
                        <Trash2 size={14} strokeWidth={2.25} />
                        Radera artikel
                      </button>
                    }
                    title={`Radera artikeln "${article!.title}"?`}
                    description="Det går inte att ångra."
                    confirmLabel="Radera"
                    destructive
                    onConfirm={() => deleteArticle(article!.slug)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 self-start rounded-full bg-bone/5 p-1">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              tab === t.value ? "bg-emerald/15 text-emerald" : "text-stone hover:text-bone"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {state?.error && <p className="text-sm text-coral">{state.error}</p>}

      <div className="grid gap-6 lg:grid-cols-[1fr_260px] lg:items-start">
        <div className="min-w-0">
          <div
            className={
              tab === "innehall"
                ? "flex flex-col gap-5 sm:rounded-2xl sm:bg-bone/5 sm:p-6"
                : "hidden"
            }
          >
            <Field label="Titel">
              <AutoGrowTextarea
                name="title"
                value={titleValue}
                onChange={setTitleValue}
                required
                maxHeight={110}
                className={`${inputClasses} font-display font-bold`}
              />
            </Field>
            <Field label="Ingress (visas i listan)" hint={`${excerptValue.length} tecken`}>
              <AutoGrowTextarea
                name="excerpt"
                value={excerptValue}
                onChange={setExcerptValue}
                required
                maxHeight={200}
                className={inputClasses}
              />
            </Field>
            <RichTextEditor
              name="content"
              defaultValue={article?.content ?? ""}
              onOutlineChange={setOutline}
              onWordCountChange={setWordCount}
              onOpenStructure={() => setStructureOpen(true)}
            />
          </div>

          <Card className={tab === "publicering" ? "flex flex-col gap-5" : "hidden"}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Status">
                <Select
                  name="status"
                  value={status}
                  onValueChange={(value) => setStatus(value as ArticleStatus)}
                  className="w-full rounded-lg px-4 py-3 text-sm"
                  options={statusOptions}
                />
              </Field>
              <Field label={status === "schemalagd" ? "Schemalagd till" : "Publiceringsdatum"}>
                <input
                  name="date"
                  type="date"
                  defaultValue={article?.date}
                  required
                  className={`${inputClasses} min-w-[9.5rem]`}
                />
              </Field>
            </div>

            <Field label="Kategori">
              <div className="flex min-w-0 items-center gap-2">
                <AccentBadge icon={Icon} accent={accent} boxSize="compact" />
                <Select
                  name="category"
                  value={category}
                  onValueChange={setCategory}
                  className="w-full min-w-0 rounded-lg px-4 py-3 text-sm"
                  options={categories.map((value) => ({ value: value.name, label: value.name }))}
                />
              </div>
            </Field>
            <input type="hidden" name="icon" value={icon} />

            <Field label="Taggar">
              <TagPicker name="tags" availableTags={availableTags} defaultValue={article?.tags ?? []} />
            </Field>
          </Card>

          <Card className={tab === "seo" ? "flex flex-col gap-5" : "hidden"}>
            <div className="min-w-0">
              <span className="block text-xs font-medium uppercase tracking-label text-stone">Sökmotorvisning</span>
              <div className="mt-2 min-w-0 rounded-lg border border-bone/10 bg-bone/5 px-4 py-3">
                <p className="truncate text-sm text-sky">{seoTitleValue || titleValue || "Artikelns titel"}</p>
                <p className="truncate text-xs text-emerald/80">
                  lindqvistholmgren.se/artiklar/{slugValue || "url-slug"}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-stone">
                  {metaDescriptionValue || excerptValue || "Ingressen visas här om inget annat anges."}
                </p>
              </div>
            </div>

            <Field label="SEO-titel (valfritt)" hint="Standard: artikelns titel">
              <AutoGrowTextarea
                name="seoTitle"
                value={seoTitleValue}
                onChange={setSeoTitleValue}
                placeholder={titleValue}
                maxHeight={90}
                className={inputClasses}
              />
            </Field>
            <Field label="Metabeskrivning (valfritt)" hint="Standard: ingressen">
              <AutoGrowTextarea
                name="metaDescription"
                value={metaDescriptionValue}
                onChange={setMetaDescriptionValue}
                placeholder={excerptValue}
                maxHeight={140}
                className={inputClasses}
              />
            </Field>
            <Field label="Slug (url)">
              <input
                name="slug"
                value={slugValue}
                onChange={(event) => setSlugValue(event.target.value)}
                readOnly={isEditing}
                required
                placeholder="min-artikel"
                className={inputClasses}
              />
            </Field>
          </Card>
        </div>

        {tab === "innehall" && (
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <span className="text-xs font-semibold uppercase tracking-label text-stone/50">Artikelstruktur</span>
              <div className="mt-3">
                <ArticleOutline headings={outline} />
              </div>
            </div>
          </div>
        )}
      </div>

      {structureOpen && (
        <div role="dialog" aria-label="Artikelstruktur" className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/80" onClick={() => setStructureOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-bone/10 bg-forest p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-label text-stone/50">Artikelstruktur</span>
              <button
                type="button"
                onClick={() => setStructureOpen(false)}
                aria-label="Stäng"
                className="flex h-7 w-7 items-center justify-center rounded-full text-stone hover:text-bone"
              >
                <X size={16} strokeWidth={2.25} />
              </button>
            </div>
            <div className="mt-3">
              <ArticleOutline headings={outline} onNavigate={() => setStructureOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
