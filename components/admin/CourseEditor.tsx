"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, ChevronDown, ExternalLink, GripVertical, Loader2, Pencil, Trash2, X } from "lucide-react";
import { deleteCategory, reorderLessons, reorderModules, updateModule } from "@/lib/actions/categories";
import { accents, articleIcons, badgeClasses, type Accent } from "@/lib/articles/visuals";
import { articleIconKeys } from "@/lib/constants";
import type { ArticleIconKey, ArticleSummary } from "@/lib/types";
import type { ArticleCategory } from "@/lib/data/categories";

type Module = ArticleCategory & { lessons: ArticleSummary[] };

const statusLabel: Record<string, string> = { publicerad: "Publicerad", utkast: "Utkast", schemalagd: "Schemalagd" };

function sortLessons(cat: ArticleCategory, articles: ArticleSummary[]) {
  const order = cat.lessonOrder ?? [];
  const rank = (slug: string) => (order.indexOf(slug) === -1 ? Number.MAX_SAFE_INTEGER : order.indexOf(slug));
  return articles.filter((a) => a.category === cat.name).sort((a, b) => rank(a.slug) - rank(b.slug) || (a.date < b.date ? -1 : 1));
}

// Kunskapsbankens upplägg: dra modulerna och lektionerna i den ordning de
// ska läsas, och ge varje modul namn, beskrivning, ikon och färg.
export function CourseEditor({ categories, articles }: { categories: ArticleCategory[]; articles: ArticleSummary[] }) {
  const [modules, setModules] = useState<Module[]>(() => categories.map((c) => ({ ...c, lessons: sortLessons(c, articles) })));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  function run(action: () => Promise<{ error?: string }>) {
    setError(null);
    setSaved(false);
    start(async () => {
      const result = await action();
      if (result.error) setError(result.error);
      else {
        setSaved(true);
        setTimeout(() => setSaved(false), 1800);
      }
    });
  }

  function onModuleDrag(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = modules.findIndex((m) => m.name === active.id);
    const to = modules.findIndex((m) => m.name === over.id);
    const next = arrayMove(modules, from, to);
    setModules(next);
    run(() => reorderModules(next.map((m) => m.name)));
  }

  function onLessonsChange(name: string, lessons: ArticleSummary[]) {
    setModules((ms) => ms.map((m) => (m.name === name ? { ...m, lessons } : m)));
    run(() => reorderLessons(name, lessons.map((l) => l.slug)));
  }

  function onModuleChange(name: string, patch: Partial<Module>) {
    setModules((ms) => ms.map((m) => (m.name === name ? { ...m, ...patch, lessons: patch.name ? m.lessons.map((l) => ({ ...l, category: patch.name! })) : m.lessons } : m)));
    run(() => updateModule(name, { name: patch.name, description: patch.description ?? undefined, icon: patch.icon, accent: patch.accent }));
  }

  return (
    <div>
      <div className="mb-3 flex h-6 items-center gap-2 text-sm">
        {pending && (
          <span className="flex items-center gap-1.5 text-fg-muted">
            <Loader2 size={14} className="animate-spin" />
            Sparar …
          </span>
        )}
        {saved && !pending && (
          <span className="flex items-center gap-1.5 text-pine-700">
            <Check size={14} />
            Sparat
          </span>
        )}
        {error && <span className="text-red-700">{error}</span>}
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onModuleDrag}>
        <SortableContext items={modules.map((m) => m.name)} strategy={verticalListSortingStrategy}>
          <ol className="flex flex-col gap-3">
            {modules.map((m, i) => (
              <ModuleCard key={m.name} module={m} number={i + 1} onLessons={onLessonsChange} onChange={onModuleChange} />
            ))}
          </ol>
        </SortableContext>
      </DndContext>
      {modules.length === 0 && <p className="text-sm text-fg-muted">Inga kategorier ännu. Lägg till en nedan.</p>}
    </div>
  );
}

function ModuleCard({
  module: m,
  number,
  onLessons,
  onChange,
}: {
  module: Module;
  number: number;
  onLessons: (name: string, lessons: ArticleSummary[]) => void;
  onChange: (name: string, patch: Partial<Module>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: m.name });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(m.name);
  const [description, setDescription] = useState(m.description ?? "");
  const Icon = articleIcons[m.icon];
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  function onLessonDrag(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = m.lessons.findIndex((l) => l.slug === active.id);
    const to = m.lessons.findIndex((l) => l.slug === over.id);
    onLessons(m.name, arrayMove(m.lessons, from, to));
  }

  function save() {
    onChange(m.name, { name: name.trim() !== m.name ? name.trim() : undefined, description });
    setEditing(false);
  }

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line ${isDragging ? "relative z-10 shadow-pop" : ""}`}
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        <button type="button" {...attributes} {...listeners} aria-label={`Flytta modul ${m.name}`} className="cursor-grab touch-none text-fg-subtle hover:text-fg active:cursor-grabbing">
          <GripVertical size={18} />
        </button>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${badgeClasses[m.accent]}`}>
          <Icon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-label text-fg-subtle">Modul {number}</p>
          <p className="truncate font-display text-base font-semibold text-fg">{m.name}</p>
          {m.description && !editing && <p className="truncate text-sm text-fg-muted">{m.description}</p>}
        </div>
        <span className="hidden text-sm text-fg-muted sm:inline">
          {m.lessons.length} {m.lessons.length === 1 ? "lektion" : "lektioner"}
        </span>
        <button type="button" onClick={() => setEditing((v) => !v)} aria-label="Redigera modul" className="rounded-lg p-2 text-fg-muted hover:bg-fg/5 hover:text-fg">
          {editing ? <X size={16} /> : <Pencil size={16} />}
        </button>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Visa lektioner" className="rounded-lg p-2 text-fg-muted hover:bg-fg/5 hover:text-fg">
          <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {editing && (
        <div className="space-y-4 border-t border-line bg-surface-sunken px-4 py-4">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-label text-fg-muted">Namn</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded-lg bg-surface px-3 py-2 text-sm text-fg ring-1 ring-inset ring-line-strong focus:outline-none focus:ring-2 focus:ring-primary" />
            {name.trim() !== m.name && <span className="mt-1 block text-xs text-fg-muted">Artiklarna i modulen flyttas med till det nya namnet.</span>}
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-label text-fg-muted">Beskrivning (visas i Kunskapsbanken)</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="T.ex. Grunderna i hur en hemsida ger fler kunder."
              className="mt-1.5 w-full resize-none rounded-lg bg-surface px-3 py-2 text-sm text-fg ring-1 ring-inset ring-line-strong focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
          <div>
            <span className="text-xs font-medium uppercase tracking-label text-fg-muted">Ikon</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {articleIconKeys.map((key: ArticleIconKey) => {
                const I = articleIcons[key];
                return (
                  <button
                    key={key}
                    type="button"
                    aria-label={key}
                    onClick={() => onChange(m.name, { icon: key })}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border ${m.icon === key ? "border-primary bg-pine-100 text-pine-800" : "border-line text-fg-muted hover:text-fg"}`}
                  >
                    <I size={15} />
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-label text-fg-muted">Färg</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {accents.map((a: Accent) => (
                <button
                  key={a}
                  type="button"
                  aria-label={a}
                  onClick={() => onChange(m.name, { accent: a })}
                  className={`h-8 w-8 rounded-full ${badgeClasses[a]} ${m.accent === a ? "ring-2 ring-fg ring-offset-2 ring-offset-surface-sunken" : ""}`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={save} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-hover">
              Spara namn och beskrivning
            </button>
            <form action={deleteCategory.bind(null, m.name)} onSubmit={(e) => !confirm(`Ta bort modulen "${m.name}"? Artiklarna finns kvar men hamnar utan modul.`) && e.preventDefault()}>
              <button type="submit" className="flex items-center gap-1.5 text-sm text-fg-muted hover:text-red-700">
                <Trash2 size={14} />
                Ta bort
              </button>
            </form>
          </div>
        </div>
      )}

      {open && (
        <div className="border-t border-line">
          {m.lessons.length === 0 ? (
            <p className="px-4 py-4 text-sm text-fg-muted">Inga artiklar i den här modulen ännu. Välj modulen som kategori när ni skriver en artikel.</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onLessonDrag}>
              <SortableContext items={m.lessons.map((l) => l.slug)} strategy={verticalListSortingStrategy}>
                <ol>
                  {m.lessons.map((l, i) => (
                    <LessonRow key={l.slug} lesson={l} label={`${number}.${i + 1}`} />
                  ))}
                </ol>
              </SortableContext>
            </DndContext>
          )}
        </div>
      )}
    </li>
  );
}

function LessonRow({ lesson, label }: { lesson: ArticleSummary; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lesson.slug });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 border-b border-line bg-surface px-4 py-2.5 last:border-0 ${isDragging ? "relative z-10 shadow-raised" : ""}`}
    >
      <button type="button" {...attributes} {...listeners} aria-label={`Flytta ${lesson.title}`} className="cursor-grab touch-none text-fg-subtle hover:text-fg active:cursor-grabbing">
        <GripVertical size={16} />
      </button>
      <span className="w-8 shrink-0 font-display text-sm font-semibold tabular-nums text-fg-subtle">{label}</span>
      <span className="min-w-0 flex-1 truncate text-sm text-fg">{lesson.title}</span>
      {lesson.status && lesson.status !== "publicerad" && (
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">{statusLabel[lesson.status] ?? lesson.status}</span>
      )}
      <Link href={`/admin/artiklar/${lesson.slug}`} aria-label={`Redigera ${lesson.title}`} className="text-fg-subtle hover:text-fg">
        <ExternalLink size={14} />
      </Link>
    </li>
  );
}
