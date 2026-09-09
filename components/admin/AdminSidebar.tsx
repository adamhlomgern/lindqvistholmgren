"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  ChevronDown,
  GalleryHorizontalEnd,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Newspaper,
  Receipt,
  Settings,
  Users,
  X,
} from "lucide-react";
import { logout } from "@/lib/actions/auth";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  badgeAccent?: "emerald" | "coral" | "sky";
};
type SubNavItem = { href: string; label: string };
type NavGroup = { label: string; items: NavItem[] };

const primaryItem: NavItem = { href: "/admin", label: "Översikt", icon: LayoutDashboard };
const settingsItem: NavItem = { href: "/admin/installningar", label: "Inställningar", icon: Settings };

// Kategorier/taggar are metadata for artiklar, not verksamhetskritiska
// destinationer i egen rätt — visas som indenterad subnav under Artiklar
// istället för som egna toppnivå-länkar.
const articleSubItems: SubNavItem[] = [
  { href: "/admin/kategorier", label: "Kategorier" },
  { href: "/admin/taggar", label: "Taggar" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initialOf(email: string) {
  return email.trim().charAt(0).toUpperCase() || "?";
}

type SidebarProps = {
  email: string;
  displayName: string;
  newInquiriesCount: number;
  overdueInvoicesCount: number;
  activeProjectsCount: number;
  waitingChatCount: number;
};

export function AdminSidebar({
  email,
  displayName,
  newInquiriesCount,
  overdueInvoicesCount,
  activeProjectsCount,
  waitingChatCount,
}: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Starts expanded only when you're already looking at Artiklar/Kategorier/Taggar,
  // so the subnav doesn't clutter the sidebar the rest of the time.
  const [articlesExpanded, setArticlesExpanded] = useState(
    () =>
      isActive(pathname, "/admin/artiklar") ||
      articleSubItems.some((sub) => isActive(pathname, sub.href)),
  );

  const groups: NavGroup[] = [
    {
      label: "Arbete",
      items: [
        {
          href: "/admin/projekt",
          label: "Projekt",
          icon: BriefcaseBusiness,
          badge: activeProjectsCount || undefined,
          badgeAccent: "sky",
        },
        {
          href: "/admin/forfragningar",
          label: "Förfrågningar",
          icon: MessageSquareText,
          badge: newInquiriesCount || undefined,
          badgeAccent: "emerald",
        },
        { href: "/admin/kunder", label: "Kunder", icon: Users },
        {
          href: "/admin/inkorg",
          label: "Inkorg",
          icon: Inbox,
          badge: waitingChatCount || undefined,
          badgeAccent: "coral",
        },
      ],
    },
    {
      label: "Innehåll",
      items: [
        { href: "/admin/artiklar", label: "Artiklar", icon: Newspaper },
        { href: "/admin/portfolio", label: "Kundcase", icon: GalleryHorizontalEnd },
      ],
    },
    {
      label: "Ekonomi",
      items: [
        {
          href: "/admin/fakturor",
          label: "Fakturor",
          icon: Receipt,
          badge: overdueInvoicesCount || undefined,
          badgeAccent: "coral",
        },
      ],
    },
  ];

  const allRoutes = [primaryItem, ...groups.flatMap((g) => g.items), ...articleSubItems, settingsItem];
  const currentLabel = allRoutes.find((item) => isActive(pathname, item.href))?.label ?? "Admin";

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
        <div className="shrink-0 border-b border-bone/10 px-6 py-5">
          <p className="font-display text-base font-bold text-bone">Lindqvist / Holmgren</p>
          <p className="mt-0.5 text-xs text-stone/70">Admin</p>
        </div>
        <nav className="scroll-area-dark flex flex-1 flex-col overflow-y-auto px-3 py-5">
          <NavGroups
            pathname={pathname}
            groups={groups}
            size="sm"
            articlesExpanded={articlesExpanded}
            onToggleArticles={() => setArticlesExpanded((v) => !v)}
          />
        </nav>
        <SidebarFooter email={email} displayName={displayName} size="sm" />
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
        <form action={logout}>
          <button
            type="submit"
            aria-label="Logga ut"
            className="flex h-10 w-10 items-center justify-center rounded-full text-stone active:bg-bone/5 active:text-coral"
          >
            <LogOut size={18} strokeWidth={2} />
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
            <p className="mt-0.5 text-xs text-stone/70">Admin</p>
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

        <nav className="scroll-area-dark flex flex-1 flex-col overflow-y-auto px-4 py-5">
          <NavGroups
            pathname={pathname}
            groups={groups}
            size="lg"
            onNavigate={() => setOpen(false)}
            articlesExpanded={articlesExpanded}
            onToggleArticles={() => setArticlesExpanded((v) => !v)}
          />
        </nav>

        <SidebarFooter email={email} displayName={displayName} size="lg" onNavigate={() => setOpen(false)} />
      </div>
    </>
  );
}

function NavGroups({
  pathname,
  groups,
  size,
  onNavigate,
  articlesExpanded,
  onToggleArticles,
}: {
  pathname: string;
  groups: NavGroup[];
  size: "sm" | "lg";
  onNavigate?: () => void;
  articlesExpanded: boolean;
  onToggleArticles: () => void;
}) {
  return (
    <>
      <NavLink item={primaryItem} pathname={pathname} size={size} onNavigate={onNavigate} />
      {groups.map((group) => (
        <div key={group.label} className="mt-4">
          <p
            className={`pb-1 text-[11px] font-semibold uppercase tracking-label text-stone/65 ${
              size === "sm" ? "px-3" : "px-4"
            }`}
          >
            {group.label}
          </p>
          <div className="flex flex-col gap-1">
            {group.items.map((item) => {
              const hasChildren = item.href === "/admin/artiklar";
              return (
                <div key={item.href}>
                  {hasChildren ? (
                    <div className="flex items-center gap-1">
                      <NavLink item={item} pathname={pathname} size={size} onNavigate={onNavigate} className="flex-1" />
                      <button
                        type="button"
                        onClick={onToggleArticles}
                        aria-label={articlesExpanded ? "Dölj artikelundermeny" : "Visa artikelundermeny"}
                        aria-expanded={articlesExpanded}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-stone/60 transition-colors hover:bg-bone/5 hover:text-bone"
                      >
                        <ChevronDown
                          size={16}
                          strokeWidth={2}
                          className={`transition-transform ${articlesExpanded ? "" : "-rotate-90"}`}
                        />
                      </button>
                    </div>
                  ) : (
                    <NavLink item={item} pathname={pathname} size={size} onNavigate={onNavigate} />
                  )}
                  {hasChildren && articlesExpanded && (
                    <div
                      className={`mt-1 flex flex-col gap-0.5 border-l border-bone/10 ${
                        size === "sm" ? "ml-[21px] pl-5" : "ml-[26px] pl-[22px]"
                      }`}
                    >
                      {articleSubItems.map((sub) => (
                        <SubNavLink
                          key={sub.href}
                          item={sub}
                          pathname={pathname}
                          size={size}
                          onNavigate={onNavigate}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

const badgeAccentClasses = {
  emerald: "bg-emerald/15 text-emerald",
  coral: "bg-coral/15 text-coral",
  sky: "bg-sky/15 text-sky",
};

function NavLink({
  item,
  pathname,
  size,
  onNavigate,
  className = "",
}: {
  item: NavItem;
  pathname: string;
  size: "sm" | "lg";
  onNavigate?: () => void;
  className?: string;
}) {
  const active = isActive(pathname, item.href);
  const Icon = item.icon;
  const sizeClasses = size === "sm" ? "h-11 px-3 text-sm gap-3" : "px-4 py-3.5 text-base gap-3";

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center justify-between rounded-lg font-medium transition-colors ${sizeClasses} ${
        active ? "bg-emerald/10 text-emerald" : "text-stone hover:bg-bone/5 hover:text-bone"
      } ${className}`}
    >
      <span className="flex items-center gap-3">
        <Icon size={size === "sm" ? 18 : 20} strokeWidth={2} />
        {item.label}
      </span>
      {!!item.badge && (
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeAccentClasses[item.badgeAccent ?? "emerald"]}`}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function SubNavLink({
  item,
  pathname,
  size,
  onNavigate,
}: {
  item: SubNavItem;
  pathname: string;
  size: "sm" | "lg";
  onNavigate?: () => void;
}) {
  const active = isActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${size === "sm" ? "text-[13px]" : "text-sm"} ${
        active ? "bg-emerald/10 text-emerald" : "text-stone/70 hover:bg-bone/5 hover:text-bone"
      }`}
    >
      {item.label}
    </Link>
  );
}

// Pinned below the scrollable nav so Inställningar and the account menu
// stay reachable without scrolling, and only the middle section — the
// part that actually grows — scrolls.
function SidebarFooter({
  email,
  displayName,
  size,
  onNavigate,
}: {
  email: string;
  displayName: string;
  size: "sm" | "lg";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <div className={`shrink-0 border-t border-bone/10 ${size === "sm" ? "px-3 py-3" : "px-4 py-4"}`}>
      <NavLink item={settingsItem} pathname={pathname} size={size} onNavigate={onNavigate} />
      <div className="mt-2 border-t border-bone/10 pt-2">
        <AccountMenu email={email} displayName={displayName} size={size} />
      </div>
    </div>
  );
}

function AccountMenu({ email, displayName, size }: { email: string; displayName: string; size: "sm" | "lg" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Kontomeny"
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex w-full items-center gap-2.5 rounded-lg text-left transition-colors hover:bg-bone/5 ${
          size === "sm" ? "px-3 py-2" : "px-4 py-2.5"
        }`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald/15 text-xs font-bold text-emerald">
          {initialOf(displayName)}
        </span>
        <span className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-bone">{displayName}</p>
          <p className="truncate text-xs text-stone/60">{email}</p>
        </span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`shrink-0 text-stone/50 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 z-20 mb-1.5 w-full min-w-[13rem] rounded-xl border border-bone/10 bg-forest p-1.5 shadow-xl"
        >
          <form action={logout}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-coral transition-colors hover:bg-coral/10"
            >
              <LogOut size={14} strokeWidth={2} />
              Logga ut
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
