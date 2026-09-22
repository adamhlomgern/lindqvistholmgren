import { notFound } from "next/navigation";
import { getChecklistDetail, getChecklistsForNotebook, getNotebookById } from "@/lib/data/prepper";
import { ChecklistWorkspace } from "@/components/prepper/ChecklistWorkspace";
import { NewChecklistPrompt } from "@/components/prepper/NewChecklistPrompt";

type Props = {
  params: Promise<{ notebookId: string }>;
  searchParams: Promise<{ checklist?: string }>;
};

export default async function NotebookPage({ params, searchParams }: Props) {
  const { notebookId } = await params;
  const { checklist: checklistParam } = await searchParams;

  const [notebook, checklists] = await Promise.all([
    getNotebookById(notebookId),
    getChecklistsForNotebook(notebookId),
  ]);

  if (!notebook) notFound();

  if (checklists.length === 0) {
    return <NewChecklistPrompt notebookId={notebookId} notebookName={notebook.name} />;
  }

  const activeChecklistId = checklists.some((c) => c.id === checklistParam) ? checklistParam! : checklists[0].id;
  const checklistDetail = await getChecklistDetail(activeChecklistId);
  if (!checklistDetail) notFound();

  return (
    <ChecklistWorkspace
      notebookId={notebookId}
      notebookName={notebook.name}
      checklist={checklistDetail}
      checklists={checklists}
    />
  );
}
