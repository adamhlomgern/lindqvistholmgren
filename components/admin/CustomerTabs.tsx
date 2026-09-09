"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { href: string; label: string };

export function CustomerTabs({ customerId }: { customerId: string }) {
  const pathname = usePathname();
  const base = `/admin/kunder/${customerId}`;

  const tabs: Tab[] = [
    { href: base, label: "Översikt" },
    { href: `${base}/projekt`, label: "Projekt" },
    { href: `${base}/meddelanden`, label: "Meddelanden" },
    { href: `${base}/material`, label: "Material" },
    { href: `${base}/ekonomi`, label: "Ekonomi" },
    { href: `${base}/atkomst`, label: "Åtkomst" },
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-bone/10">
      {tabs.map((tab) => {
        const active = tab.href === base ? pathname === base : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`shrink-0 border-b-2 px-3 pb-3 text-sm font-medium transition-colors ${
              active ? "border-emerald text-bone" : "border-transparent text-stone hover:text-bone"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
