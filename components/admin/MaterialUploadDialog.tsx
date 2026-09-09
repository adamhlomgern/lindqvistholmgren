"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Upload, X, XCircle } from "lucide-react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Select } from "@/components/ui/Select";
import { formatBytes } from "@/lib/format";
import type { MaterialDeliveryStatus, MaterialVisibility } from "@/lib/types";

const selectClasses = "w-full rounded-lg px-4 py-3 text-sm";

type Props = { open: boolean; onClose: () => void; customerId: string; folderId: string | null };

type FileStatus = "pending" | "uploading" | "done" | "error";
type FileEntry = { file: File; status: FileStatus; error?: string };

// Uploads through the /api/admin/material-upload Route Handler (not a
// server action — see that route's comment on the 1MB Server Action body
// cap this app never raised). Only failed entries are resubmitted on retry,
// so a partial failure never re-uploads (and duplicates) what already
// succeeded.
export function MaterialUploadDialog({ open, onClose, customerId, folderId }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [visibility, setVisibility] = useState<MaterialVisibility>("internal");
  const [deliveryStatus, setDeliveryStatus] = useState<MaterialDeliveryStatus>("draft");
  const [submitting, setSubmitting] = useState(false);

  function addFiles(list: FileList | File[]) {
    const next = Array.from(list).map((file): FileEntry => ({ file, status: "pending" }));
    setEntries((prev) => [...prev, ...next]);
  }

  function removeEntry(index: number) {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  async function upload(toUpload: { entry: FileEntry; index: number }[]) {
    if (toUpload.length === 0) return;
    setSubmitting(true);
    setEntries((prev) => prev.map((e) => (toUpload.some((t) => t.entry === e) ? { ...e, status: "uploading" } : e)));

    const formData = new FormData();
    formData.set("customerId", customerId);
    formData.set("folderId", folderId ?? "");
    formData.set("visibility", visibility);
    formData.set("deliveryStatus", deliveryStatus);
    toUpload.forEach(({ entry }) => formData.append("files", entry.file));

    try {
      const res = await fetch("/api/admin/material-upload", { method: "POST", body: formData });
      const body: { results?: { filename: string; ok: boolean; error?: string }[]; error?: string } = await res.json();
      if (!res.ok || !body.results) throw new Error(body.error ?? "Uppladdningen misslyckades.");

      setEntries((prev) =>
        prev.map((entry) => {
          const result = body.results!.find((r) => r.filename === entry.file.name);
          if (!result || entry.status !== "uploading") return entry;
          return result.ok ? { ...entry, status: "done" } : { ...entry, status: "error", error: result.error };
        }),
      );
      router.refresh();
    } catch (error) {
      setEntries((prev) =>
        prev.map((e) =>
          toUpload.some((t) => t.entry === e)
            ? { ...e, status: "error", error: error instanceof Error ? error.message : "Något gick fel." }
            : e,
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleUploadAll() {
    const toUpload = entries.map((entry, index) => ({ entry, index })).filter((e) => e.entry.status === "pending");
    upload(toUpload);
  }

  function handleRetry() {
    const toUpload = entries.map((entry, index) => ({ entry, index })).filter((e) => e.entry.status === "error");
    upload(toUpload);
  }

  function handleClose() {
    setEntries([]);
    onClose();
  }

  const hasPending = entries.some((e) => e.status === "pending");
  const hasError = entries.some((e) => e.status === "error");

  return (
    <SlideOver open={open} onClose={handleClose} title="Ladda upp">
      <div className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <span className="block text-xs font-medium uppercase tracking-label text-stone">Synlighet</span>
            <div className="mt-2">
              <Select
                value={visibility}
                onValueChange={(v) => setVisibility(v as MaterialVisibility)}
                className={selectClasses}
                options={[
                  { value: "internal", label: "Internt" },
                  { value: "shared", label: "Delat med kund" },
                ]}
              />
            </div>
          </div>
          <div>
            <span className="block text-xs font-medium uppercase tracking-label text-stone">Leveransstatus</span>
            <div className="mt-2">
              <Select
                value={deliveryStatus}
                onValueChange={(v) => setDeliveryStatus(v as MaterialDeliveryStatus)}
                className={selectClasses}
                options={[
                  { value: "draft", label: "Utkast" },
                  { value: "review", label: "För granskning" },
                  { value: "final", label: "Slutleverans" },
                ]}
              />
            </div>
          </div>
        </div>

        <label
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            if (event.dataTransfer.files.length > 0) addFiles(event.dataTransfer.files);
          }}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-bone/20 px-4 py-6 text-sm text-stone transition-colors hover:border-emerald/40 hover:text-bone"
        >
          <Upload size={16} strokeWidth={2.25} />
          Dra filer hit eller välj filer
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(event) => {
              if (event.target.files && event.target.files.length > 0) addFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </label>

        {entries.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {entries.map((entry, index) => (
              <div key={`${entry.file.name}-${index}`} className="flex items-center gap-2.5 rounded-lg bg-bone/5 px-3 py-2 text-sm">
                {entry.status === "done" && <CheckCircle2 size={14} className="shrink-0 text-emerald" />}
                {entry.status === "error" && <XCircle size={14} className="shrink-0 text-coral" />}
                {(entry.status === "pending" || entry.status === "uploading") && (
                  <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-bone/20" />
                )}
                <span className="min-w-0 flex-1 truncate text-bone">{entry.file.name}</span>
                <span className="shrink-0 text-xs text-stone">{formatBytes(entry.file.size)}</span>
                {entry.status === "error" && <span className="shrink-0 text-xs text-coral">{entry.error}</span>}
                {entry.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => removeEntry(index)}
                    aria-label={`Ta bort ${entry.file.name}`}
                    className="shrink-0 text-stone transition-colors hover:text-coral"
                  >
                    <X size={13} strokeWidth={2.25} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          {hasPending && (
            <button
              type="button"
              onClick={handleUploadAll}
              disabled={submitting}
              className="rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
            >
              {submitting ? "Laddar upp…" : "Ladda upp"}
            </button>
          )}
          {hasError && !hasPending && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={submitting}
              className="rounded-full bg-coral/15 px-5 py-2.5 text-sm font-semibold text-coral transition-colors hover:bg-coral/25 disabled:opacity-60"
            >
              Försök igen
            </button>
          )}
          <button type="button" onClick={handleClose} className="text-sm font-medium text-stone transition-colors hover:text-bone">
            {entries.length > 0 && entries.every((e) => e.status === "done") ? "Klar" : "Avbryt"}
          </button>
        </div>
      </div>
    </SlideOver>
  );
}
