import Image from "next/image";
import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassCard } from "@/components/ui/GlassCard";
import { accents } from "@/lib/design/accents";
import { testimonials } from "@/lib/data/testimonials";

export function Testimonials() {
  return (
    <Section tone="forest">
      <Container>
        <Eyebrow icon={Quote}>Våra kunder</Eyebrow>
        <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-[1.05] tracking-[-0.025em] text-fg md:text-4xl">
          Långsiktiga samarbeten
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const accent = accents[index % accents.length];
            return (
              <GlassCard key={testimonial.name} accent={accent} className="justify-between">
                <p className="text-[15px] leading-relaxed text-fg">“{testimonial.quote}”</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-fg">{testimonial.name}</p>
                    <p className="text-xs text-fg-muted">{testimonial.role}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
