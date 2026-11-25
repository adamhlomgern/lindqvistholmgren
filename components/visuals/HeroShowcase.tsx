"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { DesignVisual, SystemVisual, WebVisual } from "@/components/visuals/ServiceVisual";

// Startsidans hero visar bredden direkt: system, hemsida och varumärke växlar
// av sig själva var femte sekund, och man kan också klicka på flikarna.
const slides = [
  { key: "system", label: "System", Visual: SystemVisual },
  { key: "webb", label: "Hemsida", Visual: WebVisual },
  { key: "design", label: "Varumärke", Visual: DesignVisual },
];

export function HeroShowcase() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [reduce, paused]);

  const { Visual, key } = slides[index];

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative">
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
      <div className="mt-4 flex justify-center gap-1.5" role="tablist" aria-label="Exempel på vad vi bygger">
        {slides.map((slide, i) => (
          <button
            key={slide.key}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className={`relative overflow-hidden rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              i === index ? "bg-fg text-canvas" : "text-fg-muted hover:bg-fg/[0.05] hover:text-fg"
            }`}
          >
            {slide.label}
          </button>
        ))}
      </div>
    </div>
  );
}
