import type { Metadata } from "next";
import { ChevronRight, Rocket } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { Process } from "@/components/sections/Process";
import { Stats } from "@/components/sections/Stats";

export const metadata: Metadata = {
  title: "Starta ett projekt",
  description:
    "Redo att sätta igång? Berätta kort om ert projekt så återkommer vi inom 24 timmar med nästa steg.",
};

export default function StartaEttProjektPage() {
  return (
    <>
      <PageHero
        icon={Rocket}
        eyebrow="Starta ett projekt"
        title="Redo att sätta igång?"
        description="Svara på några korta frågor om vad ni behöver hjälp med, er budget och tidsram — det tar ett par minuter, och sen hör vi av oss inom 24 timmar."
      >
        <StartProjectButton>
          Starta ett projekt
          <ChevronRight size={16} strokeWidth={2.5} />
        </StartProjectButton>
      </PageHero>
      <Process />
      <Stats />
    </>
  );
}
