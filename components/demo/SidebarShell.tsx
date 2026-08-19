"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DemoNavItem } from "@/components/demo/nav";

type SidebarShellProps = {
  productName: string;
  subtitle?: string;
  navItems: DemoNavItem[];
  footer?: ReactNode;
  className?: string;
};

export function SidebarShell({ productName, subtitle, navItems, footer, className = "" }: SidebarShellProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`hidden w-60 shrink-0 border-r border-demo-border bg-demo-surface px-4 py-6 md:flex md:flex-col md:justify-between ${className}`}
    >
      <div>
        <div className="px-2">
          <p className="font-display text-lg font-bold text-demo-text">{productName}</p>
          {subtitle && <p className="mt-0.5 text-xs text-demo-text-muted">{subtitle}</p>}
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
