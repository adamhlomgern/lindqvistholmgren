import { SavedConfigurationView } from "@/features/forma/configuration/SavedConfigurationView";

export default async function FormaKonfigurationPage(props: PageProps<"/demo/forma/konfiguration/[id]">) {
  const { id } = await props.params;
  return <SavedConfigurationView configurationId={id} />;
}
