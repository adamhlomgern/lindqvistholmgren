import { Building2, Clock, MapPin, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="flex flex-col items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                <stat.icon size={18} strokeWidth={2} />
              </span>
              <div>
                <p className="font-display text-3xl font-bold tracking-tight text-bone md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-stone">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
