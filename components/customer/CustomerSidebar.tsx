"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, FolderOpen, LayoutDashboard, LogOut, Menu, MessageSquareText, X } from "lucide-react";
import { logoutCustomer } from "@/lib/actions/customer-auth";

const navItems = [
  { href: "/kund", label: "Översikt", icon: LayoutDashboard },
  { href: "/kund/projekt", label: "Projekt", icon: BriefcaseBusiness },
  { href: "/kund/meddelanden", label: "Meddelanden", icon: MessageSquareText },
  { href: "/kund/material", label: "Material", icon: FolderOpen },
];

function isActive(pathname: string, href: string) {
  if (href === "/kund") return pathname === "/kund";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarProps = { companyName: string; unreadMessageCount: number };

export function CustomerSidebar({ companyName, unreadMessageCount }: SidebarProps) {
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
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface-sunken md:flex md:h-screen">
        <div className="shrink-0 border-b border-line px-6 py-5">
          <p className="font-display text-base font-semibold text-fg">Lindqvist / Holmgren</p>
          <p className="mt-0.5 truncate text-xs text-fg-subtle">{companyName}</p>
        </div>
        <nav className="flex flex-1 flex-col px-3 py-5">
          <NavLinks pathname={pathname} size="sm" unreadMessageCount={unreadMessageCount} />
        </nav>
        <div className="shrink-0 border-t border-line px-3 py-3">
          <form action={logoutCustomer}>
            <button
              type="submit"
              className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-fg-muted transition-colors hover:bg-fg/5 hover:text-coral"
            >
              <LogOut size={18} strokeWidth={2} />
              Logga ut
            </button>
          </form>
        </div>
      </aside>

      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-canvas/90 backdrop-blur px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Öppna meny"
          className="-ml-1.5 flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-3 text-fg active:bg-fg/5"
        >
          <span className="relative">
            <Menu size={20} strokeWidth={2} />
            {unreadMessageCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-semibold text-on-primary">
                {unreadMessageCount}
              </span>
            )}
          </span>
          <span className="font-display text-sm font-semibold">{currentLabel}</span>
        </button>
        <form action={logoutCustomer}>
          <button
            type="submit"
            aria-label="Logga ut"
            className="flex h-10 w-10 items-center justify-center rounded-full text-fg-muted active:bg-fg/5 active:text-coral"
          >
            <LogOut size={18} strokeWidth={2} />
          </button>
        </form>
      </div>

      <div
        className={`fixed inset-0 z-40 flex h-dvh flex-col bg-canvas transition-opacity duration-300 ease-out md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-line px-6 py-5">
          <div>
            <p className="font-display text-base font-semibold text-fg">Lindqvist / Holmgren</p>
            <p className="mt-0.5 text-xs text-fg-subtle">{companyName}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Stäng meny"
            className="flex h-10 w-10 items-center justify-center rounded-full text-fg ring-1 ring-inset ring-line-strong transition-colors hover:bg-surface-sunken"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col px-4 py-5">
          <NavLinks pathname={pathname} size="lg" onNavigate={() => setOpen(false)} unreadMessageCount={unreadMessageCount} />
        </nav>

        <div className="shrink-0 border-t border-line px-4 py-4">
          <form action={logoutCustomer}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-base font-medium text-fg-muted transition-colors hover:bg-fg/5 hover:text-coral"
            >
              <LogOut size={20} strokeWidth={2} />
              Logga ut
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function NavLinks({
  pathname,
  size,
  onNavigate,
  unreadMessageCount,
}: {
  pathname: string;
  size: "sm" | "lg";
  onNavigate?: () => void;
  unreadMessageCount: number;
}) {
  const sizeClasses = size === "sm" ? "h-11 px-3 text-sm gap-3" : "px-4 py-3.5 text-base gap-3";

  return (
    <div className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        const unreadBadge = item.href === "/kund/meddelanden" ? unreadMessageCount : 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center justify-between rounded-lg font-medium transition-colors ${sizeClasses} ${
              active ? "bg-surface text-fg shadow-card ring-1 ring-line" : "text-fg-muted hover:bg-fg/[0.04] hover:text-fg"
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon size={size === "sm" ? 18 : 20} strokeWidth={2} />
              {item.label}
            </span>
            {unreadBadge > 0 && (
              <span className="rounded-full bg-coral/15 px-2 py-0.5 text-[11px] font-semibold text-coral">
                {unreadBadge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
