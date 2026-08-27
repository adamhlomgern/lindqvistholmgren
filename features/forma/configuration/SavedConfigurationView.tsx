"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useForma } from "@/features/forma/state/FormaProvider";
import { formaRoutes } from "@/features/forma/config/product";
import { ConfigurationSummary } from "@/features/forma/configuration/ConfigurationSummary";

export function SavedConfigurationView({ configurationId }: { configurationId: string }) {
  const { getConfiguration, quoteRequests } = useForma();
  const configuration = getConfiguration(configurationId);
  const existingRequest = Object.values(quoteRequests).find((request) => request.configurationId === configurationId);

  if (!configuration) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-forma text-xl font-bold text-forma-text">Konfigurationen kunde inte hittas</h1>
        <p className="mt-2 text-sm text-forma-text-muted">
          Den kan ha återställts tillsammans med resten av demot. Konfigurationer sparas bara under din session.
        </p>
        <Link href={formaRoutes.configure()} className="mt-6 inline-block text-sm font-semibold text-forma-accent">
          Börja en ny konfiguration
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:py-20">
      <p className="text-center text-xs font-semibold uppercase tracking-label text-forma-text-faint">Sparad konfiguration · {configurationId}</p>

      {existingRequest && (
        <div className="mt-4 rounded-lg border border-forma-border bg-forma-surface px-3.5 py-2.5 text-center text-sm text-forma-text-muted">
          En offertförfrågan för den här konfigurationen är redan skickad.
        </div>
      )}

      <div className="mt-6">
        <ConfigurationSummary configuration={configuration} showCta={!existingRequest} />
      </div>

      <Link
        href={formaRoutes.configure({ resume: configurationId })}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full border border-forma-border px-5 py-3 text-sm font-medium text-forma-text transition-colors hover:border-forma-text-faint print:hidden"
      >
        Fortsätt konfigurera <ArrowRight size={15} />
      </Link>
    </div>
  );
}
