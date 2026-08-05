import { Hero } from "@/components/sections/Hero";
import { LogoCarousel } from "@/components/sections/LogoCarousel";
import { Stats } from "@/components/sections/Stats";
import { Services } from "@/components/sections/Services";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { Faq } from "@/components/sections/Faq";
import { CtaBanner } from "@/components/sections/CtaBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoCarousel />
      <Stats />
      <Services />
      <FeaturedWork />
      <Process />
      <Testimonials />
      <AboutTeaser />
      <Faq />
      <CtaBanner />
    </>
  );
}
