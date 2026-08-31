import Link from "next/link";
import { Building2, Mail, Phone, Plus, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { getCustomers } from "@/lib/data/customers";

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-bone">Kunder</h1>
          <p className="mt-1 text-sm text-stone">{customers.length} kunder registrerade.</p>
        </div>
        <Link
          href="/admin/kunder/ny"
          className="flex items-center justify-center gap-1.5 self-start rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone"
        >
          <Plus size={16} strokeWidth={2.5} />
          Ny kund
        </Link>
      </div>

      {customers.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-bone/15 px-6 py-16 text-center">
          <Users size={24} strokeWidth={2} className="text-stone" />
          <p className="text-sm text-stone">Inga kunder ännu.</p>
          <Link href="/admin/kunder/ny" className="mt-1 text-sm font-medium text-emerald hover:underline">
            Lägg till din första kund
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {customers.map((customer) => (
            <Link key={customer.id} href={`/admin/kunder/${customer.id}`} className="block">
              <Card className="transition-colors hover:bg-bone/[0.08]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-bold text-bone">{customer.name}</p>
                    {customer.company && (
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-stone">
                        <Building2 size={13} strokeWidth={2.25} />
                        {customer.company}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-stone">
                    {customer.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail size={13} strokeWidth={2.25} />
                        {customer.email}
                      </span>
                    )}
                    {customer.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={13} strokeWidth={2.25} />
                        {customer.phone}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
