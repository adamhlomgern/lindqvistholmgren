import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CountUp } from "@/components/motion/CountUp";
import { ProjectIndex } from "@/components/projects/ProjectIndex";
import { getProjects } from "@/lib/data/projects";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Projekt",
  description:
    "Ett urval av webbplatser, grafiska profiler och skräddarsydda lösningar vi byggt åt småföretag i Karlstad och Värmland.",
  alternates: {
    canonical: "/projekt",
  },
};

export const revalidate = 3600;

export default async function ProjektPage() {
  const projects = await getProjects();

  return (
    <>
      <Section tone="pine" className="pb-16 pt-14 md:pb-20 md:pt-20">
        <Container>
          <p className="text-sm font-medium text-fg-muted">Case</p>
          <div className="mt-3 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <h1 className="font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.035em] md:text-6xl">
                Det här har vi <span className="text-highlight">byggt.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
                Hemsidor, varumärken och system för företag i Värmland och resten av Sverige. Klicka på
                ett case för att se hur vi tänkte och vad det gav.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line ring-1 ring-line">
              <div className="bg-surface p-6">
                <p className="font-display text-4xl font-semibold tracking-[-0.04em]">
                  <CountUp to={projects.length} />
                </p>
                <p className="mt-1 text-sm text-fg-muted">case på sajten</p>
              </div>
              <div className="bg-surface p-6">
                <p className="font-display text-4xl font-semibold tracking-[-0.04em]">
                  <CountUp to={50} suffix="+" />
                </p>
                <p className="mt-1 text-sm text-fg-muted">företag vi hjälpt</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
      <Section tone="light">
        <Container>
          <ProjectIndex projects={projects} />
        </Container>
      </Section>
      <CtaBanner />
    </>
  );
}
