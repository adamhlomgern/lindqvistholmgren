import { getCustomerMembers } from "@/lib/data/customer-members";
import { CustomerPortalAccess } from "@/components/admin/CustomerPortalAccess";

type Props = { params: Promise<{ id: string }> };

export default async function CustomerAccessTab({ params }: Props) {
  const { id } = await params;
  const members = await getCustomerMembers(id);

  return (
    <div className="max-w-xl">
      <CustomerPortalAccess customerId={id} members={members} />
    </div>
  );
}
