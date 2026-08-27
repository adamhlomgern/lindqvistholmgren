import { LeadDetail } from "@/features/forma/admin/LeadDetail";

export default async function FormaLeadPage(props: PageProps<"/demo/forma/forfragningar/[id]">) {
  const { id } = await props.params;
  return <LeadDetail leadId={id} />;
}
