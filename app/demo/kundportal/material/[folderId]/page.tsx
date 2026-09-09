import { DemoMaterialPage } from "@/features/customer-portal-demo/components/DemoMaterialPage";

export default async function KundportalDemoMaterialFolderPage(props: PageProps<"/demo/kundportal/material/[folderId]">) {
  const { folderId } = await props.params;
  return <DemoMaterialPage folderId={folderId} />;
}
