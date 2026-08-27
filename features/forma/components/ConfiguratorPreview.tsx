"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HouseIllustration } from "@/features/forma/components/HouseIllustration";
import { AnimatedPrice } from "@/features/forma/components/AnimatedPrice";
import { facadeOptions, roofOptions } from "@/features/forma/data/options";
import { getModel } from "@/features/forma/data/models";
import { formaRoutes } from "@/features/forma/config/product";
import type { FacadeId, RoofId } from "@/features/forma/types/configuration";

const previewModel = getModel("forma-25");

// A lightweight, self-contained teaser of the real configurator — not wired
// to FormaProvider/rules/pricing engine at all, just facade+roof against the
// one model's base price. Lets a landing-page visitor feel the "click a
// swatch, the house and price both update" interaction before committing to
// the full 8-step flow (see brief §8, "configurator-preview").
export function ConfiguratorPreview() {
  const [facade, setFacade] = useState<FacadeId>("natur");
  const [roof, setRoof] = useState<RoofId>("sadel");

  const facadeDelta = facadeOptions.find((f) => f.id === facade)?.priceDelta ?? 0;
  const roofDelta = roofOptions.find((r) => r.id === roof)?.priceDelta ?? 0;
  const total = previewModel.basePrice + facadeDelta + roofDelta;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
      <div className="flex h-96 items-end justify-center overflow-hidden rounded-[2rem] bg-gradient-to-b from-forma-surface to-forma-surface-hover sm:h-[32rem] lg:h-[42rem]">
        <HouseIllustration model={previewModel.id} facade={facade} roof={roof} windows="standard" className="h-full w-full p-2" />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-label text-forma-accent">Provkonfigurera</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-forma-text sm:text-4xl">Gör den till din.</h2>
        <p className="mt-4 max-w-sm text-forma-text-muted">
          Varje val uppdaterar huset och priset direkt — precis som i konfiguratorn.
        </p>

        <div className="mt-8">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-label text-forma-text-faint">Fasad</p>
          <div className="flex flex-wrap gap-2.5">
            {facadeOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                title={option.name}
                onClick={() => setFacade(option.id)}
                className={`h-9 w-9 rounded-full border-2 transition-all ${
                  facade === option.id ? "border-forma-accent scale-110" : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: option.swatch }}
              >
                <span className="sr-only">{option.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-label text-forma-text-faint">Tak</p>
          <div className="flex flex-wrap gap-2">
            {roofOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setRoof(option.id)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  roof === option.id
                    ? "border-forma-accent bg-forma-accent-soft text-forma-accent-soft-text"
                    : "border-forma-border text-forma-text-muted hover:border-forma-text-faint"
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-forma-border pt-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-label text-forma-text-faint">{previewModel.name}, uppskattat pris</p>
            <AnimatedPrice amount={total} className="text-2xl font-bold text-forma-text" />
          </div>
          <Link
            href={`${formaRoutes.configure()}?model=${previewModel.id}`}
            className="group flex items-center gap-1.5 text-sm font-semibold text-forma-accent"
          >
            Fortsätt i konfiguratorn
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
