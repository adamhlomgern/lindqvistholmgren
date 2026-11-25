import Image from "next/image";
import { ChevronRight, Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { testimonials } from "@/lib/data/testimonials";
import type { Testimonial } from "@/lib/types";

function Person({ testimonial, size = 40 }: { testimonial: Testimonial; size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0 overflow-hidden rounded-full" style={{ width: size, height: size }}>
        <Image src={testimonial.avatar} alt={testimonial.name} fill sizes={`${size}px`} className="object-cover" />
      </div>
      <div>
        <p className="text-sm font-semibold text-fg">{testimonial.name}</p>
        <p className="text-[13px] text-fg-muted">{testimonial.role}</p>
      </div>
    </div>
  );
}

// Ett stort citat som fångar blicken, två mindre bredvid, och en knapp direkt
// efter — det är just efter socialt bevis som många är redo att höra av sig.
export function Testimonials({ tone = "light" }: { tone?: "light" | "subtle" }) {
  const [featured, ...rest] = testimonials;

  return (
    <Section tone={tone}>
      <Container>
        <Eyebrow icon={Quote}>Våra kunder</Eyebrow>
        <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-[1.05] tracking-[-0.025em] text-fg md:text-4xl">
          Vad kunderna säger
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {featured && (
            <figure className="tone-lilac flex flex-col justify-between gap-10 rounded-3xl p-8 sm:p-10 md:col-span-2 md:row-span-2">
              <Quote size={32} strokeWidth={2} className="text-highlight" aria-hidden />
              <blockquote className="font-display text-2xl font-medium leading-snug tracking-[-0.02em] text-fg md:text-[2rem]">
                “{featured.quote}”
              </blockquote>
              <figcaption>
                <Person testimonial={featured} size={48} />
              </figcaption>
            </figure>
          )}
          {rest.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex flex-col justify-between gap-6 rounded-3xl bg-surface p-7 shadow-card ring-1 ring-line"
            >
              <blockquote className="text-[15px] leading-relaxed text-fg">“{testimonial.quote}”</blockquote>
              <figcaption>
                <Person testimonial={testimonial} />
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg font-semibold tracking-[-0.01em] text-fg">
            Nyfikna på vad vi kan göra för er? <span className="text-fg-muted">Hör av er.</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <StartProjectButton trackingLocation="kundcitat">
              Få ett förslag
              <ChevronRight size={16} strokeWidth={2.5} />
            </StartProjectButton>
            <Button href="/projekt" variant="secondary">
              Se casen
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
