import { Building2, Clock, MapPin, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { accents } from "@/lib/design/accents";

const stats = [
  { icon: Building2, value: "50+", label: "Företag vi hjälpt" },
  { icon: Clock, value: "< 24h", label: "Svarstid på förfrågningar" },
  { icon: Sparkles, value: "100%", label: "Skräddarsytt, inga mallar" },
  { icon: MapPin, value: "Karlstad", label: "Bas i hjärtat av Värmland" },
];

export function Stats() {
  return (
    <Section tone="forest">
      <Container>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const accent = accents[index % accents.length];
            return (
              <GlassCard key={stat.label} accent={accent} className="items-start gap-4">
                <AccentBadge icon={stat.icon} accent={accent} />
                <div>
                  <p className="font-display text-3xl font-bold tracking-tight text-bone md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-stone">{stat.label}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
