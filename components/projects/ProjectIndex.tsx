"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { CategoryPill } from "@/components/ui/CategoryPill";
import { ProjectResultBadge } from "@/components/projects/ProjectResultBadge";
import { accentForKey } from "@/lib/design/accents";
import type { Project } from "@/lib/types";

// Portfoliogalleri: filtrera på kategori, stora bilder och en rytm där vart
// tredje case tar hela bredden. Korten flyttar sig mjukt när filtret ändras.
export function ProjectIndex({ projects }: { projects: Project[] }) {
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    return [...counts.entries()];
  }, [projects]);
  const [active, setActive] = useState<string | null>(null);
  const visible = active ? projects.filter((p) => p.category === active) : projects;

  return (
    <div>
      {categories.length > 1 && (
        <div className="scrollbar-hide -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:flex-wrap md:px-0">
          {[{ name: null as string | null, count: projects.length }, ...categories.map(([name, count]) => ({ name, count }))].map(
            ({ name, count }) => {
              const selected = active === name;
              return (
                <button
                  key={name ?? "alla"}
                  type="button"
                  onClick={() => setActive(name)}
                  aria-pressed={selected}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selected ? "bg-fg text-canvas" : "bg-surface text-fg ring-1 ring-inset ring-line hover:ring-line-strong"
                  }`}
                >
                  {name ?? "Alla case"}
                  <span className={`text-xs tabular-nums ${selected ? "text-canvas/70" : "text-fg-subtle"}`}>{count}</span>
                </button>
              );
            },
          )}
        </div>
      )}

      <motion.div layout className="mt-10 grid gap-x-6 gap-y-14 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => {
            const wide = index % 3 === 0;
            const accent = accentForKey(project.category);
            return (
              <motion.article
                layout
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={wide ? "md:col-span-2" : ""}
              >
                <Link href={`/projekt/${project.slug}`} className="group block">
                  <div
                    className={`relative overflow-hidden rounded-3xl bg-surface-sunken ring-1 ring-line ${
                      wide ? "aspect-[16/10] md:aspect-[21/9]" : "aspect-[16/11]"
                    }`}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes={wide ? "(min-width: 768px) 1100px, 100vw" : "(min-width: 768px) 550px, 100vw"}
                      quality={90}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    {wide && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/85 via-ink-950/40 to-transparent p-6 pt-24 text-white sm:p-10 sm:pt-32">
                        <p className="text-sm text-white/75">
                          {project.category} · {project.industry} · {project.launch}
                        </p>
                        <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">{project.title}</h2>
                        <p className="mt-3 hidden max-w-xl text-white/85 sm:block">{project.summary}</p>
                      </div>
                    )}
                    <ProjectResultBadge project={project} className={`absolute left-4 ${wide ? "top-4" : "bottom-4"}`} />
                    <span className="absolute right-4 top-4 flex translate-y-1 items-center gap-1.5 rounded-full bg-surface/95 px-3.5 py-2 text-sm font-medium text-fg opacity-0 shadow-raised backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      Se caset
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                  {!wide && (
                  <div className="mt-5 flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                      <div>
                        <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-fg">
                          {project.title}
                        </h2>
                        <p className="mt-2 max-w-xl leading-relaxed text-fg-muted">{project.summary}</p>
                      </div>
                      <div className="flex items-center gap-2 pt-1.5">
                        <CategoryPill accent={accent}>{project.category}</CategoryPill>
                        <span className="text-sm text-fg-subtle">
                          {project.industry} · {project.launch}
                        </span>
                      </div>
                    </div>
                  )}
                </Link>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
