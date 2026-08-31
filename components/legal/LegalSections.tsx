import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/ui/GlassCard";

export type LegalSection = {
  title: string;
  body: string[];
};

export function LegalSections({ sections }: { sections: LegalSection[] }) {
  return (
    <Section tone="olive">
      <Container>
        <div className="mx-auto max-w-3xl">
          <GlassCard accent="emerald">
            <div className="-m-6 divide-y divide-bone/10">
              {sections.map((section, index) => (
                <div key={section.title} className="px-6 py-6">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="w-6 shrink-0 font-display text-sm font-bold text-emerald sm:w-8">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-lg font-bold text-bone">{section.title}</h2>
                  </div>
                  <div className="mt-2 flex flex-col gap-3 pl-10 sm:pl-14">
                    {section.body.map((paragraph, i) => (
                      <p key={i} className="text-sm leading-relaxed text-stone">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </Container>
    </Section>
  );
}
