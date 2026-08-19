"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DemoNavItem } from "@/components/demo/nav";

type MobileNavShellProps = {
  navItems: DemoNavItem[];
};

export function MobileNavShell({ navItems }: MobileNavShellProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-demo-border bg-demo-surface/95 py-2 backdrop-blur-md md:hidden">
      {navItems.map((item) => {
        const active = item.exactMatch ? pathname === item.href : pathname?.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 rounded-lg px-4 py-1.5 text-xs font-medium transition-colors ${
              active ? "text-demo-primary" : "text-demo-text-muted"
            }`}
          >
            <Icon size={19} strokeWidth={2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
