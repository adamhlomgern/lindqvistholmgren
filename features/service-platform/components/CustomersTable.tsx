import Link from "next/link";
import type { Asset, Customer } from "@/features/service-platform/types";
import { getAssetStatus } from "@/features/service-platform/utils/status";
import { serviceRoutes } from "@/features/service-platform/config/product";
import { HorizontalScroller } from "@/components/demo/HorizontalScroller";

type CustomersTableProps = {
  customers: Customer[];
  assets: Asset[];
};

function dueSoonCountFor(customer: Customer, assets: Asset[]): { total: number; dueSoon: number } {
  const customerAssets = assets.filter((asset) => asset.customerId === customer.id);
  const dueSoon = customerAssets.filter((asset) => {
    const status = getAssetStatus(asset);
    return status === "overdue" || status === "due_soon";
  }).length;
  return { total: customerAssets.length, dueSoon };
}

function CustomerCard({ customer, assets }: { customer: Customer; assets: Asset[] }) {
  const { total, dueSoon } = dueSoonCountFor(customer, assets);

  return (
    <Link
      href={serviceRoutes.assets({ customerId: customer.id })}
      className="block rounded-2xl border border-demo-border bg-demo-surface p-4 transition-colors hover:bg-demo-surface-hover"
    >
      <p className="font-medium text-demo-text">{customer.companyName ?? customer.name}</p>
      {customer.companyName && <p className="text-xs text-demo-text-muted">{customer.name}</p>}
      <div className="mt-2 text-sm text-demo-text-muted">
        {customer.phone && <p>{customer.phone}</p>}
        {customer.email && <p>{customer.email}</p>}
      </div>
      <div className="mt-3 flex items-center gap-4 text-sm text-demo-text-muted">
        <span>{total} objekt</span>
        <span className={dueSoon > 0 ? "font-medium text-demo-warning" : ""}>
          {dueSoon > 0 ? `${dueSoon} service snart` : "Inget snart"}
        </span>
      </div>
    </Link>
  );
}

export function CustomersTable({ customers, assets }: CustomersTableProps) {
  return (
    <>
      {/* A table that scrolls sideways is awkward to use on a phone, so
          mobile gets a stacked card list instead — same data, no horizontal
          scrolling required. */}
      <div className="flex flex-col gap-3 md:hidden">
        {customers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} assets={assets} />
        ))}
      </div>

      <div className="hidden md:block">
        <HorizontalScroller className="rounded-2xl border border-demo-border bg-demo-surface">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-demo-border text-left text-xs uppercase tracking-label text-demo-text-muted">
                <th className="px-4 py-3 font-medium">Kund</th>
                <th className="px-4 py-3 font-medium">Kontakt</th>
                <th className="px-4 py-3 font-medium">Objekt</th>
                <th className="px-4 py-3 font-medium">Service snart</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                const { total, dueSoon } = dueSoonCountFor(customer, assets);
                return (
                  <tr key={customer.id} className="border-b border-demo-border last:border-0 hover:bg-demo-surface-hover">
                    <td className="whitespace-nowrap px-4 py-3">
                      <Link href={serviceRoutes.assets({ customerId: customer.id })} className="block">
                        <span className="font-medium text-demo-text">{customer.companyName ?? customer.name}</span>
                        {customer.companyName && (
                          <span className="block text-xs text-demo-text-muted">{customer.name}</span>
                        )}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-demo-text-muted">
                      {customer.phone && <span className="block">{customer.phone}</span>}
                      {customer.email && <span className="block text-xs">{customer.email}</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-demo-text-muted">{total} st</td>
                    <td className="whitespace-nowrap px-4 py-3 text-demo-text-muted">
                      {dueSoon > 0 ? `${dueSoon} st` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </HorizontalScroller>
      </div>
    </>
  );
}
