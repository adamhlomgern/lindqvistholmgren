import { Paperclip } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProjectFileUploadForm } from "@/components/admin/ProjectFileUploadForm";
import { DeleteProjectFileButton } from "@/components/admin/DeleteProjectFileButton";
import { FileThumb } from "@/components/admin/FileThumb";
import { deleteProjectFile } from "@/lib/actions/project-files";
import type { ProjectFile } from "@/lib/types";

export function ProjectFilesSection({
  projectId,
  files,
}: {
  projectId: string;
  files: (ProjectFile & { url: string | null })[];
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-bone">
          Filer {files.length > 0 && <span className="text-stone">({files.length})</span>}
        </h2>
      </div>

      {files.length === 0 ? (
        <div className="mt-3 flex flex-col items-center gap-2 rounded-xl border border-dashed border-bone/15 px-6 py-10 text-center">
          <Paperclip size={20} strokeWidth={2} className="text-stone" />
          <p className="text-sm text-stone">
            Lägg till referensmaterial, kundunderlag eller andra filer som hör till projektet.
          </p>
          <div className="mt-2 w-full max-w-xs">
            <ProjectFileUploadForm projectId={projectId} />
          </div>
        </div>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {files.map((file) => (
              <FileThumb
                key={file.id}
                filename={file.filename}
                contentType={file.contentType}
                url={file.url}
                action={
                  <DeleteProjectFileButton
                    action={deleteProjectFile.bind(null, projectId, file.id, file.storagePath, file.filename)}
                    filename={file.filename}
                  />
                }
              />
            ))}
          </div>
          <div className="mt-3">
            <ProjectFileUploadForm projectId={projectId} />
          </div>
        </>
      )}
    </Card>
  );
}
