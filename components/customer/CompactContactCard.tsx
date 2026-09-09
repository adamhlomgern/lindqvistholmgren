import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { BillingEntity } from "@/lib/types";

// hrefBase defaults to the real portal's own prefix — the public demo
// passes its own subtree so "Skriv till" stays inside the demo.
type Props = { contact: BillingEntity | undefined; hrefBase?: string };

// One compact, personal contact point — the responsible person's name is
// already shown per project card, so this doesn't repeat it in a big block.
export function CompactContactCard({ contact, hrefBase = "/kund" }: Props) {
  if (!contact) {
    return (
      <Card>
        <p className="text-sm text-stone">Ingen kontaktuppgift satt ännu.</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald/15 text-sm font-bold text-emerald">
            {contact.name.trim().charAt(0).toUpperCase() || "?"}
          </span>
          <div>
            <p className="text-sm font-medium text-bone">{contact.name}</p>
            <p className="text-xs text-stone">Din kontakt hos oss</p>
          </div>
        </div>
        <Link
          href={`${hrefBase}/meddelanden`}
          className="flex items-center gap-1.5 rounded-full bg-emerald px-4 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-bone"
        >
          <MessageCircle size={13} strokeWidth={2.5} />
          Skriv till {contact.name.split(" ")[0]}
        </Link>
      </div>
      {(contact.email || contact.phone) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-bone/10 pt-3">
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-xs text-stone hover:text-bone">
              <Mail size={12} />
              {contact.email}
            </a>
          )}
          {contact.phone && (
            <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 text-xs text-stone hover:text-bone">
              <Phone size={12} />
              {contact.phone}
            </a>
          )}
        </div>
      )}
    </Card>
  );
}
