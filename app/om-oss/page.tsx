import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Mail, MapPin, MessageCircle, Sparkles, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Tag } from "@/components/ui/Tag";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import type { Accent } from "@/lib/design/accents";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Reveal } from "@/components/motion/Reveal";
import { contactInfo, businessInfo, socialLinks } from "@/lib/data/site-info";

export const metadata: Metadata = {
  title: "Om oss",
  description:
    "Lindqvist / Holmgren är två frilansare, Ada och Malin, som tillsammans hjälper småföretag i Karlstad och hela Sverige med webb, design, affärssystem och marknadsföring.",
  alternates: {
    canonical: "/om-oss",
  },
};

const team: {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  tags: string[];
  accent: Accent;
}[] = [
  {
    name: "Ada",
    role: "Utveckling, marknadsföring & grafisk formgivning",
    bio: "Utvecklare med bakgrund inom grafisk formgivning och tryckteknik. Sköter det mesta av marknadsföringen och är lite allt i allo.",
    avatar: "/images/lindqvist-holmgren/ada-avatar-done.png",
    tags: ["Utveckling", "Marknadsföring", "Grafisk formgivning", "Tryckteknik"],
    accent: "emerald",
  },
  {
    name: "Malin",
    role: "Utveckling, UX & digital design",
    bio: "Utbildad digital designer och UX:are med fokus på backend och användarupplevelse. Också behörig förskollärare, ifall det skulle behövas.",
    avatar: "/images/lindqvist-holmgren/malin-avataar-done.png",
    tags: ["Utveckling", "UX-design", "Digital design", "Backend"],
    accent: "peach",
  },
];

const values = [
  {
    icon: Users,
    title: "Ingen mellanhand",
    description: "Ni pratar alltid direkt med den som faktiskt gör jobbet — Ada eller Malin.",
  },
  {
    icon: Sparkles,
    title: "Skräddarsytt",
    description: "Inga mallar eller genvägar. Varje projekt byggs utifrån era behov.",
  },
  {
    icon: MapPin,
    title: "Karlstad, hela Sverige",
    description: "Bas i Karlstad, men vi jobbar med kunder i hela landet på distans.",
  },
];

export default function OmOssPage() {
  return (
    <>
      <PageHero
        icon={Heart}
        eyebrow="Om oss"
        title="Två personer. Ett gemensamt hantverk."
        description="Vi är inte en stor byrå med projektledare och mellanhänder — vi är två frilansare som driver Lindqvist / Holmgren tillsammans, med bas i Karlstad. Ni pratar alltid direkt med den som faktiskt gör jobbet, och vi lägger stolthet i att leverera något genomarbetat, oavsett hur stort eller litet projektet är."
      />
      <Section tone="light" className="pt-4 md:pt-6">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {team.map((person, index) => (
              <Reveal key={person.name} delay={index * 0.1}>
                <article className="overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-line">
                  <div className={`relative flex h-80 items-end justify-center overflow-hidden ${index === 0 ? "bg-lilac-200" : "bg-amber-100"}`}>
                    <span
                      aria-hidden
                      className={`absolute -right-10 -top-10 h-56 w-56 rounded-full ${index === 0 ? "bg-lilac-300" : "bg-amber-200"}`}
                    />
                    <div className="relative h-72 w-60">
                      <Image src={person.avatar} alt={person.name} fill sizes="240px" className="object-contain object-bottom" />
                    </div>
                  </div>
                  <div className="p-8">
                    <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-fg">{person.name}</h2>
                    <p className="mt-1 text-fg-muted">{person.role}</p>
                    <p className="mt-5 leading-relaxed text-fg">{person.bio}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {person.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="pine">
        <Container>
          <p className="text-sm font-medium text-fg-muted">Det vi står för</p>
          <ol className="mt-8 divide-y divide-line border-y border-line">
            {values.map((value, index) => (
              <li key={value.title}>
                <Reveal delay={index * 0.08} className="grid gap-3 py-10 md:grid-cols-[6rem_1fr_1fr] md:items-baseline md:gap-10">
                  <span className="font-display text-lg font-semibold tabular-nums text-highlight">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] md:text-5xl">{value.title}</h2>
                  <p className="max-w-md text-lg leading-relaxed text-fg-muted">{value.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
      <Section tone="olive">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2">
            <GlassCard accent="emerald">
              <AccentBadge icon={Mail} accent="emerald" />
              <h2 className="mt-4 font-display text-lg font-semibold text-fg">Kontakta oss</h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-fg-muted">
                <li>
                  E-post:{" "}
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-fg transition-colors hover:text-primary"
                  >
                    {contactInfo.email}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle size={16} strokeWidth={2} className="text-primary" />
                  WhatsApp:{" "}
                  <a
                    href={contactInfo.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg transition-colors hover:text-primary"
                  >
                    {contactInfo.whatsapp}
                  </a>
                </li>
              </ul>
              <div className="mt-4 flex items-center gap-3">
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lindqvist / Holmgren på Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-fg/5 text-fg-muted transition-colors hover:bg-fg/10 hover:text-primary"
                >
                  <FacebookIcon size={16} strokeWidth={2} />
                </a>
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lindqvist / Holmgren på Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-fg/5 text-fg-muted transition-colors hover:bg-fg/10 hover:text-primary"
                >
                  <InstagramIcon size={16} strokeWidth={2} />
                </a>
              </div>
            </GlassCard>
            <GlassCard accent="peach">
              <AccentBadge icon={MapPin} accent="peach" />
              <h2 className="mt-4 font-display text-lg font-semibold text-fg">Företagsuppgifter</h2>
              <p className="mt-1 text-xs text-fg-subtle">
                Två enskilda firmor som samarbetar under varumärket Lindqvist / Holmgren.
              </p>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-fg-muted">
                <li>Adress: {contactInfo.address}</li>
                <li>
                  {businessInfo.ada.name} — Org.nr: {businessInfo.ada.orgNumber}
                  <span className="block text-xs text-fg-subtle">
                    Momsreg.nr: {businessInfo.ada.vatNumber}
                  </span>
                </li>
                <li>
                  {businessInfo.malin.name} — Org.nr: {businessInfo.malin.orgNumber}
                </li>
              </ul>
            </GlassCard>
          </div>
        </Container>
      </Section>
      <CtaBanner />
    </>
  );
}
