"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Eye, MoreHorizontal, Pencil } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { SlideOver } from "@/components/ui/SlideOver";
import { CustomerForm } from "@/components/admin/CustomerForm";
import { DeleteCustomerButton } from "@/components/admin/DeleteCustomerButton";
import { deleteCustomer } from "@/lib/actions/customers";
import type { Customer } from "@/lib/types";
import type { CustomerMemberStatusCounts } from "@/lib/data/customer-members";

function portalStatus(counts: CustomerMemberStatusCounts) {
  if (counts.active > 0) return { label: "Aktiv i portalen", tone: "text-emerald" };
  if (counts.invited > 0) return { label: "Inbjudan skickad", tone: "text-peach" };
  if (counts.revoked > 0) return { label: "Åtkomst återkallad", tone: "text-coral" };
  return { label: "Ingen inbjuden", tone: "text-stone" };
}

export function CustomerWorkspaceHeader({
  customer,
  memberCounts,
}: {
  customer: Customer;
  memberCounts: CustomerMemberStatusCounts;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const status = portalStatus(memberCounts);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="truncate font-display text-2xl font-bold text-bone">{customer.company || customer.name}</h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {customer.company && <p className="text-sm text-stone">{customer.name}</p>}
          <Tag className={status.tone}>{status.label}</Tag>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href={`/admin/kunder/${customer.id}/kundvy`}
          className="flex items-center gap-1.5 rounded-full border border-bone/15 px-3.5 py-2 text-xs font-medium text-bone transition-colors hover:bg-bone/10"
        >
          <Eye size={13} strokeWidth={2.25} />
          Förhandsgranska kundvy
        </Link>
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="flex items-center gap-1.5 rounded-full border border-bone/15 px-3.5 py-2 text-xs font-medium text-bone transition-colors hover:bg-bone/10"
        >
          <Pencil size={13} strokeWidth={2.25} />
          Redigera kund
        </button>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Fler alternativ"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/5 hover:text-bone"
          >
            <MoreHorizontal size={18} strokeWidth={2.25} />
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-20 mt-1.5 w-52 rounded-xl border border-bone/10 bg-forest p-1.5 shadow-xl"
            >
              <DeleteCustomerButton action={deleteCustomer.bind(null, customer.id)} customerName={customer.name} />
            </div>
          )}
        </div>
      </div>

      <SlideOver open={editOpen} onClose={() => setEditOpen(false)} title="Redigera kund">
        <CustomerForm customer={customer} onSaved={() => setEditOpen(false)} onCancel={() => setEditOpen(false)} />
      </SlideOver>
    </div>
  );
}
