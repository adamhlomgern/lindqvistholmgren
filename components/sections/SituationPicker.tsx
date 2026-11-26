"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import type { Situation } from "@/lib/data/service-plans";

// "Känner ni igen er?": välj den situation som stämmer, så får man ett kort
// svar och en länk till undersidan som handlar om just det.
export function SituationPicker({
  title,
  situations,
  tone = "light",
}: {
  title: string;
  situations: Situation[];
  tone?: "light" | "subtle";
}) {
  const [active, setActive] = useState(situations[0]?.key);
  const current = situations.find((s) => s.key === active) ?? situations[0];
  if (!current) return null;

  return (
    <Section tone={tone}>
      <Container>
        <p className="text-sm font-medium text-fg-muted">Känner ni igen er?</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-fg md:text-[2.5rem]">
          {title}
        </h2>
        <div className="mt-10 flex flex-wrap gap-2" role="tablist">
          {situations.map((s) => {
            const selected = s.key === current.key;
            return (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(s.key)}
                className={`rounded-full px-5 py-3 text-[15px] font-medium transition-all duration-200 ${
                  selected ? "bg-fg text-canvas shadow-raised" : "bg-surface text-fg ring-1 ring-inset ring-line hover:ring-line-strong"
                }`}
              >
                {s.title}
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex flex-col gap-6 rounded-3xl bg-surface-sunken p-7 ring-1 ring-line sm:p-9 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-xl">
              <p className="font-display text-2xl font-semibold tracking-[-0.02em] text-fg">{current.title}</p>
              <p className="mt-3 text-lg leading-relaxed text-fg-muted">{current.answer}</p>
              <Link
                href={current.href}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-fg"
              >
                {current.linkLabel}
                <ArrowUpRight size={15} />
              </Link>
            </div>
            <StartProjectButton trackingLocation={`situation-${current.key}`} className="shrink-0">
              Hjälp oss med det här
              <ChevronRight size={16} strokeWidth={2.5} />
            </StartProjectButton>
          </motion.div>
        </AnimatePresence>
      </Container>
    </Section>
  );
}
