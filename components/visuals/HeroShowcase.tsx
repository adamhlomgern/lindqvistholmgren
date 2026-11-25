"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Code2, LayoutDashboard, Palette, TrendingUp, type LucideIcon } from "lucide-react";
import { DesignVisual, GrowthVisual, SystemVisual, WebVisual } from "@/components/visuals/ServiceVisual";

// Heron på startsidan: taggarna (Webb, Design, System, Tillväxt) är också
// flikarna som styr illustrationen bredvid. De växlar av sig själva, en tunn
// linje under den aktiva taggen visar när nästa byte sker, och man kan klicka
// själv. Hover pausar.
const slides: { key: string; label: string; icon: LucideIcon; Visual: () => ReactNode }[] = [
  { key: "webb", label: "Webb", icon: Code2, Visual: WebVisual },
  { key: "design", label: "Design", icon: Palette, Visual: DesignVisual },
  { key: "system", label: "System", icon: LayoutDashboard, Visual: SystemVisual },
  { key: "tillvaxt", label: "Tillväxt", icon: TrendingUp, Visual: GrowthVisual },
];
const INTERVAL = 5;

type Ctx = { index: number; setIndex: (i: number) => void; paused: boolean; setPaused: (p: boolean) => void };
const ShowcaseContext = createContext<Ctx | null>(null);

function useShowcase() {
  const ctx = useContext(ShowcaseContext);
  if (!ctx) throw new Error("HeroTags/HeroShowcase must be inside HeroShowcaseProvider");
  return ctx;
}

export function HeroShowcaseProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % slides.length), INTERVAL * 1000);
    return () => clearTimeout(id);
  }, [reduce, paused, index]);

  return <ShowcaseContext.Provider value={{ index, setIndex, paused, setPaused }}>{children}</ShowcaseContext.Provider>;
}

export function HeroTags() {
  const { index, setIndex, paused, setPaused } = useShowcase();
  const reduce = useReducedMotion();
  return (
    <div
      role="tablist"
      aria-label="Det här bygger vi"
      className="inline-flex flex-wrap gap-1 rounded-full bg-surface p-1 shadow-card ring-1 ring-line"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <button
            key={slide.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setIndex(i)}
            className={`relative flex items-center gap-1.5 overflow-hidden rounded-full py-1.5 pl-2.5 pr-3.5 text-[13px] font-medium transition-colors duration-200 ${
              active ? "bg-fg text-canvas" : "text-fg-muted hover:bg-fg/[0.05] hover:text-fg"
            }`}
          >
            <slide.icon size={14} strokeWidth={2.25} className={active ? "text-lilac-200" : ""} />
            {slide.label}
            {active && !reduce && (
              <motion.span
                key={`${index}-${paused}`}
                aria-hidden
                className="absolute bottom-0 left-3 right-3 h-[2px] origin-left rounded-full bg-lilac-200/80"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: paused ? 0 : 1 }}
                transition={{ duration: paused ? 0.2 : INTERVAL, ease: "linear" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function HeroShowcase() {
  const { index, setPaused } = useShowcase();
  const { Visual, key } = slides[index];
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Visual />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
