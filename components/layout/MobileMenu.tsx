"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Mail, MapPin, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { StartProjectButton } from "@/components/contact/StartProjectButton";

type NavItem = { href: string; label: string };

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
};

export function MobileMenu({ open, onClose, navItems }: MobileMenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[60] flex h-dvh w-screen flex-col bg-canvas transition-opacity duration-300 ease-out md:hidden ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      <Container className="relative flex h-16 items-center justify-between border-b border-line">
        <Link href="/" className="shrink-0" onClick={onClose}>
          <Image
            src="/images/lindqvist-holmgren/LH-liten-svg-on-light.svg"
            alt="Lindqvist / Holmgren"
            width={1108}
            height={1066}
            className="h-8 w-auto"
          />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Stäng meny"
          className="flex h-10 w-10 items-center justify-center rounded-full text-fg ring-1 ring-inset ring-line-strong transition-colors hover:bg-surface-sunken"
        >
          <X size={20} strokeWidth={2} />
        </button>
      </Container>

      <nav className="relative flex flex-1 flex-col justify-center overflow-y-auto">
        <Container className="flex flex-col">
          {navItems.map((item, index) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`py-3 font-display text-4xl font-semibold tracking-[-0.025em] transition-all duration-500 ease-out ${
                  active ? "text-primary" : "text-fg hover:text-primary"
                } ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                style={{ transitionDelay: open ? `${120 + index * 70}ms` : "0ms" }}
              >
                {item.label}
              </Link>
            );
          })}
        </Container>
      </nav>

      <div
        className={`relative border-t border-line bg-surface-sunken transition-all duration-500 ease-out ${
          open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: open ? `${120 + navItems.length * 70}ms` : "0ms" }}
      >
        <Container className="flex flex-col gap-6 py-8">
          <StartProjectButton onClick={onClose} className="w-full py-4 text-base">
            Starta ett projekt
            <ArrowRight size={16} strokeWidth={2.5} />
          </StartProjectButton>

          <div className="flex flex-col gap-3 border-t border-line pt-6 text-sm text-fg-muted">
            <a
              href="mailto:info@lindqvistholmgren.se"
              className="flex items-center gap-2.5 transition-colors hover:text-fg"
            >
              <Mail size={16} strokeWidth={2} className="text-fg-muted" />
              info@lindqvistholmgren.se
            </a>
            <p className="flex items-center gap-2.5">
              <MapPin size={16} strokeWidth={2} className="text-fg-muted" />
              Karlstad, Sverige
            </p>
          </div>
        </Container>
      </div>
    </div>
  );
}
