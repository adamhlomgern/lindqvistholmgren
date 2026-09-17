"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

export function ProjectFileUploadForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function handleUpload(file: File) {
    setPending(true);
    setError(undefined);

    const formData = new FormData();
    formData.set("projectId", projectId);
    formData.set("file", file);

    try {
      const response = await fetch("/api/admin/project-upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error ?? "Kunde inte ladda upp filen.");
        return;
      }
      router.refresh();
    } catch {
      setError("Kunde inte ladda upp filen.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-bone/20 px-4 py-4 text-sm text-stone transition-colors hover:border-emerald/40 hover:text-bone">
        <Upload size={16} strokeWidth={2.25} />
        {pending ? "Laddar upp…" : "Bifoga fil"}
        <input
          type="file"
          name="file"
          className="hidden"
          disabled={pending}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = "";
            if (file) void handleUpload(file);
          }}
        />
      </label>
      {error && <p className="text-sm text-coral">{error}</p>}
    </div>
  );
}
