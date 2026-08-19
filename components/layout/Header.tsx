"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { MobileMenu } from "@/components/layout/MobileMenu";

const navItems = [
  { href: "/", label: "Hem" },
  { href: "/tjanster", label: "Tjänster" },
  { href: "/demos", label: "Demos" },
  { href: "/projekt", label: "Projekt" },
  { href: "/artiklar", label: "Artiklar" },
  { href: "/om-oss", label: "Om oss" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <Container className="flex items-center justify-between gap-6 py-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/lindqvist-holmgren/lindqvist-holmgren-full-logo.svg"
            alt="Lindqvist / Holmgren"
            width={6065}
            height={2124}
            priority
            className="hidden h-9 w-auto md:block"
          />
          <Image
            src="/images/lindqvist-holmgren/LH-liten-svg.svg"
            alt="Lindqvist / Holmgren"
            width={1108}
            height={1066}
            priority
            className="h-9 w-auto md:hidden"
          />
        </Link>
        <nav className="hidden items-center gap-1 rounded-full border border-bone/10 bg-bone/10 p-1.5 backdrop-blur-md md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-charcoal text-emerald"
                    : "text-bone/80 hover:bg-charcoal hover:text-emerald"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:block">
          <StartProjectButton>
            Starta ett projekt
            <ChevronRight size={14} strokeWidth={2.5} />
          </StartProjectButton>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Öppna meny"
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-bone/10 bg-bone/10 text-bone transition-colors hover:bg-bone/15 md:hidden"
        >
          <Menu size={20} strokeWidth={2} />
        </button>
      </Container>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} navItems={navItems} />
    </header>
  );
}
