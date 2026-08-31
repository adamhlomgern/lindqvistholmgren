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
import { accents, type Accent } from "@/lib/design/accents";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { contactInfo, socialLinks } from "@/lib/data/site-info";

export const metadata: Metadata = {
  title: "Om oss",
  description:
    "Lindqvist / Holmgren är två frilansare, Ada och Malin, som tillsammans hjälper småföretag i Karlstad och hela Sverige med webb, design och marknadsföring.",
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
      <Section tone="olive">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2">
            {team.map((person) => (
              <GlassCard key={person.name} accent={person.accent}>
                <div className="flex gap-5">
                  <div className="relative h-36 w-28 shrink-0 sm:h-40 sm:w-32">
                    <Image
                      src={person.avatar}
                      alt={person.name}
                      fill
                      sizes="112px"
                      className="object-contain object-top"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-bold text-bone">{person.name}</p>
                    <p className="mt-1 text-sm text-stone">{person.role}</p>
                    <p className="mt-4 text-sm leading-relaxed text-bone/80">{person.bio}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {person.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {values.map((value, index) => {
              const accent = accents[index % accents.length];
              return (
                <GlassCard key={value.title} accent={accent}>
                  <AccentBadge icon={value.icon} accent={accent} />
                  <h2 className="mt-4 font-display text-lg font-bold text-bone">{value.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone">{value.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </Container>
      </Section>
      <Section tone="olive">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2">
            <GlassCard accent="emerald">
              <AccentBadge icon={Mail} accent="emerald" />
              <h2 className="mt-4 font-display text-lg font-bold text-bone">Kontakta oss</h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-stone">
                <li>
                  E-post:{" "}
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-bone transition-colors hover:text-emerald"
                  >
                    {contactInfo.email}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle size={16} strokeWidth={2} className="text-emerald" />
                  WhatsApp:{" "}
                  <a
                    href={contactInfo.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bone transition-colors hover:text-emerald"
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
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-bone/5 text-bone/70 transition-colors hover:bg-bone/10 hover:text-emerald"
                >
                  <FacebookIcon size={16} strokeWidth={2} />
                </a>
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lindqvist / Holmgren på Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-bone/5 text-bone/70 transition-colors hover:bg-bone/10 hover:text-emerald"
                >
                  <InstagramIcon size={16} strokeWidth={2} />
                </a>
              </div>
            </GlassCard>
            <GlassCard accent="peach">
              <AccentBadge icon={MapPin} accent="peach" />
              <h2 className="mt-4 font-display text-lg font-bold text-bone">Företagsuppgifter</h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-stone">
                <li>Adress: {contactInfo.address}</li>
                <li>Org.nr: {contactInfo.orgNumber}</li>
                <li>Momsreg.nr: {contactInfo.vatNumber}</li>
              </ul>
            </GlassCard>
          </div>
        </Container>
      </Section>
      <CtaBanner />
    </>
  );
}
