"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Clock, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { services } from "@/lib/data/services";
import { useCookieConsent } from "@/components/consent/CookieConsentProvider";
import { socialLinks } from "@/lib/data/site-info";

type FooterLink = { href: string; label: string };

const serviceLinks: FooterLink[] = [
  { href: "/tjanster", label: "Alla tjänster" },
  ...services.map((service) => ({ href: `/tjanster/${service.slug}`, label: service.title })),
];

const pageLinks: FooterLink[] = [
  { href: "/", label: "Hem" },
  { href: "/demos", label: "Demos" },
  { href: "/projekt", label: "Projekt" },
  { href: "/artiklar", label: "Artiklar" },
  { href: "/om-oss", label: "Om oss" },
  { href: "/kontakt", label: "Kontakta oss" },
];

const footerGroups = [
  { id: "tjanster", label: "Tjänster", links: serviceLinks },
  { id: "sidor", label: "Sidor", links: pageLinks },
];

function FooterLinkList({ links }: { links: FooterLink[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="text-sm text-bone/70 transition-colors hover:text-emerald">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FooterContact({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <a
        href="mailto:info@lindqvistholmgren.se"
        className="flex items-center gap-2.5 text-sm text-bone/70 transition-colors hover:text-emerald"
      >
        <Mail size={16} strokeWidth={2} className="text-stone" />
        info@lindqvistholmgren.se
      </a>
      <p className="mt-3 flex items-center gap-2.5 text-sm text-bone/70">
        <MapPin size={16} strokeWidth={2} className="text-stone" />
        Karlstad, Sverige
      </p>
      <Button href="/kontakt" variant="secondary" className="mt-5 w-full">
        Starta ett projekt
      </Button>
    </div>
  );
}

export function Footer() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const { openPreferences } = useCookieConsent();

  return (
    <footer className="bg-charcoal">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1.1fr] md:gap-8">
          <div className="max-w-sm">
            <Link href="/" className="inline-block">
              <Image
                src="/images/lindqvist-holmgren/lindqvist-holmgren-full-logo.svg"
                alt="Lindqvist / Holmgren"
                width={6065}
                height={2124}
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-stone">
              Två frilansare med bas i Karlstad. Vi hjälper företag växa digitalt —
              lokalt och i hela Sverige, personligt och utan mellanhänder.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-bone/5 py-1.5 pl-2.5 pr-3.5 text-xs font-medium uppercase tracking-label text-stone">
              <Clock className="text-emerald" size={14} strokeWidth={2.25} />
              Svar inom 24 timmar
            </p>
            <div className="mt-5 flex items-center gap-3">
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
          </div>

          <div className="hidden md:block">
            <p className="text-xs font-medium uppercase tracking-label text-stone">Tjänster</p>
            <div className="mt-4">
              <FooterLinkList links={serviceLinks} />
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium uppercase tracking-label text-stone">Sidor</p>
            <div className="mt-4">
              <FooterLinkList links={pageLinks} />
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium uppercase tracking-label text-stone">Kontakt</p>
            <FooterContact className="mt-4" />
          </div>

          <div className="divide-y divide-bone/10 border-y border-bone/10 md:hidden">
            {footerGroups.map((group) => {
              const isOpen = openGroup === group.id;
              return (
                <div key={group.id}>
                  <button
                    type="button"
                    onClick={() => setOpenGroup(isOpen ? null : group.id)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-bone">{group.label}</span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-emerald transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-5">
                        <FooterLinkList links={group.links} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="md:hidden">
            <p className="text-xs font-medium uppercase tracking-label text-stone">Kontakt</p>
            <FooterContact className="mt-4" />
          </div>
        </div>
      </Container>
      <Container className="flex flex-wrap items-center justify-between gap-4 border-t border-bone/10 py-6 text-xs text-stone/70">
        <p>© {new Date().getFullYear()} Lindqvist / Holmgren</p>
        <div className="flex items-center gap-4">
          <button type="button" onClick={openPreferences} className="transition-colors hover:text-emerald">
            🍪 Cookie-inställningar
          </button>
          <Link href="/integritetspolicy" className="transition-colors hover:text-emerald">
            Integritetspolicy
          </Link>
          <Link href="/allmanna-villkor" className="transition-colors hover:text-emerald">
            Allmänna villkor
          </Link>
        </div>
      </Container>
    </footer>
  );
}
