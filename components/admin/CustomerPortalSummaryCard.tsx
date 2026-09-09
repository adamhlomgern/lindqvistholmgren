import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { CustomerMemberStatusCounts } from "@/lib/data/customer-members";

export function CustomerPortalSummaryCard({
  customerId,
  memberCounts,
}: {
  customerId: string;
  memberCounts: CustomerMemberStatusCounts;
}) {
  const { active, invited, revoked } = memberCounts;
  const total = active + invited + revoked;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-bone">Kundportal</h2>
        <Link
          href={`/admin/kunder/${customerId}/atkomst`}
          className="flex items-center gap-1 text-xs font-medium text-emerald hover:underline"
        >
          Öppna åtkomst
          <ArrowUpRight size={12} />
        </Link>
      </div>

      {total === 0 ? (
        <p className="mt-3 text-sm text-stone">Ingen kontaktperson inbjuden ännu.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-1 text-sm text-stone">
          {active > 0 && <p className="text-emerald">{active} aktiv{active === 1 ? "" : "a"}</p>}
          {invited > 0 && <p className="text-peach">{invited} inbjuden{invited === 1 ? "" : "a"}</p>}
          {revoked > 0 && <p className="text-coral">{revoked} återkallad{revoked === 1 ? "" : "e"}</p>}
        </div>
      )}
    </Card>
  );
}
