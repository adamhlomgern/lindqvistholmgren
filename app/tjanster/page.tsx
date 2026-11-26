import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Process } from "@/components/sections/Process";
import { ServiceExplorer } from "@/components/sections/ServiceExplorer";
import { ValueProps } from "@/components/sections/ValueProps";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Tjänster",
  description:
    "Webb, affärssystem, SEO, design, tillväxt och support för småföretag i Karlstad och hela Sverige. Se vad vi kan hjälpa er med.",
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
        description="Från första skiss till lanserad hemsida och egna affärssystem — vi hjälper er med webb, system, SEO, design och tillväxt, samlat hos två personer."
      />
      <Section tone="olive">
        <Container>
          <Eyebrow icon={Sparkles}>Sex tjänsteområden</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-[1.05] tracking-[-0.025em] text-fg md:text-4xl">
            Välj en tjänst, eller slå ihop flera
          </h2>
          <p className="mt-4 max-w-xl text-fg-muted">
            Varje tjänst går bra att boka fristående, men de flesta kunder kombinerar
            två eller tre — från design till ett färdigt system i drift.
          </p>
          <div className="mt-12">
            <ServiceExplorer />
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
