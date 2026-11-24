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
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-xl backdrop-saturate-150">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/lindqvist-holmgren/lindqvist-holmgren-full-logo-on-light.svg"
            alt="Lindqvist / Holmgren"
            width={6065}
            height={2124}
            priority
            className="hidden h-8 w-auto md:block"
          />
          <Image
            src="/images/lindqvist-holmgren/LH-liten-svg-on-light.svg"
            alt="Lindqvist / Holmgren"
            width={1108}
            height={1066}
            priority
            className="h-8 w-auto md:hidden"
          />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors ${
                  active ? "bg-fg/[0.06] text-fg" : "text-fg-muted hover:bg-fg/[0.04] hover:text-fg"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:block">
          <StartProjectButton trackingLocation="header">
            Starta ett projekt
            <ChevronRight size={14} strokeWidth={2.5} />
          </StartProjectButton>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Öppna meny"
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-full text-fg ring-1 ring-inset ring-line-strong transition-colors hover:bg-surface-sunken md:hidden"
        >
          <Menu size={20} strokeWidth={2} />
        </button>
      </Container>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} navItems={navItems} />
    </header>
  );
}
