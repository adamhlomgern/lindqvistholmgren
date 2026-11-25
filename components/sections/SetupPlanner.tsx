"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight, CalendarClock, Check, ChevronRight, CreditCard, Globe, LayoutDashboard, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { paymentModels, webBuildOptions } from "@/lib/data/service-plans";

const buildIcons = { hemsida: Globe, webbshop: ShoppingBag, system: LayoutDashboard } as Record<string, typeof Globe>;
const paymentIcons = { engang: CreditCard, manad: CalendarClock };

function Option({
  selected,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: typeof Globe;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-2xl p-4 text-left transition-all duration-200 ${
        selected
          ? "bg-surface shadow-raised ring-2 ring-primary"
          : "bg-surface/60 ring-1 ring-line hover:bg-surface hover:ring-line-strong"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
          selected ? "bg-primary text-on-primary" : "bg-fg/[0.05] text-fg-muted"
        }`}
      >
        <Icon size={18} strokeWidth={2} />
      </span>
      <span>
        <span className="block font-display text-[17px] font-semibold tracking-[-0.01em] text-fg">{title}</span>
        <span className="mt-0.5 block text-sm text-fg-muted">{description}</span>
      </span>
    </button>
  );
}

// "Hitta ert upplägg" på webbtjänsten: två val (vad som ska byggas och hur
// man vill betala) ger ett konkret förslag med plattformar och länkar till
// rätt SEO-undersida, i stället för en lång lista med undersidor.
export function SetupPlanner({ tone = "light" }: { tone?: "light" | "subtle" }) {
  const [build, setBuild] = useState(webBuildOptions[0].key);
  const [payment, setPayment] = useState<"engang" | "manad">("engang");
  const option = webBuildOptions.find((o) => o.key === build) ?? webBuildOptions[0];
  const model = paymentModels.find((m) => m.key === payment) ?? paymentModels[0];

  return (
    <Section tone={tone}>
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-fg-muted">Hitta ert upplägg</p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-fg md:text-[2.5rem]">
            Två frågor, så ser ni hur vi skulle göra.
          </h2>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="space-y-8">
            <fieldset>
              <legend className="text-sm font-semibold text-fg">1. Vad ska vi bygga?</legend>
              <div className="mt-3 grid gap-2.5">
                {webBuildOptions.map((o) => (
                  <Option
                    key={o.key}
                    selected={o.key === build}
                    onClick={() => setBuild(o.key)}
                    icon={buildIcons[o.key] ?? Globe}
                    title={o.title}
                    description={o.description}
                  />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-semibold text-fg">2. Hur vill ni betala?</legend>
              <div className="mt-3 grid gap-2.5">
                {paymentModels.map((m) => (
                  <Option
                    key={m.key}
                    selected={m.key === payment}
                    onClick={() => setPayment(m.key)}
                    icon={paymentIcons[m.key]}
                    title={m.title}
                    description={m.short}
                  />
                ))}
              </div>
            </fieldset>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${build}-${payment}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="tone-pine rounded-3xl p-7 sm:p-9"
              >
                <p className="text-sm text-fg-muted">Ert upplägg</p>
                <p className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em]">
                  {option.title} <span className="text-highlight">· {model.title.toLowerCase()}</span>
                </p>

                <p className="mt-7 text-sm font-semibold">Så skulle vi bygga det</p>
                <ul className="mt-3 space-y-2.5">
                  {option.platforms.map((p) => (
                    <li key={p.name} className="rounded-2xl bg-surface p-4 ring-1 ring-line">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <p className="font-display text-[17px] font-semibold">{p.name}</p>
                        <Link
                          href={p.href}
                          className="inline-flex items-center gap-1 text-sm text-fg-muted underline decoration-fg/30 underline-offset-4 transition-colors hover:text-fg hover:decoration-fg"
                        >
                          {p.linkLabel}
                          <ArrowUpRight size={13} />
                        </Link>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-fg-muted">{p.why}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold">Det här ingår</p>
                    <ul className="mt-3 space-y-2">
                      {option.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm">
                          <Check size={15} strokeWidth={2.5} className="mt-0.5 shrink-0 text-highlight" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Så betalar ni</p>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted">{model.description}</p>
                  </div>
                </div>

                <div className="mt-8 border-t border-line pt-6">
                  <StartProjectButton trackingLocation={`upplagg-${build}-${payment}`}>
                    Få ett förslag på det här
                    <ChevronRight size={16} strokeWidth={2.5} />
                  </StartProjectButton>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Section>
  );
}
