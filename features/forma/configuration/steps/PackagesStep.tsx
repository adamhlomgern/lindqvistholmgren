"use client";

import { useState } from "react";
import { OptionCard } from "@/features/forma/components/OptionCard";
import { RecommendNotice } from "@/features/forma/components/RuleNotice";
import { fireplacePrice, flooringOptions, packageOptions } from "@/features/forma/data/options";
import { recommendRules } from "@/features/forma/rules/configurationRules";
import type { Configuration, PackageId } from "@/features/forma/types/configuration";

type PackagesStepProps = {
  configuration: Configuration;
  onChange: (patch: (config: Configuration) => Configuration) => void;
};

// VA is never user-selectable here — it's only ever added automatically by
// the require rule in BathroomStep, so it's excluded from this catalog.
const selectablePackages = packageOptions.filter((p) => p.id !== "va");
const winterRule = recommendRules.find((rule) => rule.id === "year-round-recommends-winter")!;

function togglePackage(configuration: Configuration, id: PackageId): Configuration {
  const packages = configuration.packages.includes(id)
    ? configuration.packages.filter((p) => p !== id)
    : [...configuration.packages, id];
  return { ...configuration, packages };
}

export function PackagesStep({ configuration, onChange }: PackagesStepProps) {
  const [dismissedWinterRecommendation, setDismissedWinterRecommendation] = useState(false);
  const showWinterRecommendation = !dismissedWinterRecommendation && winterRule.when(configuration);

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-label text-forma-text-faint">Golv</h3>
        <div className="flex flex-col gap-2">
          {flooringOptions.map((option) => (
            <OptionCard
              key={option.id}
              name={option.name}
              priceDelta={option.priceDelta}
              swatchColor={option.swatch}
              selected={configuration.interior.flooring === option.id}
              onSelect={() => onChange((c) => ({ ...c, interior: { ...c.interior, flooring: option.id } }))}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-label text-forma-text-faint">Övrigt</h3>
        <div className="flex flex-col gap-2">
          <OptionCard
            name="Kamin"
            priceDelta={fireplacePrice}
            selected={configuration.interior.fireplace}
            onSelect={() => onChange((c) => ({ ...c, interior: { ...c.interior, fireplace: !c.interior.fireplace } }))}
          />
          <OptionCard
            name="Året-runt-boende"
            description="Huset ska kunna användas som permanentbostad, inte bara sommartid."
            priceDelta={0}
            selected={configuration.yearRoundLiving}
            onSelect={() => onChange((c) => ({ ...c, yearRoundLiving: !c.yearRoundLiving }))}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-label text-forma-text-faint">Tekniska paket</h3>
        <div className="flex flex-col gap-2">
          {selectablePackages.map((pkg) => (
            <OptionCard
              key={pkg.id}
              name={pkg.name}
              description={pkg.description}
              priceDelta={pkg.priceDelta}
              selected={configuration.packages.includes(pkg.id)}
              onSelect={() => onChange((c) => togglePackage(c, pkg.id))}
            />
          ))}
        </div>
        {showWinterRecommendation && (
          <div className="mt-2.5">
            <RecommendNotice
              message={winterRule.message(configuration)}
              onAdd={() => onChange((c) => togglePackage(c, "winter"))}
              onDismiss={() => setDismissedWinterRecommendation(true)}
            />
          </div>
        )}
      </section>
    </div>
  );
}
