import { DemoProjectDetail } from "@/features/customer-portal-demo/components/DemoProjectDetail";

export default async function KundportalDemoProjectPage(props: PageProps<"/demo/kundportal/projekt/[id]">) {
  const { id } = await props.params;
  return <DemoProjectDetail projectId={id} />;
}
