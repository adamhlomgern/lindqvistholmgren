"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, FolderOpen, MessageSquareText, MoreHorizontal, Pencil, Receipt } from "lucide-react";
import { SlideOver } from "@/components/ui/SlideOver";
import { CustomerForm } from "@/components/admin/CustomerForm";
import type { Customer } from "@/lib/types";

export function CustomerRowMenu({ customer }: { customer: Customer }) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const links = [
    { href: `/admin/kunder/${customer.id}/meddelanden`, label: "Öppna meddelanden", icon: MessageSquareText },
    { href: `/admin/kunder/${customer.id}/material`, label: "Öppna material", icon: FolderOpen },
    { href: `/admin/projekt/ny?customer=${customer.id}`, label: "Skapa projekt", icon: BriefcaseBusiness },
    { href: `/admin/fakturor/ny?customer=${customer.id}`, label: "Skapa faktura", icon: Receipt },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Fler alternativ"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/10 hover:text-bone"
      >
        <MoreHorizontal size={18} strokeWidth={2.25} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1.5 w-56 rounded-xl border border-bone/10 bg-forest p-1.5 shadow-xl"
        >
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-bone transition-colors hover:bg-bone/5"
            >
              <item.icon size={14} strokeWidth={2.25} />
              {item.label}
            </Link>
          ))}
          <div className="my-1 border-t border-bone/10" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              setEditOpen(true);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-bone transition-colors hover:bg-bone/5"
          >
            <Pencil size={14} strokeWidth={2.25} />
            Redigera kund
          </button>
        </div>
      )}

      <SlideOver open={editOpen} onClose={() => setEditOpen(false)} title="Redigera kund">
        <CustomerForm customer={customer} onSaved={() => setEditOpen(false)} onCancel={() => setEditOpen(false)} />
      </SlideOver>
    </div>
  );
}
