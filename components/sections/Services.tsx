import Link from "next/link";
import { ArrowUpRight, ChevronRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/data/services";
import { getServiceAccent, iconTextClasses } from "@/lib/design/accents";
import { serviceIcons } from "@/lib/design/service-icons";

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
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = serviceIcons[service.slug];
            const accent = getServiceAccent(service.slug);
            return (
              <Link key={service.slug} href={`/tjanster/${service.slug}`} className="group block">
                <GlassCard accent={accent} className="justify-between">
                  <div>
                    <AccentBadge icon={Icon} accent={accent} size={22} />
                    <h3 className="mt-4 font-display text-lg font-bold text-bone">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone">
                      {service.description}
                    </p>
                  </div>
                  <ArrowUpRight
                    className={`mt-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${iconTextClasses[accent]}`}
                    size={18}
                  />
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
