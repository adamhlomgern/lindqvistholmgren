import Link from "next/link";
import { Container } from "@/components/ui/Container";

const navItems = [
  { href: "/tjanster", label: "Tjänster" },
  { href: "/projekt", label: "Projekt" },
  { href: "/artiklar", label: "Artiklar" },
  { href: "/om-oss", label: "Om oss" },
  { href: "/kontakt", label: "Kontakta oss" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal">
      <Container className="flex flex-col gap-10 py-16 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-xl font-semibold text-bone">Lindqvist / Holmgren</p>
          <p className="mt-4 text-sm leading-relaxed text-stone">
            Två frilansare med bas i Karlstad. Vi hjälper lokala företag växa digitalt
            — personligt, nära och utan mellanhänder.
          </p>
        </div>
        <nav className="flex flex-col gap-3 text-sm text-bone/70">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-emerald">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="text-sm text-bone/70">
          <p className="text-xs font-medium uppercase tracking-label text-stone">
            Kontakta oss
          </p>
          <p className="mt-3">Karlstad, Sverige</p>
          <p className="mt-1">info@lindqvistholmgren.se</p>
        </div>
      </Container>
      <Container className="py-6 text-xs text-stone/70">
        © {new Date().getFullYear()} Lindqvist / Holmgren
      </Container>
    </footer>
  );
}
