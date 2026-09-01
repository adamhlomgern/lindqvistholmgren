"use client";

import { useActionState } from "react";
import { Upload } from "lucide-react";
import { uploadProjectFile, type ProjectFileFormState } from "@/lib/actions/project-files";

export function ProjectFileUploadForm({ projectId }: { projectId: string }) {
  const action = uploadProjectFile.bind(null, projectId);
  const [state, formAction, pending] = useActionState<ProjectFileFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-bone/20 px-4 py-4 text-sm text-stone transition-colors hover:border-emerald/40 hover:text-bone">
        <Upload size={16} strokeWidth={2.25} />
        {pending ? "Laddar upp…" : "Bifoga fil"}
        <input
          type="file"
          name="file"
          className="hidden"
          disabled={pending}
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
        />
      </label>
      {state?.error && <p className="text-sm text-coral">{state.error}</p>}
    </form>
  );
}
