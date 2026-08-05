"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { StartProjectButton } from "@/components/contact/StartProjectButton";

const navItems = [
  { href: "/", label: "Hem" },
  { href: "/tjanster", label: "Tjänster" },
  { href: "/projekt", label: "Projekt" },
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
          Lindqvist / Holmgren
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
        <StartProjectButton className="hidden md:inline-flex">
          Starta ett projekt
          <ChevronRight size={14} strokeWidth={2.5} />
        </StartProjectButton>
      </Container>
    </header>
  );
}
