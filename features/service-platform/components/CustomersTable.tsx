import Link from "next/link";
import type { Asset, Customer } from "@/features/service-platform/types";
import { getAssetStatus } from "@/features/service-platform/utils/status";
import { serviceRoutes } from "@/features/service-platform/config/product";

type CustomersTableProps = {
  customers: Customer[];
  assets: Asset[];
};

export function CustomersTable({ customers, assets }: CustomersTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-demo-border bg-demo-surface">
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
            const customerAssets = assets.filter((asset) => asset.customerId === customer.id);
            const dueSoonCount = customerAssets.filter((asset) => {
              const status = getAssetStatus(asset);
              return status === "overdue" || status === "due_soon";
            }).length;

            return (
              <tr key={customer.id} className="border-b border-demo-border last:border-0 hover:bg-demo-surface-hover">
                <td className="px-4 py-3">
                  <Link href={serviceRoutes.assets({ customerId: customer.id })} className="block">
                    <span className="font-medium text-demo-text">{customer.companyName ?? customer.name}</span>
                    {customer.companyName && <span className="block text-xs text-demo-text-muted">{customer.name}</span>}
                  </Link>
                </td>
                <td className="px-4 py-3 text-demo-text-muted">
                  {customer.phone && <span className="block">{customer.phone}</span>}
                  {customer.email && <span className="block text-xs">{customer.email}</span>}
                </td>
                <td className="px-4 py-3 text-demo-text-muted">{customerAssets.length} st</td>
                <td className="px-4 py-3 text-demo-text-muted">{dueSoonCount > 0 ? `${dueSoonCount} st` : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
