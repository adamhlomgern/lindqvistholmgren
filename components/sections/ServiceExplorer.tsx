"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { ServiceVisual } from "@/components/visuals/ServiceVisual";
import { services } from "@/lib/data/services";
import { serviceIcons } from "@/lib/design/service-icons";
import { badgeClasses, getServiceAccent } from "@/lib/design/accents";

// Interaktiv tjänsteöversikt: hovra en tjänst i listan, så byts den kodade
// illustrationen och de viktigaste punkterna till höger; hela raden är en
// länk till tjänstesidan. På mobil (utan hover) visas bara listan. Ersätter sex
// likadana kort och visar samtidigt vad vi kan bygga.
export function ServiceExplorer() {
  const [active, setActive] = useState(services[0]?.slug ?? "webb");
  const current = services.find((s) => s.slug === active) ?? services[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
      <nav aria-label="Tjänster" className="flex flex-col">
        {services.map((service, index) => {
          const Icon = serviceIcons[service.slug];
          const selected = service.slug === active;
          return (
            <Link
              key={service.slug}
              href={`/tjanster/${service.slug}`}
              aria-current={selected ? "true" : undefined}
              onMouseEnter={() => setActive(service.slug)}
              onFocus={() => setActive(service.slug)}
              className={`group relative flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition-colors sm:px-5 ${
                selected ? "bg-surface shadow-card ring-1 ring-line" : "hover:bg-fg/[0.03]"
              }`}
            >
              <span className="w-6 font-display text-sm font-semibold tabular-nums text-fg-subtle">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 ${
                  selected ? `${badgeClasses[getServiceAccent(service.slug)]} scale-105` : "bg-fg/[0.05] text-fg-muted"
                }`}
              >
                <Icon size={18} strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block font-display text-lg font-semibold tracking-[-0.015em] sm:text-xl ${selected ? "text-fg" : "text-fg-muted group-hover:text-fg"}`}>
                  {service.title}
                </span>
                <span className={`block text-sm text-fg-muted ${selected ? "" : "hidden sm:block"}`}>
                  {service.description}
                </span>
              </span>
              <ArrowUpRight
                size={18}
                className={`shrink-0 transition-all duration-200 ${selected ? "translate-x-0 text-fg opacity-100" : "-translate-x-1 opacity-0"}`}
              />
            </Link>
          );
        })}
      </nav>

      <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <ServiceVisual slug={current.slug} />
            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <ul className="space-y-2">
                {current.features.slice(0, 3).map((feature) => (
                  <li key={feature.title} className="flex items-start gap-2 text-[15px] text-fg">
                    <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-check" />
                    {feature.title}
                  </li>
                ))}
              </ul>
              <Link
                href={`/tjanster/${current.slug}`}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-canvas transition-colors hover:bg-ink-800"
              >
                Utforska {current.titleLower ?? current.title.toLowerCase()}
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
