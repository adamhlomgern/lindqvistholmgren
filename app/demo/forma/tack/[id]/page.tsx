import { SuccessView } from "@/features/forma/success/SuccessView";

export default async function FormaTackPage(props: PageProps<"/demo/forma/tack/[id]">) {
  const { id } = await props.params;
  return <SuccessView quoteRequestId={id} />;
}
