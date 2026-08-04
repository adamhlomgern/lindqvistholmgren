"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const navItems = [
  { href: "/tjanster", label: "Tjänster" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/artiklar", label: "Artiklar" },
  { href: "/om-oss", label: "Om oss" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50">
      <Container className="flex items-center justify-between gap-6 py-4">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-bone"
        >
          Lindqvist Holmgren
        </Link>
        <nav className="hidden items-center gap-1 rounded-full bg-bone/5 p-1.5 md:flex">
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
        <Button href="/kontakt" className="hidden md:inline-flex">
          Starta ett projekt
          <ChevronRight size={14} strokeWidth={2.5} />
        </Button>
      </Container>
    </header>
  );
}
