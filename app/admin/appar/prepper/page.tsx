import { getNotebooks } from "@/lib/data/prepper";
import { NotebookSwitcher } from "@/components/prepper/NotebookSwitcher";

export default async function PrepperPage() {
  const notebooks = await getNotebooks();
  return <NotebookSwitcher notebooks={notebooks} />;
}
