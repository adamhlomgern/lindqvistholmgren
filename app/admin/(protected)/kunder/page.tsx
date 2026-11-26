import Link from "next/link";
import { Plus } from "lucide-react";
import { getCustomerListRows } from "@/lib/data/customer-list";
import { CustomerListing } from "@/components/admin/CustomerListing";

export default async function AdminCustomersPage() {
  const rows = await getCustomerListRows();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-fg">Kunder</h1>
          <p className="mt-1 text-sm text-fg-muted">{rows.length} kunder registrerade.</p>
        </div>
        <Link
          href="/admin/kunder/ny"
          className="flex items-center justify-center gap-1.5 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
        >
          <Plus size={16} strokeWidth={2.5} />
          Ny kund
        </Link>
      </div>

      <CustomerListing rows={rows} />
    </div>
  );
}
