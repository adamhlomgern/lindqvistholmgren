import { AssetDetailView } from "@/features/service-platform/components/AssetDetailView";

export default async function ServicekollAssetDetailPage(props: PageProps<"/demo/servicekoll/assets/[id]">) {
  const { id } = await props.params;
  return <AssetDetailView assetId={id} />;
}
