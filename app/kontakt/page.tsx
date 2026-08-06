import type { Metadata } from "next";
import { ChevronRight, Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { badgeClasses } from "@/lib/design/accents";
import { ContactForm } from "@/components/sections/ContactForm";
import { StartProjectButton } from "@/components/contact/StartProjectButton";

export const metadata: Metadata = {
  title: "Kontakta oss",
  description:
    "Har ni ett projekt på gång? Hör av er till Lindqvist / Holmgren — vi svarar inom 24 timmar.",
};

const contactPoints = [
  {
    icon: Mail,
    title: "E-post",
    value: "info@lindqvistholmgren.se",
  },
  {
    icon: MapPin,
    title: "Plats",
    value: "Karlstad — kunder i hela Sverige",
  },
  {
    icon: Clock,
    title: "Svarstid",
    value: "Inom 24 timmar",
  },
];

export default function KontaktPage() {
  return (
    <>
      <PageHero
        icon={MessageCircle}
        eyebrow="Kontakt"
        title="Har ni ett projekt på gång?"
        description="Berätta kort vad ni behöver hjälp med, så hör vi av oss inom 24 timmar. Inget krångel, inga mellanhänder."
      >
        <StartProjectButton>
          Starta ett projekt
          <ChevronRight size={16} strokeWidth={2.5} />
        </StartProjectButton>
      </PageHero>
      <Section tone="olive">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="flex flex-col gap-4">
              <GlassCard accent="emerald">
                <span className={`flex h-14 w-14 items-center justify-center rounded-full font-display text-xl font-bold ${badgeClasses.emerald}`}>
                  A
                </span>
                <p className="mt-4 font-display text-lg font-bold text-bone">Prata med Ada</p>
                <p className="mt-2 text-sm leading-relaxed text-stone">
                  All kontakt går genom Ada, som håller ihop projektet från start till mål —
                  inga mellanhänder, inga väntetider.
                </p>
              </GlassCard>
              <GlassCard accent="emerald">
                <div className="-m-6 divide-y divide-bone/10">
                  {contactPoints.map((point) => (
                    <div key={point.title} className="flex items-center gap-4 px-6 py-4">
                      <AccentBadge icon={point.icon} accent="emerald" />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-label text-stone">
                          {point.title}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-bone">{point.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
            <ContactForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
