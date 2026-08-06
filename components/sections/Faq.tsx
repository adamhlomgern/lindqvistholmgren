"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassCard } from "@/components/ui/GlassCard";

const defaultFaqs = [
  {
    question: "Vad kostar ett projekt?",
    answer:
      "Det beror helt på omfattning och behov — varje projekt är skräddarsytt. Hör av er så tar vi fram en tydlig offert innan något påbörjas.",
  },
  {
    question: "Hur lång tid tar det?",
    answer:
      "Allt från några veckor till några månader beroende på storlek och komplexitet. Ni får en tydlig tidsplan redan i uppstarten.",
  },
  {
    question: "Måste jag veta exakt vad jag vill ha innan jag hör av mig?",
    answer:
      "Nej. Vi hjälper er reda ut behov och mål tillsammans — ni behöver bara berätta vad ni vill uppnå.",
  },
  {
    question: "Vem pratar jag med under projektet?",
    answer:
      "All kontakt sker främst med Ada, som håller ihop projektet från start till mål. Inga projektledare eller mellanhänder i vägen.",
  },
  {
    question: "Hjälper ni till efter lansering också?",
    answer:
      "Ja, vi finns kvar som stöd för underhåll, uppdateringar och vidareutveckling när ni behöver det.",
  },
  {
    question: "Vilka verktyg och plattformar bygger ni på?",
    answer:
      "Det varierar från projekt till projekt — vi väljer den lösning som passar era behov och budget bäst, snarare än att pressa in alla i samma mall.",
  },
  {
    question: "Jag har redan en sajt eller logga, kan ni bygga vidare på det?",
    answer:
      "Absolut. Har ni redan något på plats utgår vi gärna från det istället för att börja om helt från noll.",
  },
  {
    question: "Tar ni bara kunder i Karlstad och Värmland?",
    answer:
      "Nej, Karlstad är vår bas men vi jobbar med kunder i hela Sverige på distans.",
  },
];

type FaqProps = {
  items?: { question: string; answer: string }[];
  eyebrow?: string;
  title?: string;
  tone?: "forest" | "charcoal" | "olive";
};

export function Faq({
  items = defaultFaqs,
  eyebrow = "Vanliga frågor",
  title = "Bra att veta innan ni hör av er",
  tone = "olive",
}: FaqProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section tone={tone}>
      <Container>
        <Eyebrow icon={HelpCircle}>{eyebrow}</Eyebrow>
        <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[0.95] tracking-tight text-bone md:text-4xl">
          {title}
        </h2>
        <div className="mt-8">
          <GlassCard accent="emerald">
            <div className="-m-6 divide-y divide-bone/10">
              {items.map((faq, index) => {
                const isOpen = open === index;
                return (
                  <div key={faq.question}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-3.5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold text-bone">{faq.question}</span>
                      <ChevronDown
                        size={16}
                        className={`shrink-0 text-emerald transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-3.5 text-sm leading-relaxed text-stone">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </Container>
    </Section>
  );
}
