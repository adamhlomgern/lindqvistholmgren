import Link from "next/link";
import type { Asset, Customer } from "@/features/service-platform/types";
import { getAssetStatus } from "@/features/service-platform/utils/status";
import { formatRelativeSv } from "@/features/service-platform/utils/dates";
import { categoryLabels } from "@/features/service-platform/config/categories";
import { serviceRoutes } from "@/features/service-platform/config/product";
import { StatusBadge } from "@/features/service-platform/components/StatusBadge";

type AssetsTableProps = {
  assets: Asset[];
  customers: Customer[];
};

export function AssetsTable({ assets, customers }: AssetsTableProps) {
  const customerById = new Map(customers.map((customer) => [customer.id, customer]));

  return (
    <div className="overflow-x-auto rounded-2xl border border-demo-border bg-demo-surface">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-demo-border text-left text-xs uppercase tracking-label text-demo-text-muted">
            <th className="px-4 py-3 font-medium">Objekt</th>
            <th className="px-4 py-3 font-medium">Kund/ägare</th>
            <th className="px-4 py-3 font-medium">Nästa service</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => {
            const customer = asset.customerId ? customerById.get(asset.customerId) : undefined;
            return (
              <tr key={asset.id} className="border-b border-demo-border last:border-0 hover:bg-demo-surface-hover">
                <td className="px-4 py-3">
                  <Link href={serviceRoutes.asset(asset.id)} className="block">
                    <span className="font-medium text-demo-text">{asset.name}</span>
                    <span className="ml-2 text-xs text-demo-text-muted">
                      {asset.identifier ?? categoryLabels[asset.category]}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-demo-text-muted">{customer ? customer.name : "Internt"}</td>
                <td className="px-4 py-3 text-demo-text-muted">{formatRelativeSv(asset.nextServiceDate)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={getAssetStatus(asset)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
