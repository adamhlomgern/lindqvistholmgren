import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
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
      <PageHero
        icon={Briefcase}
        eyebrow="Projekt"
        title="Ett urval av vad vi byggt"
        description="Riktiga projekt för riktiga företag — här är några exempel på hur vi hjälpt kunder synas och växa digitalt."
      />
      <Section tone="light" className="pt-4 md:pt-6">
        <Container>
          <ProjectIndex projects={projects} />
        </Container>
      </Section>
      <CtaBanner />
    </>
  );
}
