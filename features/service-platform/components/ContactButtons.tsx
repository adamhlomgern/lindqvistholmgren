"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { ContactComposer } from "@/features/service-platform/components/ContactComposer";
import type { Asset, ContactChannel, Customer } from "@/features/service-platform/types";

const channels: { key: ContactChannel; label: string; icon: typeof Phone }[] = [
  { key: "call", label: "Ring", icon: Phone },
  { key: "sms", label: "Sms", icon: MessageSquare },
  { key: "email", label: "Mejl", icon: Mail },
];

// Ring / Sms / Mejl till kunden. "full" är knappar med text (objekt- och
// kundsidor), "icons" är små ikonknappar för tabellrader. Ikonerna markeras
// när kanalen redan använts för objektet.
export function ContactButtons({
  customer,
  asset,
  variant = "full",
  used,
}: {
  customer: Customer;
  asset?: Asset;
  variant?: "full" | "icons";
  used?: Partial<Record<ContactChannel, boolean>>;
}) {
  const [open, setOpen] = useState<ContactChannel | null>(null);

  return (
    <>
      <div className={variant === "full" ? "flex flex-wrap gap-2" : "flex items-center gap-1"}>
        {channels.map((c) =>
          variant === "full" ? (
            <button
              key={c.key}
              type="button"
              onClick={() => setOpen(c.key)}
              className="inline-flex items-center gap-1.5 rounded-full border border-demo-border bg-demo-surface px-4 py-2 text-sm font-semibold text-demo-text transition-colors hover:border-demo-primary hover:bg-demo-primary-soft hover:text-demo-primary-soft-text"
            >
              <c.icon size={15} />
              {c.label}
            </button>
          ) : (
            <button
              key={c.key}
              type="button"
              title={`${c.label} ${customer.name}`}
              aria-label={`${c.label} ${customer.name}`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setOpen(c.key);
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-demo-primary-soft hover:text-demo-primary-soft-text ${
                used?.[c.key] ? "text-demo-primary" : "text-demo-text-faint"
              }`}
            >
              <c.icon size={15} />
            </button>
          ),
        )}
      </div>
      {/* Portal + stopPropagation: knapparna sitter ofta i en klickbar rad
          eller länk, och klick i dialogen får inte navigera iväg. */}
      {open !== null &&
        createPortal(
          <div onClick={(event) => event.stopPropagation()}>
            <ContactComposer open onClose={() => setOpen(null)} channel={open} customer={customer} asset={asset} />
          </div>,
          document.body,
        )}
    </>
  );
}
