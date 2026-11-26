"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function CustomerKundvyTabs({ customerId }: { customerId: string }) {
  const pathname = usePathname();
  const base = `/admin/kunder/${customerId}/kundvy`;

  const tabs = [
    { href: base, label: "Översikt" },
    { href: `${base}/projekt`, label: "Projekt" },
    { href: `${base}/meddelanden`, label: "Meddelanden" },
    { href: `${base}/material`, label: "Material" },
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-line">
      {tabs.map((tab) => {
        const active = tab.href === base ? pathname === base : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`shrink-0 border-b-2 px-3 pb-3 text-sm font-medium transition-colors ${
              active ? "border-primary text-fg" : "border-transparent text-fg-muted hover:text-fg"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
