"use client";

import { useState, useSyncExternalStore } from "react";
import { Gauge, LayoutTemplate, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SiteAudit } from "@/components/tools/SiteAudit";
import { SiteBuilder } from "@/components/tools/SiteBuilder";

type ToolId = "kollen" | "byggaren";

const tools: Record<ToolId, { icon: LucideIcon; name: string; tagline: string; title: string; text: string }> = {
  kollen: {
    icon: Gauge,
    name: "Hemsidekollen",
    tagline: "Hur bra är er sajt?",
    title: "Hur mår er hemsida?",
    text: "Skriv in adressen så går vi igenom ett 40-tal saker och låter Google mäta sajten i en mobil. Ni får betyg, en åtgärdsplan och konkreta steg att fixa.",
  },
  byggaren: {
    icon: LayoutTemplate,
    name: "Sajtbyggaren",
    tagline: "Se er nya sajt direkt",
    title: "Hur kan er nya sajt se ut?",
    text: "Välj bransch, namn, färg och stil och se en skiss av sajten byggas medan ni klickar. Gillar ni den bygger vi den på riktigt.",
  },
};

// "Våra verktyg": Hemsidekollen och Sajtbyggaren bakom två flikar. Används på
// startsidan, /verktyg och tjänstesidorna. `only` visar bara ett verktyg.
export function ToolsShowcase({
  tone = "subtle",
  initial = "kollen",
  only,
  eyebrow = "Gratis verktyg",
}: {
  tone?: "light" | "subtle";
  initial?: ToolId;
  only?: ToolId;
  eyebrow?: string;
}) {
  // En delad skiss (?bransch=…) öppnar Sajtbyggaren-fliken direkt.
  const sharedSketch = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).has("bransch"),
    () => false,
  );
  const [chosen, setChosen] = useState<ToolId | null>(null);
  const active: ToolId = only ?? chosen ?? (sharedSketch ? "byggaren" : initial);
  const setActive = setChosen;
  const tool = tools[active];

  return (
    <Section tone={tone} id="verktyg">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-medium text-fg-muted">{eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-fg md:text-5xl">
              {tool.title}
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-fg-muted">{tool.text}</p>
        </div>

        {!only && (
          <div role="tablist" aria-label="Verktyg" className="mt-10 grid gap-2 sm:inline-grid sm:grid-cols-2">
            {(Object.keys(tools) as ToolId[]).map((id) => {
              const t = tools[id];
              const selected = id === active;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(id)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all ${
                    selected ? "bg-surface shadow-raised ring-1 ring-line" : "ring-1 ring-inset ring-line hover:bg-surface/60"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      selected ? "bg-primary text-on-primary" : "bg-fg/[0.06] text-fg-muted"
                    }`}
                  >
                    <t.icon size={19} />
                  </span>
                  <span>
                    <span className="block font-medium text-fg">{t.name}</span>
                    <span className="block text-sm text-fg-muted">{t.tagline}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className={only ? "mt-10" : "mt-8"} role={only ? undefined : "tabpanel"}>
          {/* Båda hålls monterade så att ifyllda val inte försvinner när man byter flik. */}
          {only !== "byggaren" && (
            <div hidden={active !== "kollen"}>
              <SiteAudit />
            </div>
          )}
          {only !== "kollen" && (
            <div hidden={active !== "byggaren"}>
              <SiteBuilder />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
