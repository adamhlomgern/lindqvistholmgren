import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { services } from "@/lib/data/services";
import { getServiceAccent, iconTextClasses } from "@/lib/design/accents";
import { serviceIcons } from "@/lib/design/service-icons";
import { Process } from "@/components/sections/Process";
import { ValueProps } from "@/components/sections/ValueProps";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Tjänster",
  description:
    "Webb, SEO, design, tillväxt, automation och support för småföretag i Karlstad och hela Sverige. Se vad vi kan hjälpa er med.",
  alternates: {
    canonical: "/tjanster",
  },
};

export default function TjansterPage() {
  return (
    <>
      <PageHero
        icon={Sparkles}
        eyebrow="Våra tjänster"
        title="Allt ni behöver för att synas och växa digitalt"
        description="Från första skiss till lanserad hemsida — vi hjälper er med webb, SEO, design, tillväxt och automation, samlat hos två personer."
      />
      <Section tone="olive">
        <Container>
          <Eyebrow icon={Sparkles}>Sex tjänsteområden</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[0.95] tracking-tight text-bone md:text-4xl">
            Välj en tjänst, eller slå ihop flera
          </h2>
          <p className="mt-4 max-w-xl text-stone">
            Varje tjänst går bra att boka fristående, men de flesta kunder kombinerar
            två eller tre — från design till driftsatt automation.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {services.map((service, index) => {
              const Icon = serviceIcons[service.slug];
              const accent = getServiceAccent(service.slug);
              return (
                <Link key={service.slug} href={`/tjanster/${service.slug}`} className="group block">
                  <GlassCard accent={accent}>
                    <div className="flex items-center gap-4">
                      <AccentBadge icon={Icon} accent={accent} size={20} className="h-12 w-12" />
                      <div>
                        <span className={`font-display text-xs font-bold ${iconTextClasses[accent]}`}>
                          0{index + 1}
                        </span>
                        <h3 className="font-display text-xl font-bold text-bone">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-stone">
                      {service.description}
                    </p>
                    <ul className="mt-4 flex flex-col gap-2">
                      {service.features.slice(0, 3).map((feature) => (
                        <li key={feature.title} className="flex items-start gap-2 text-sm text-bone/90">
                          <Check
                            className={`mt-0.5 shrink-0 ${iconTextClasses[accent]}`}
                            size={14}
                            strokeWidth={2.5}
                          />
                          {feature.title}
                        </li>
                      ))}
                    </ul>
                    <span
                      className={`mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold transition-all group-hover:gap-2.5 ${iconTextClasses[accent]}`}
                    >
                      Utforska {service.titleLower ?? service.title.toLowerCase()}
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
      <ValueProps />
      <Process />
      <Testimonials />
      <Faq />
      <CtaBanner />
    </>
  );
}
