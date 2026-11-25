import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { LogoCarousel } from "@/components/sections/LogoCarousel";
import { Services } from "@/components/sections/Services";
import { SystemsShowcase } from "@/components/sections/SystemsShowcase";
import { CaseSpotlight } from "@/components/sections/CaseSpotlight";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { Faq } from "@/components/sections/Faq";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <LogoCarousel />
      <Services />
      <SystemsShowcase />
      <CaseSpotlight title="Ett urval av vad vi byggt" />
      <Testimonials tone="subtle" />
      <Process tone="light" />
      <AboutTeaser />
      <Faq />
      <CtaBanner />
    </>
  );
}
