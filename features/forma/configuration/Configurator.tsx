"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { HouseIllustration } from "@/features/forma/components/HouseIllustration";
import { AnimatedPrice } from "@/features/forma/components/AnimatedPrice";
import { ProgressSteps } from "@/features/forma/components/ProgressSteps";
import { IncompatibleNotice } from "@/features/forma/components/RuleNotice";
import { ModelStep } from "@/features/forma/configuration/steps/ModelStep";
import { ExteriorStep } from "@/features/forma/configuration/steps/ExteriorStep";
import { LayoutStep } from "@/features/forma/configuration/steps/LayoutStep";
import { KitchenStep } from "@/features/forma/configuration/steps/KitchenStep";
import { BathroomStep } from "@/features/forma/configuration/steps/BathroomStep";
import { PackagesStep } from "@/features/forma/configuration/steps/PackagesStep";
import { SiteStep } from "@/features/forma/configuration/steps/SiteStep";
import { ConfigurationSummary } from "@/features/forma/configuration/ConfigurationSummary";
import { models } from "@/features/forma/data/models";
import { createDraftConfiguration } from "@/features/forma/data/seed";
import { calculatePrice } from "@/features/forma/pricing/calculatePrice";
import { applyRequiredAdds, evaluateRules } from "@/features/forma/rules/configurationRules";
import { useForma } from "@/features/forma/state/FormaProvider";
import { useQueryParam } from "@/features/forma/utils/useQueryParam";
import type { Configuration, ModelId } from "@/features/forma/types/configuration";

const STEP_TITLES = ["Modell", "Exteriör", "Planlösning", "Kök", "Badrum", "Tillval", "Tomt"];
const SUMMARY_STEP = STEP_TITLES.length; // 7

function isModelId(value: string | null): value is ModelId {
  return value !== null && models.some((m) => m.id === value);
}

export function Configurator() {
  const { getConfiguration } = useForma();
  const resumeId = useQueryParam("resume");
  const modelParam = useQueryParam("model");

  const [configuration, setConfiguration] = useState<Configuration>(() => {
    if (resumeId) {
      const saved = getConfiguration(resumeId);
      if (saved) return saved;
    }
    return createDraftConfiguration(isModelId(modelParam) ? modelParam : "forma-25");
  });
  const [stepIndex, setStepIndex] = useState(0);

  function updateConfiguration(updater: (config: Configuration) => Configuration) {
    setConfiguration((prev) => applyRequiredAdds({ ...updater(prev), updatedAt: new Date().toISOString() }));
  }

  const price = useMemo(() => calculatePrice(configuration), [configuration]);
  const evaluation = useMemo(() => evaluateRules(configuration), [configuration]);
  const blocked = evaluation.incompatibilities.length > 0;

  function goNext() {
    if (blocked) return;
    setStepIndex((i) => Math.min(i + 1, SUMMARY_STEP));
  }
  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  if (stepIndex === SUMMARY_STEP) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 sm:py-16">
        <ProgressSteps current={stepIndex} />
        <button
          type="button"
          onClick={goBack}
          className="mt-5 mb-6 flex items-center gap-1.5 text-sm font-medium text-forma-text-muted hover:text-forma-text"
        >
          <ArrowLeft size={15} /> Ändra val
        </button>
        <ConfigurationSummary configuration={configuration} />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1400px] gap-6 px-4 pb-28 pt-6 sm:px-6 lg:grid-cols-[1fr_420px] lg:items-start lg:gap-10 lg:px-10 lg:pb-10 lg:pt-10">
      <div className="flex h-64 items-center justify-center rounded-2xl border border-forma-border bg-gradient-to-b from-forma-surface to-forma-surface-hover shadow-sm lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
        <HouseIllustration
          model={configuration.model}
          facade={configuration.exterior.facade}
          roof={configuration.exterior.roof}
          windows={configuration.exterior.windows}
          className="h-full w-full p-10"
        />
      </div>

      <div className="flex flex-col gap-5">
        <ProgressSteps current={stepIndex} />

        {evaluation.incompatibilities.map(({ rule, message, resolutions }) => (
          <IncompatibleNotice
            key={rule.id}
            message={message}
            resolutions={resolutions.map((resolution) => ({
              label: resolution.label,
              onClick: () => updateConfiguration((c) => resolution.apply(c)),
            }))}
          />
        ))}

        <h2 className="font-forma text-xl font-bold text-forma-text">{STEP_TITLES[stepIndex]}</h2>

        <div className="flex-1">
          {stepIndex === 0 && <ModelStep configuration={configuration} onChange={updateConfiguration} />}
          {stepIndex === 1 && <ExteriorStep configuration={configuration} onChange={updateConfiguration} />}
          {stepIndex === 2 && <LayoutStep configuration={configuration} onChange={updateConfiguration} />}
          {stepIndex === 3 && <KitchenStep configuration={configuration} onChange={updateConfiguration} />}
          {stepIndex === 4 && <BathroomStep configuration={configuration} onChange={updateConfiguration} />}
          {stepIndex === 5 && <PackagesStep configuration={configuration} onChange={updateConfiguration} />}
          {stepIndex === 6 && <SiteStep configuration={configuration} onChange={updateConfiguration} />}
        </div>

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-forma-border bg-forma-surface px-4 py-3 shadow-[0_-4px_24px_rgba(23,23,20,0.06)] lg:static lg:z-auto lg:rounded-2xl lg:border lg:px-5 lg:py-4 lg:shadow-sm">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 lg:mx-0 lg:max-w-none">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-label text-forma-text-faint">Beräknat pris</p>
              <AnimatedPrice amount={price.total} className="font-forma text-lg font-bold text-forma-text" />
            </div>
            <div className="flex items-center gap-2">
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="hidden items-center gap-1 rounded-full border border-forma-border px-4 py-2.5 text-sm font-medium text-forma-text-muted hover:text-forma-text sm:flex"
                >
                  <ArrowLeft size={15} /> Tillbaka
                </button>
              )}
              <button
                type="button"
                onClick={goNext}
                disabled={blocked}
                className="flex items-center gap-1.5 rounded-full bg-forma-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-forma-accent/25 transition-colors hover:bg-forma-accent-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                Fortsätt <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
