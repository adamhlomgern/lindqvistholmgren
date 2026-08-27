"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Download, Link as LinkIcon } from "lucide-react";
import { useForma } from "@/features/forma/state/FormaProvider";
import { formaRoutes } from "@/features/forma/config/product";
import { ConfigurationSummary } from "@/features/forma/configuration/ConfigurationSummary";

export function SuccessView({ quoteRequestId }: { quoteRequestId: string }) {
  const { getQuoteRequest, getConfiguration } = useForma();
  const [linkCopied, setLinkCopied] = useState(false);

  const quoteRequest = getQuoteRequest(quoteRequestId);
  const configuration = quoteRequest ? getConfiguration(quoteRequest.configurationId) : undefined;

  if (!quoteRequest || !configuration) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-forma text-xl font-bold text-forma-text">Vi hittade inte den förfrågan</h1>
        <p className="mt-2 text-sm text-forma-text-muted">Den kan ha försvunnit vid en återställning av demot.</p>
        <Link href={formaRoutes.home()} className="mt-6 inline-block text-sm font-semibold text-forma-accent">
          Till Forma
        </Link>
      </div>
    );
  }

  async function copyConfigurationLink() {
    const url = `${window.location.origin}${formaRoutes.configuration(quoteRequest!.configurationId)}`;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable (permissions, non-secure context) — demo
      // has no fallback UI beyond leaving the button in its normal state.
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:py-20">
      <div className="text-center">
        <CheckCircle2 size={40} className="mx-auto text-forma-accent" />
        <h1 className="mt-4 font-forma text-2xl font-bold text-forma-text sm:text-3xl">Din förfrågan är skickad</h1>
        <p className="mt-2 text-sm text-forma-text-muted">Vi återkommer normalt inom en arbetsdag.</p>
      </div>

      <div className="mt-8">
        <ConfigurationSummary configuration={configuration} showCta={false} />
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-forma-border px-4 py-2.5 text-sm font-medium text-forma-text transition-colors hover:border-forma-text-faint"
        >
          <Download size={15} /> Ladda ner sammanställning
        </button>
        <button
          type="button"
          onClick={copyConfigurationLink}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-forma-border px-4 py-2.5 text-sm font-medium text-forma-text transition-colors hover:border-forma-text-faint"
        >
          <LinkIcon size={15} /> {linkCopied ? "Länk kopierad!" : "Kopiera länk till konfiguration"}
        </button>
      </div>
    </div>
  );
}
