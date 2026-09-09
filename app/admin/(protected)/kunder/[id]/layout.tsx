import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getCustomerById } from "@/lib/data/customers";
import { getCustomerMemberStatusCounts } from "@/lib/data/customer-members";
import { CustomerWorkspaceHeader } from "@/components/admin/CustomerWorkspaceHeader";
import { CustomerTabs } from "@/components/admin/CustomerTabs";
import { BackLink } from "@/components/admin/BackLink";

type Props = { children: ReactNode; params: Promise<{ id: string }> };

export default async function CustomerWorkspaceLayout({ children, params }: Props) {
  const { id } = await params;
  const [customer, memberCounts] = await Promise.all([getCustomerById(id), getCustomerMemberStatusCounts(id)]);

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <BackLink href="/admin/kunder" label="Tillbaka till kunder" />
      <CustomerWorkspaceHeader customer={customer} memberCounts={memberCounts} />
      <div className="mt-6">
        <CustomerTabs customerId={customer.id} />
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
