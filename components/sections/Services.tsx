import Link from "next/link";
import { ArrowUpRight, ChevronRight, Code2, Palette, Sparkles, TrendingUp, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/data/services";

const icons = {
  webb: Code2,
  design: Palette,
  marknadsforing: TrendingUp,
  utveckling: Wrench,
} as const;

export function Services() {
  return (
    <Section tone="olive">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow icon={Sparkles}>Våra tjänster</Eyebrow>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[0.95] tracking-tight text-bone md:text-4xl">
              Allt ni behöver för att synas och växa digitalt
            </h2>
          </div>
          <Button href="/tjanster" variant="secondary" className="shrink-0">
            Se alla tjänster
            <ChevronRight size={16} strokeWidth={2.5} />
          </Button>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = icons[service.slug as keyof typeof icons];
            return (
              <Link key={service.slug} href={`/tjanster/${service.slug}`} className="block">
                <Card className="group flex h-full flex-col justify-between transition-colors hover:bg-bone/[0.08]">
                  <div>
                    <Icon className="text-emerald" size={22} strokeWidth={2} />
                    <h3 className="mt-4 font-display text-lg font-bold text-bone">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone">
                      {service.description}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="mt-6 text-emerald transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    size={18}
                  />
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
