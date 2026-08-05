import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Code2,
  LifeBuoy,
  Palette,
  Search,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { services } from "@/lib/data/services";
import { Process } from "@/components/sections/Process";
import { ValueProps } from "@/components/sections/ValueProps";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { CtaBanner } from "@/components/sections/CtaBanner";

const icons = {
  webb: Code2,
  seo: Search,
  design: Palette,
  tillvaxt: TrendingUp,
  automation: Zap,
  support: LifeBuoy,
} as const;

const accentBg = {
  webb: "bg-emerald/15 text-emerald",
  seo: "bg-moss/15 text-moss",
  design: "bg-peach/15 text-peach",
  tillvaxt: "bg-lavender/15 text-lavender",
  automation: "bg-coral/15 text-coral",
  support: "bg-stone/15 text-stone",
} as const;

const accentText = {
  webb: "text-emerald",
  seo: "text-moss",
  design: "text-peach",
  tillvaxt: "text-lavender",
  automation: "text-coral",
  support: "text-stone",
} as const;

export const metadata: Metadata = {
  title: "Tjänster",
  description:
    "Webb, SEO, design, tillväxt, automation och support för småföretag i Karlstad och hela Sverige. Se vad vi kan hjälpa er med.",
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
              const Icon = icons[service.slug as keyof typeof icons];
              return (
                <Link key={service.slug} href={`/tjanster/${service.slug}`} className="block">
                  <Card className="group flex h-full flex-col transition-colors hover:bg-bone/[0.08]">
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${accentBg[service.slug as keyof typeof accentBg]}`}
                      >
                        <Icon size={20} strokeWidth={2} />
                      </span>
                      <div>
                        <span
                          className={`font-display text-xs font-bold ${accentText[service.slug as keyof typeof accentText]}`}
                        >
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
                        <li key={feature} className="flex items-start gap-2 text-sm text-bone/90">
                          <Check
                            className="mt-0.5 shrink-0 text-emerald"
                            size={14}
                            strokeWidth={2.5}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-emerald transition-all group-hover:gap-2.5">
                      Utforska {service.title.toLowerCase()}
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </Card>
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
