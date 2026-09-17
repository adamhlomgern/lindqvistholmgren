import { Paperclip } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProjectFileUploadForm } from "@/components/admin/ProjectFileUploadForm";
import { DeleteProjectFileButton } from "@/components/admin/DeleteProjectFileButton";
import { MaterialVisibilityToggle } from "@/components/admin/MaterialVisibilityToggle";
import { FileThumb } from "@/components/admin/FileThumb";
import { deleteMaterialItem } from "@/lib/actions/material";
import type { MaterialItem } from "@/lib/types";

export function ProjectFilesSection({
  projectId,
  customerId,
  files,
}: {
  projectId: string;
  customerId?: string;
  files: (MaterialItem & { downloadUrl: string | null })[];
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
            {customerId
              ? "Lägg till referensmaterial, kundunderlag eller andra filer som hör till projektet. Filerna hamnar i kundens materialbibliotek och är interna tills du delar dem."
              : "Koppla en kund till projektet för att lägga till filer."}
          </p>
          {customerId && (
            <div className="mt-2 w-full max-w-xs">
              <ProjectFileUploadForm projectId={projectId} customerId={customerId} />
            </div>
          )}
        </div>
      ) : customerId ? (
        <>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {files.map((file) => (
              <FileThumb
                key={file.id}
                filename={file.filename ?? file.title}
                contentType={file.contentType}
                url={file.downloadUrl}
                badge={
                  <MaterialVisibilityToggle
                    customerId={customerId}
                    itemId={file.id}
                    visibility={file.visibility}
                    itemTitle={file.title}
                  />
                }
                action={
                  <DeleteProjectFileButton
                    action={deleteMaterialItem.bind(null, customerId, file.id, file.storagePath ?? null)}
                    filename={file.filename ?? file.title}
                  />
                }
              />
            ))}
          </div>
          <div className="mt-3">
            <ProjectFileUploadForm projectId={projectId} customerId={customerId} />
          </div>
        </>
      ) : (
        // Files uploaded before the project's customer link was cleared —
        // read-only until a customer is linked again (visibility/delete both
        // act on a customer's material library, so they need a customerId).
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {files.map((file) => (
            <FileThumb
              key={file.id}
              filename={file.filename ?? file.title}
              contentType={file.contentType}
              url={file.downloadUrl}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
