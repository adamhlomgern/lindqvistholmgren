import { Mail, Phone } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Customer } from "@/lib/types";

export function CustomerContactCard({ customer }: { customer: Customer }) {
  const hasAddressDetails = customer.address || customer.postalCode || customer.city || customer.orgNumber;

  return (
    <Card>
      <h2 className="font-display text-sm font-bold text-bone">Kontaktuppgifter</h2>

      <div className="mt-3 flex flex-col gap-2.5">
        <p className="text-sm font-medium text-bone">{customer.name}</p>
        {customer.company && <p className="text-sm text-stone">{customer.company}</p>}
        {customer.email && (
          <a
            href={`mailto:${customer.email}`}
            className="flex items-center gap-2 text-sm text-stone transition-colors hover:text-emerald"
          >
            <Mail size={14} />
            {customer.email}
          </a>
        )}
        {customer.phone && (
          <a
            href={`tel:${customer.phone}`}
            className="flex items-center gap-2 text-sm text-stone transition-colors hover:text-emerald"
          >
            <Phone size={14} />
            {customer.phone}
          </a>
        )}
      </div>

      {hasAddressDetails && (
        <details className="mt-4 border-t border-bone/10 pt-3">
          <summary className="cursor-pointer text-xs font-medium uppercase tracking-label text-stone/70 hover:text-stone">
            Adress och org.nummer
          </summary>
          <div className="mt-2.5 flex flex-col gap-1 text-sm text-stone">
            {customer.address && <p>{customer.address}</p>}
            {(customer.postalCode || customer.city) && (
              <p>
                {customer.postalCode} {customer.city}
              </p>
            )}
            {customer.orgNumber && <p>Org.nr {customer.orgNumber}</p>}
          </div>
        </details>
      )}
    </Card>
  );
}
