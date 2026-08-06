"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Hash,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Tags,
  X,
} from "lucide-react";
import { logout } from "@/lib/actions/auth";

const navItems = [
  { href: "/admin", label: "Översikt", icon: LayoutDashboard },
  { href: "/admin/projekt", label: "Projekt", icon: Briefcase },
  { href: "/admin/artiklar", label: "Artiklar", icon: Newspaper },
  { href: "/admin/kategorier", label: "Kategorier", icon: Tags },
  { href: "/admin/taggar", label: "Taggar", icon: Hash },
  { href: "/admin/forfragningar", label: "Förfrågningar", icon: Mail },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const currentLabel = navItems.find((item) => isActive(pathname, item.href))?.label ?? "Admin";

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

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-bone/10 bg-charcoal/60 md:flex md:h-screen">
        <div className="shrink-0 border-b border-bone/10 px-6 py-6">
          <p className="font-display text-base font-bold text-bone">Lindqvist / Holmgren</p>
          <p className="mt-0.5 text-xs uppercase tracking-label text-stone/70">Admin</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-6">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-emerald/10 text-emerald" : "text-stone hover:bg-bone/5 hover:text-bone"
                }`}
              >
                <Icon size={18} strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="shrink-0 border-t border-bone/10 px-6 py-5">
          <p className="truncate text-xs text-stone">{email}</p>
          <form action={logout} className="mt-3">
            <button
              type="submit"
              className="flex items-center gap-2 text-sm font-medium text-stone hover:text-coral"
            >
              <LogOut size={15} strokeWidth={2.25} />
              Logga ut
            </button>
          </form>
        </div>
      </aside>

      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-bone/10 bg-charcoal/95 px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Öppna meny"
          className="-ml-1.5 flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-3 text-bone active:bg-bone/5"
        >
          <Menu size={20} strokeWidth={2.25} />
          <span className="font-display text-sm font-bold">{currentLabel}</span>
        </button>
        <form action={logout}>
          <button
            type="submit"
            aria-label="Logga ut"
            className="flex h-10 w-10 items-center justify-center rounded-full text-stone active:bg-bone/5 active:text-coral"
          >
            <LogOut size={18} strokeWidth={2.25} />
          </button>
        </form>
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
            <p className="mt-0.5 text-xs uppercase tracking-label text-stone/70">Admin</p>
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

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                  active ? "bg-emerald/10 text-emerald" : "text-bone hover:bg-bone/5"
                }`}
              >
                <Icon size={20} strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-bone/10 px-6 py-5">
          <p className="truncate text-xs text-stone">{email}</p>
          <form action={logout} className="mt-3">
            <button
              type="submit"
              className="flex items-center gap-2 text-sm font-medium text-stone hover:text-coral"
            >
              <LogOut size={15} strokeWidth={2.25} />
              Logga ut
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
