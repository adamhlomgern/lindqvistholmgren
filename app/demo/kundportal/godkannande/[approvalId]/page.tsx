import { DemoApprovalPage } from "@/features/customer-portal-demo/components/DemoApprovalPage";

export default async function KundportalDemoApprovalPage(props: PageProps<"/demo/kundportal/godkannande/[approvalId]">) {
  const { approvalId } = await props.params;
  return <DemoApprovalPage approvalId={approvalId} />;
}
