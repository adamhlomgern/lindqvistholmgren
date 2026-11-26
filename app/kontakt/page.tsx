import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CtaReassurance } from "@/components/ui/CtaReassurance";
import { ContactForm } from "@/components/sections/ContactForm";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { Reveal } from "@/components/motion/Reveal";
import { contactInfo, paymentInfo } from "@/lib/data/site-info";
import { testimonials } from "@/lib/data/testimonials";

export const metadata: Metadata = {
  title: "Kontakta oss",
  description:
    "Har ni ett projekt på gång? Hör av er till Lindqvist / Holmgren — vi svarar inom 24 timmar.",
  alternates: {
    canonical: "/kontakt",
  },
};

const team = [
  { name: "Ada", avatar: "/images/lindqvist-holmgren/ada-avatar-done.png", tint: "bg-lilac-200" },
  { name: "Malin", avatar: "/images/lindqvist-holmgren/malin-avataar-done.png", tint: "bg-amber-100" },
];

const nextSteps = [
  { title: "Ni skickar ett meddelande", description: "Några rader räcker. Ni behöver inte veta exakt vad ni vill ha." },
  { title: "Vi hör av oss inom 24 timmar", description: "Ada eller Malin svarar själva, med frågor eller ett förslag på samtal." },
  { title: "Ni får ett förslag och en offert", description: "Tydligt upplägg och pris. Inget påbörjas innan ni har sagt ja." },
];

// Kontaktsidan är sajtens viktigaste sida för konvertering: vilka man pratar
// med, vad som händer efter att man skickat, formuläret direkt i första vyn
// och alternativa vägar (mejl, WhatsApp, den guidade förfrågan).
export default function KontaktPage() {
  const quote = testimonials[0];

  return (
    <Section tone="light" className="pb-20 pt-12 md:pb-28 md:pt-16">
      <Container>
        <Breadcrumbs items={[{ label: "Hem", href: "/" }, { label: "Kontakt" }]} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-x-16 lg:gap-y-0">
          <div className="lg:col-start-1 lg:row-start-1">
            <div className="flex items-center gap-3">
              <div className="flex">
                {team.map((person, i) => (
                  <span
                    key={person.name}
                    className={`relative h-14 w-14 overflow-hidden rounded-full ring-4 ring-canvas ${person.tint} ${i > 0 ? "-ml-3" : ""}`}
                  >
                    <Image src={person.avatar} alt={person.name} fill sizes="56px" className="object-cover object-top" />
                  </span>
                ))}
              </div>
              <p className="text-sm text-fg-muted">
                <span className="font-medium text-fg">Ada &amp; Malin</span> läser varje meddelande själva
              </p>
            </div>
            <h1 className="mt-8 font-display text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.035em] text-fg md:text-6xl">
              Berätta om ert projekt. <span className="text-fg-subtle">Vi svarar inom 24 timmar.</span>
            </h1>
            <CtaReassurance className="mt-7" />
          </div>

          <div className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
            <div>
              <ContactForm />
            </div>
            <div className="mt-4 flex flex-col items-start gap-3 rounded-2xl bg-surface-sunken p-5 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-fg-muted">
                Vet ni redan ungefär vad ni vill ha? Svara på några snabba frågor i stället.
              </p>
              <StartProjectButton trackingLocation="kontakt-guidad" variant="secondary" className="shrink-0">
                Guidad förfrågan
                <ArrowUpRight size={15} />
              </StartProjectButton>
            </div>
            {quote && (
              <figure className="mt-8 flex gap-4 px-2">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <Image src={quote.avatar} alt={quote.name} fill sizes="44px" className="object-cover" />
                </span>
                <div>
                  <blockquote className="text-[15px] leading-snug text-fg">“{quote.quote}”</blockquote>
                  <figcaption className="mt-1 text-sm text-fg-muted">
                    {quote.name}, {quote.role}
                  </figcaption>
                </div>
              </figure>
            )}
          </div>
          <div className="lg:col-start-1 lg:row-start-2">
            <ol className="space-y-6 lg:mt-12">
              {nextSteps.map((step, index) => (
                <li key={step.title}>
                  <Reveal delay={index * 0.08} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pine-100 font-display text-sm font-semibold text-pine-800">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-display text-lg font-semibold tracking-[-0.01em] text-fg">{step.title}</p>
                      <p className="mt-1 text-fg-muted">{step.description}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>

            <div className="mt-12 grid gap-3 sm:grid-cols-2">
              <a
                href={`mailto:${contactInfo.email}`}
                className="group flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-card ring-1 ring-line transition-shadow hover:shadow-raised"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine-100 text-pine-800">
                  <Mail size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-fg-muted">Mejla direkt</span>
                  <span className="block truncate font-medium text-fg">{contactInfo.email}</span>
                </span>
              </a>
              <a
                href={contactInfo.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-card ring-1 ring-line transition-shadow hover:shadow-raised"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
                  <MessageCircle size={18} />
                </span>
                <span>
                  <span className="block text-sm text-fg-muted">WhatsApp</span>
                  <span className="block font-medium text-fg">{contactInfo.whatsapp}</span>
                </span>
              </a>
            </div>
            <p className="mt-4 text-sm text-fg-muted">
              Betala en faktura? Bankgiro <span className="font-medium text-fg">{paymentInfo.bankgiro}</span>
            </p>
          </div>

        </div>
      </Container>
    </Section>
  );
}
