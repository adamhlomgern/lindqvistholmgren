"use client";

import { useState } from "react";
import { HouseIllustration } from "@/features/forma/components/HouseIllustration";
import { getModel } from "@/features/forma/data/models";
import { getLayout } from "@/features/forma/data/layouts";
import { facadeOptions, flooringOptions, getPackage, kitchenOptions, roofOptions, windowOptions } from "@/features/forma/data/options";
import { calculatePrice } from "@/features/forma/pricing/calculatePrice";
import { formatPriceRange } from "@/features/forma/utils/format";
import { QuoteRequestModal } from "@/features/forma/components/QuoteRequestModal";
import type { Configuration } from "@/features/forma/types/configuration";

function nameOf<T extends { id: string; name: string }>(list: T[], id: string): string {
  return list.find((o) => o.id === id)?.name ?? id;
}

export function ConfigurationSummary({ configuration, showCta = true }: { configuration: Configuration; showCta?: boolean }) {
  const [modalOpen, setModalOpen] = useState(false);
  const model = getModel(configuration.model);
  const price = calculatePrice(configuration);
  const layout = getLayout(configuration.layout);

  const specs: { label: string; value: string }[] = [
    { label: "Modell", value: `${model.name} (${model.sizeSqm} m²)` },
    { label: "Fasad", value: nameOf(facadeOptions, configuration.exterior.facade) },
    { label: "Tak", value: nameOf(roofOptions, configuration.exterior.roof) },
    { label: "Fönster", value: nameOf(windowOptions, configuration.exterior.windows) },
    { label: "Planlösning", value: layout.name },
    { label: "Kök", value: nameOf(kitchenOptions, configuration.interior.kitchen) },
    { label: "Badrum", value: configuration.interior.bathroom ? "Ja" : "Nej" },
  ];
  if (configuration.interior.flooring) specs.push({ label: "Golv", value: nameOf(flooringOptions, configuration.interior.flooring) });
  if (configuration.interior.fireplace) specs.push({ label: "Kamin", value: "Ja" });
  if (configuration.packages.length > 0) {
    specs.push({ label: "Tillval", value: configuration.packages.map((p) => getPackage(p).name).join(", ") });
  }
  if (configuration.site.municipality) specs.push({ label: "Ort", value: configuration.site.municipality });

  return (
    <div id="print-summary" className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-2xl border border-forma-border bg-gradient-to-b from-forma-surface to-forma-surface-hover shadow-sm">
        <HouseIllustration
          model={configuration.model}
          facade={configuration.exterior.facade}
          roof={configuration.exterior.roof}
          windows={configuration.exterior.windows}
          className="h-56 w-full p-4"
        />
      </div>

      <div>
        <h2 className="font-forma text-xl font-bold text-forma-text">Ditt hus</h2>
        <dl className="mt-3 divide-y divide-forma-border text-sm">
          {specs.map((spec) => (
            <div key={spec.label} className="flex items-center justify-between py-2">
              <dt className="text-forma-text-muted">{spec.label}</dt>
              <dd className="font-medium text-forma-text">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rounded-xl bg-forma-accent-soft px-4 py-3.5">
        <p className="text-xs font-semibold uppercase tracking-label text-forma-accent-soft-text">Uppskattat pris</p>
        <p className="mt-1 font-forma text-2xl font-bold text-forma-accent-soft-text">
          {formatPriceRange(price.rangeLow, price.rangeHigh)}
        </p>
        <p className="mt-2 text-xs text-forma-accent-soft-text/80">
          Slutligt pris beror bland annat på markarbete, transport och tomtens förutsättningar.
        </p>
      </div>

      {showCta && (
        <>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full rounded-full bg-forma-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-forma-accent/25 transition-colors hover:bg-forma-accent-hover"
          >
            Få en exakt offert
          </button>
          {modalOpen && <QuoteRequestModal configuration={configuration} onClose={() => setModalOpen(false)} />}
        </>
      )}
    </div>
  );
}
