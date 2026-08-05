import type { Metadata } from "next";
import { ChevronRight, Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
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
      <Section tone="olive" className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald/15 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-peach/10 blur-[100px]" />
        <Container className="relative">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="flex flex-col gap-4">
              <div className="rounded-3xl bg-gradient-to-br from-emerald/25 via-bone/10 to-transparent p-px">
                <div className="rounded-[calc(1.5rem-1px)] bg-charcoal/50 p-6 backdrop-blur-xl">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald/20 font-display text-xl font-bold text-emerald">
                    A
                  </span>
                  <p className="mt-4 font-display text-lg font-bold text-bone">Prata med Ada</p>
                  <p className="mt-2 text-sm leading-relaxed text-stone">
                    All kontakt går genom Ada, som håller ihop projektet från start till mål —
                    inga mellanhänder, inga väntetider.
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-3xl border border-bone/10 bg-bone/5">
                {contactPoints.map((point, index) => (
                  <div
                    key={point.title}
                    className={`flex items-center gap-4 px-6 py-4 ${
                      index !== 0 ? "border-t border-bone/10" : ""
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                      <point.icon size={18} strokeWidth={2} />
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-label text-stone">
                        {point.title}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-bone">{point.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <ContactForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
