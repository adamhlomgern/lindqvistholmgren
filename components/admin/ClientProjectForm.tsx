"use client";

import { useActionState, useRef, useState, type ReactNode } from "react";
import { Plus, Upload, X } from "lucide-react";
import type { BillingEntity, ClientProjectStatus, ClientProjectWithCustomer, Customer } from "@/lib/types";
import { Select } from "@/components/ui/Select";
import {
  createClientProject,
  updateClientProject,
  type ClientProjectFormState,
} from "@/lib/actions/client-projects";

const inputClasses =
  "w-full rounded-lg border border-bone/10 bg-bone/5 px-4 py-3 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none disabled:opacity-50";
const selectClasses = "w-full rounded-lg px-4 py-3 text-sm";

const statusOptions: { value: ClientProjectStatus; label: string }[] = [
  { value: "planerat", label: "Planerat" },
  { value: "pagaende", label: "Pågående" },
  { value: "vantar_pa_kund", label: "Väntar på kund" },
  { value: "pausat", label: "Pausat" },
];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="block">
      <span className="block text-xs font-medium uppercase tracking-label text-stone">{label}</span>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5 border-t border-bone/10 pt-6 first:border-0 first:pt-0">
      <h2 className="font-display text-sm font-bold text-bone">{title}</h2>
      {children}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type ClientProjectFormProps = {
  project?: ClientProjectWithCustomer;
  customers: Customer[];
  billingEntities: BillingEntity[];
  onCancel?: () => void;
};

export function ClientProjectForm({ project, customers, billingEntities, onCancel }: ClientProjectFormProps) {
  const isEditing = Boolean(project);
  const action = isEditing ? updateClientProject.bind(null, project!.id) : createClientProject;
  const [state, formAction, pending] = useActionState<ClientProjectFormState, FormData>(action, undefined);

  const [customerId, setCustomerId] = useState(project?.customerId ?? "");
  const selectedCustomer = customers.find((customer) => customer.id === customerId);

  const [tasks, setTasks] = useState<string[]>([]);
  const [taskInput, setTaskInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  function addTask() {
    const trimmed = taskInput.trim();
    if (!trimmed) return;
    setTasks((prev) => [...prev, trimmed]);
    setTaskInput("");
  }

  function syncFileInput(next: File[]) {
    const dataTransfer = new DataTransfer();
    next.forEach((file) => dataTransfer.items.add(file));
    if (fileInputRef.current) fileInputRef.current.files = dataTransfer.files;
  }

  function addFiles(list: FileList | File[]) {
    const next = [...files, ...Array.from(list)];
    setFiles(next);
    syncFileInput(next);
  }

  function removeFile(index: number) {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    syncFileInput(next);
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Section title="Projekt">
        <Field label="Projektnamn">
          <input
            name="title"
            defaultValue={project?.title}
            required
            placeholder="T.ex. Ny logga till Kund AB"
            className={inputClasses}
          />
        </Field>
        <Field label={isEditing ? "Kund (valfritt)" : "Kund"}>
          <Select
            name="customerId"
            value={customerId}
            onValueChange={setCustomerId}
            required={!isEditing}
            placeholder="Välj kund…"
            className={selectClasses}
            options={customers.map((customer) => ({
              value: customer.id,
              label: customer.company ? `${customer.name} (${customer.company})` : customer.name,
            }))}
          />
          {selectedCustomer?.company && (
            <p className="mt-2 text-sm text-stone">Kontaktperson: {selectedCustomer.name}</p>
          )}
        </Field>
        <Field label="Projektöversikt">
          <textarea
            name="overview"
            defaultValue={project?.overview}
            rows={2}
            placeholder="Beskriv kort vad projektet går ut på…"
            className={inputClasses}
          />
        </Field>
      </Section>

      <Section title="Planering">
        <div className={`grid gap-5 ${isEditing ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
          {!isEditing && (
            <Field label="Status">
              <Select
                name="status"
                defaultValue="pagaende"
                className={selectClasses}
                options={statusOptions}
              />
            </Field>
          )}
          <Field label="Ansvarig (valfritt)">
            <Select
              name="assigneeEntityId"
              defaultValue={project?.assigneeEntityId}
              placeholder="Ingen vald"
              className={selectClasses}
              options={billingEntities.map((entity) => ({ value: entity.id, label: entity.name }))}
            />
          </Field>
          <Field label="Deadline (valfritt)">
            <input type="date" name="deadline" defaultValue={project?.deadline} className={inputClasses} />
          </Field>
        </div>
      </Section>

      {!isEditing && (
        <Section title="Att göra">
          <div>
            {tasks.length > 0 && (
              <div className="mb-3 flex flex-col gap-1">
                {tasks.map((task, index) => (
                  <div
                    key={`${task}-${index}`}
                    className="flex items-center gap-2.5 rounded-lg bg-bone/5 px-3 py-2 text-sm text-bone"
                  >
                    <span className="flex-1">{task}</span>
                    <button
                      type="button"
                      onClick={() => setTasks((prev) => prev.filter((_, i) => i !== index))}
                      aria-label={`Ta bort "${task}"`}
                      className="text-stone transition-colors hover:text-coral"
                    >
                      <X size={13} strokeWidth={2.25} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input type="hidden" name="tasks" value={JSON.stringify(tasks)} readOnly />
            <div className="flex items-center gap-2">
              <input
                value={taskInput}
                onChange={(event) => setTaskInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTask();
                  }
                }}
                placeholder="Lägg till punkt…"
                className={inputClasses}
              />
              <button
                type="button"
                onClick={addTask}
                disabled={!taskInput.trim()}
                aria-label="Lägg till punkt"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald text-charcoal transition-colors hover:bg-bone disabled:opacity-40"
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </Section>
      )}

      {!isEditing && (
        <Section title="Material">
          <div>
            {files.length > 0 && (
              <div className="mb-3 flex flex-col gap-1">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-2.5 rounded-lg bg-bone/5 px-3 py-2 text-sm text-bone"
                  >
                    <span className="min-w-0 flex-1 truncate">{file.name}</span>
                    <span className="shrink-0 text-xs text-stone">{formatBytes(file.size)}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      aria-label={`Ta bort ${file.name}`}
                      className="shrink-0 text-stone transition-colors hover:text-coral"
                    >
                      <X size={13} strokeWidth={2.25} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (event.dataTransfer.files.length > 0) addFiles(event.dataTransfer.files);
              }}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-bone/20 px-4 py-4 text-sm text-stone transition-colors hover:border-emerald/40 hover:text-bone"
            >
              <Upload size={16} strokeWidth={2.25} />
              Dra filer hit eller välj filer
              <input
                ref={fileInputRef}
                type="file"
                name="files"
                multiple
                className="hidden"
                onChange={(event) => {
                  if (event.target.files && event.target.files.length > 0) addFiles(event.target.files);
                }}
              />
            </label>
          </div>
        </Section>
      )}

      <Section title="Anteckningar">
        <textarea
          name="notes"
          defaultValue={project?.notes}
          rows={4}
          placeholder="Intern information, önskemål från kunden, saker att komma ihåg…"
          className={inputClasses}
        />
      </Section>

      <div className="flex items-center gap-3 border-t border-bone/10 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
        >
          {pending ? "Sparar…" : isEditing ? "Spara ändringar" : "Skapa projekt"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-medium text-stone transition-colors hover:text-bone"
          >
            Avbryt
          </button>
        )}
        {state?.error && <p className="text-sm text-coral">{state.error}</p>}
      </div>
    </form>
  );
}
