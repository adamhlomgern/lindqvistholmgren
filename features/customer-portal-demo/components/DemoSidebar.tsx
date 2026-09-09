"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, FolderOpen, LayoutDashboard, Menu, MessageSquareText, X } from "lucide-react";
import { DEMO_PROJECT_ID } from "@/features/customer-portal-demo/data/seed";

const BASE = "/demo/kundportal";

// Visual near-copy of components/customer/CustomerSidebar — same structure
// and classes, but demo-scoped hrefs (a single project, no list page needed)
// and no logout form (there's no session to log out of).
const navItems = [
  { href: BASE, label: "Översikt", icon: LayoutDashboard },
  { href: `${BASE}/projekt/${DEMO_PROJECT_ID}`, label: "Projekt", icon: BriefcaseBusiness },
  { href: `${BASE}/meddelanden`, label: "Meddelanden", icon: MessageSquareText },
  { href: `${BASE}/material`, label: "Material", icon: FolderOpen },
];

function isActive(pathname: string, href: string) {
  if (href === BASE) return pathname === BASE;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DemoSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const currentLabel = navItems.find((item) => isActive(pathname, item.href))?.label ?? "Kundportal";

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-bone/10 bg-charcoal/60 md:flex md:h-screen">
        <div className="shrink-0 border-b border-bone/10 px-6 py-5">
          <p className="font-display text-base font-bold text-bone">Lindqvist / Holmgren</p>
          <p className="mt-0.5 truncate text-xs text-stone/70">Glänta Trädgård</p>
        </div>
        <nav className="flex flex-1 flex-col px-3 py-5">
          <NavLinks pathname={pathname} size="sm" />
        </nav>
        <div className="shrink-0 border-t border-bone/10 px-3 py-3">
          <Link
            href="/"
            className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-stone transition-colors hover:bg-bone/5 hover:text-bone"
          >
            <ArrowLeft size={18} strokeWidth={2} />
            Avsluta demo
          </Link>
        </div>
      </aside>

      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-bone/10 bg-charcoal/95 px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Öppna meny"
          className="-ml-1.5 flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-3 text-bone active:bg-bone/5"
        >
          <Menu size={20} strokeWidth={2} />
          <span className="font-display text-sm font-bold">{currentLabel}</span>
        </button>
        <Link href="/" aria-label="Avsluta demo" className="flex h-10 w-10 items-center justify-center rounded-full text-stone active:bg-bone/5">
          <ArrowLeft size={18} strokeWidth={2} />
        </Link>
      </div>

      <div
        className={`fixed inset-0 z-40 flex h-dvh w-screen flex-col bg-forest transition-opacity duration-300 ease-out md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-bone/10 px-6 py-5">
          <div>
            <p className="font-display text-base font-bold text-bone">Lindqvist / Holmgren</p>
            <p className="mt-0.5 text-xs text-stone/70">Glänta Trädgård</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Stäng meny"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-bone/10 bg-bone/10 text-bone transition-colors hover:bg-bone/15"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col px-4 py-5">
          <NavLinks pathname={pathname} size="lg" onNavigate={() => setOpen(false)} />
        </nav>

        <div className="shrink-0 border-t border-bone/10 px-4 py-4">
          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-base font-medium text-stone transition-colors hover:bg-bone/5 hover:text-bone"
          >
            <ArrowLeft size={20} strokeWidth={2} />
            Avsluta demo
          </Link>
        </div>
      </div>
    </>
  );
}

function NavLinks({ pathname, size, onNavigate }: { pathname: string; size: "sm" | "lg"; onNavigate?: () => void }) {
  const sizeClasses = size === "sm" ? "h-11 px-3 text-sm gap-3" : "px-4 py-3.5 text-base gap-3";

  return (
    <div className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center rounded-lg font-medium transition-colors ${sizeClasses} ${
              active ? "bg-emerald/10 text-emerald" : "text-stone hover:bg-bone/5 hover:text-bone"
            }`}
          >
            <Icon size={size === "sm" ? 18 : 20} strokeWidth={2} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
