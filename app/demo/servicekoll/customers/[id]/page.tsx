import { CustomerDetailView } from "@/features/service-platform/components/CustomerDetailView";

export default async function ServicekollCustomerDetailPage(props: PageProps<"/demo/servicekoll/customers/[id]">) {
  const { id } = await props.params;
  return <CustomerDetailView customerId={id} />;
}
