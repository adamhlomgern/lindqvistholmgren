"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DemoNavItem } from "@/components/demo/nav";

type SidebarShellProps = {
  productName: string;
  // ReactNode rather than string so a product can put something interactive
  // here (e.g. a persona/workspace switcher) instead of a plain label.
  subtitle?: ReactNode;
  logo?: string;
  navItems: DemoNavItem[];
  footer?: ReactNode;
  className?: string;
};

export function SidebarShell({ productName, subtitle, logo, navItems, footer, className = "" }: SidebarShellProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`hidden w-60 shrink-0 border-r border-demo-border bg-demo-surface px-4 py-6 md:flex md:flex-col md:justify-between ${className}`}
    >
      <div>
        <div className="px-2">
          <div className="flex items-center gap-2.5">
            {logo && <Image src={logo} alt="" width={28} height={28} className="h-7 w-7 shrink-0" />}
            <p className="font-display text-lg font-bold text-demo-text">{productName}</p>
          </div>
          {subtitle && <div className="mt-2.5">{subtitle}</div>}
        </div>
        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = item.exactMatch ? pathname === item.href : pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-demo-primary-soft text-demo-primary-soft-text"
                    : "text-demo-text-muted hover:bg-demo-surface-hover hover:text-demo-text"
                }`}
              >
                <Icon size={17} strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {footer}
    </aside>
  );
}
