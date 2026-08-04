import Image from "next/image";
import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { testimonials } from "@/lib/data/testimonials";

export function Testimonials() {
  return (
    <Section tone="forest">
      <Container>
        <Eyebrow icon={Quote}>Våra kunder</Eyebrow>
        <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[0.95] tracking-tight text-bone md:text-4xl">
          Långsiktiga samarbeten
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="flex flex-col justify-between">
              <p className="text-sm leading-relaxed text-bone">“{testimonial.quote}”</p>
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
                  <p className="text-sm font-semibold text-bone">{testimonial.name}</p>
                  <p className="text-xs text-stone">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
