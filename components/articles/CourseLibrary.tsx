"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, ChevronDown, Circle, Clock, GraduationCap, LayoutGrid, Search, X } from "lucide-react";
import { articleIcons, badgeClasses, iconTextClasses } from "@/lib/articles/visuals";
import { buildCourse, readMinutes } from "@/lib/articles/course";
import { useReadLessons } from "@/components/articles/useReadLessons";
import type { ArticleSummary } from "@/lib/types";
import type { ArticleCategory } from "@/lib/data/categories";

const NEW_DAYS = 30;

function isNew(date: string) {
  return (Date.now() - new Date(date).getTime()) / 86400000 <= NEW_DAYS;
}

// Kunskapsbanken: artiklarna som en kurs med moduler (kategorier) och
// numrerade lektioner, en progress-mätare och "fortsätt där ni slutade".
// Läst-status sparas i webbläsaren (useReadLessons).
export function CourseLibrary({ articles, categories }: { articles: ArticleSummary[]; categories: ArticleCategory[] }) {
  const course = useMemo(() => buildCourse(articles, categories), [articles, categories]);
  const { read, reset } = useReadLessons();
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  const lessons = course.flatMap((m) => m.lessons);
  const total = lessons.length;
  const done = lessons.filter((l) => read.has(l.slug)).length;
  const totalMinutes = course.reduce((s, m) => s + m.minutes, 0);
  const nextLesson = lessons.find((l) => !read.has(l.slug)) ?? null;
  const percent = total ? Math.round((done / total) * 100) : 0;

  const q = query.trim().toLowerCase();
  const matches = (l: ArticleSummary) =>
    !q || `${l.title} ${l.excerpt} ${l.tags.join(" ")} ${l.category}`.toLowerCase().includes(q);

  function toggle(n: number) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-14">
      <div className="order-2 lg:order-1">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Sök bland lektionerna"
            aria-label="Sök bland lektionerna"
            className="h-12 w-full rounded-2xl bg-surface pl-11 pr-10 text-[15px] text-fg ring-1 ring-inset ring-line-strong placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Rensa" className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="mt-6 space-y-4">
          {course.map((mod) => {
            const visible = mod.lessons.filter(matches);
            if (q && visible.length === 0) return null;
            const Icon = articleIcons[mod.icon] ?? LayoutGrid;
            const moduleDone = mod.lessons.filter((l) => read.has(l.slug)).length;
            const open = q ? true : !collapsed.has(mod.number);
            return (
              <section key={mod.name} className="overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-line">
                <button
                  type="button"
                  onClick={() => toggle(mod.number)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-fg/[0.02] sm:px-6"
                >
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${badgeClasses[mod.accent]}`}>
                    <Icon size={22} strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-medium uppercase tracking-label text-fg-subtle">Modul {mod.number}</span>
                    <span className="block font-display text-xl font-semibold tracking-[-0.015em] text-fg">{mod.name}</span>
                    <span className="mt-0.5 block text-sm text-fg-muted">
                      {mod.lessons.length} {mod.lessons.length === 1 ? "lektion" : "lektioner"} · {mod.minutes} min
                      {moduleDone > 0 && ` · ${moduleDone} av ${mod.lessons.length} lästa`}
                    </span>
                  </span>
                  <span className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-fg/[0.08] sm:block" aria-hidden>
                    <span
                      className="block h-full rounded-full bg-primary transition-[width] duration-500"
                      style={{ width: `${mod.lessons.length ? (moduleDone / mod.lessons.length) * 100 : 0}%` }}
                    />
                  </span>
                  <ChevronDown size={18} className={`shrink-0 text-fg-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                </button>
                {open && (
                  <ol className="border-t border-line">
                    {visible.map((lesson) => {
                      const index = mod.lessons.indexOf(lesson);
                      const isRead = read.has(lesson.slug);
                      return (
                        <li key={lesson.slug} className="border-b border-line last:border-0">
                          <Link
                            href={`/artiklar/${lesson.slug}`}
                            className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-fg/[0.025] sm:px-6"
                          >
                            {isRead ? (
                              <CheckCircle2 size={20} className="shrink-0 text-pine-700" aria-label="Läst" />
                            ) : (
                              <Circle size={20} className="shrink-0 text-ink-300" aria-label="Inte läst" />
                            )}
                            <span className="w-8 shrink-0 font-display text-sm font-semibold tabular-nums text-fg-subtle">
                              {mod.number}.{index + 1}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className={`block font-medium leading-snug ${isRead ? "text-fg-muted" : "text-fg"} group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4`}>
                                {lesson.title}
                              </span>
                              <span className="mt-0.5 line-clamp-1 hidden text-sm text-fg-muted sm:block">{lesson.excerpt}</span>
                            </span>
                            {isNew(lesson.date) && (
                              <span className="hidden rounded-full bg-lilac-100 px-2 py-0.5 text-[11px] font-semibold text-plum-800 sm:inline">Ny</span>
                            )}
                            <span className="flex shrink-0 items-center gap-1 text-sm tabular-nums text-fg-muted">
                              <Clock size={13} />
                              {readMinutes(lesson.readTime) || lesson.readTime} min
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </section>
            );
          })}
          {q && course.every((m) => m.lessons.filter(matches).length === 0) && (
            <p className="rounded-3xl bg-surface-sunken p-8 text-center text-fg-muted ring-1 ring-line">Inga lektioner matchar sökningen.</p>
          )}
        </div>
      </div>

      <aside className="order-1 lg:sticky lg:top-24 lg:order-2 lg:self-start">
        <div className="tone-pine rounded-3xl p-6">
          <p className="flex items-center gap-2 text-sm text-fg-muted">
            <GraduationCap size={16} className="text-highlight" />
            Er progress
          </p>
          <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.03em]">
            {percent}
            <span className="text-2xl text-fg-muted"> %</span>
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-fg/15" aria-hidden>
            <div className="h-full rounded-full bg-lilac-200 transition-[width] duration-700" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 text-sm text-fg-muted">
            {done} av {total} lektioner lästa
          </p>
          {nextLesson ? (
            <Link
              href={`/artiklar/${nextLesson.slug}`}
              className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-surface p-4 ring-1 ring-line transition-colors hover:bg-pine-700"
            >
              <span className="min-w-0">
                <span className="block text-xs text-fg-muted">{done === 0 ? "Börja här" : "Fortsätt där ni slutade"}</span>
                <span className="mt-0.5 line-clamp-2 block font-medium leading-snug">{nextLesson.title}</span>
              </span>
              <ArrowRight size={18} className="shrink-0" />
            </Link>
          ) : total > 0 ? (
            <p className="mt-6 rounded-2xl bg-surface p-4 text-sm ring-1 ring-line">Snyggt! Ni har läst alla lektioner.</p>
          ) : null}
          {done > 0 && (
            <button type="button" onClick={reset} className="mt-4 text-xs text-fg-muted underline underline-offset-4 hover:text-fg">
              Nollställ progress
            </button>
          )}
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-line text-center ring-1 ring-line">
          {[
            [course.length, "moduler"],
            [total, "lektioner"],
            [totalMinutes, "min"],
          ].map(([value, label]) => (
            <div key={label as string} className="bg-surface px-2 py-3">
              <dt className="sr-only">{label}</dt>
              <dd className="font-display text-xl font-semibold text-fg">{value}</dd>
              <dd className="text-xs text-fg-muted">{label}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 flex items-start gap-2 px-1 text-xs leading-relaxed text-fg-subtle">
          <BookOpen size={14} className={`mt-0.5 shrink-0 ${iconTextClasses.emerald}`} />
          Gratis och utan konto. Er progress sparas i den här webbläsaren.
        </p>
      </aside>
    </div>
  );
}
