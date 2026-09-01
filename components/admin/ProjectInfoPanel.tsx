"use client";

import Link from "next/link";
import { useState, useTransition, type ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { formatDateSv } from "@/lib/format";
import { setProjectAssignee, setProjectDeadline } from "@/lib/actions/client-projects";
import type { BillingEntity, ClientProjectWithCustomer } from "@/lib/types";

const fieldSelectClasses = "w-full rounded-lg px-3 py-2 text-sm";
const fieldInputClasses =
  "w-full rounded-lg border border-bone/10 bg-bone/5 px-3 py-2 text-sm text-bone focus:border-emerald focus:outline-none";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <span className="text-xs font-medium uppercase tracking-label text-stone">{label}</span>
      <div className="mt-1 text-sm text-bone">{children}</div>
    </div>
  );
}

export function ProjectInfoPanel({
  project,
  billingEntities,
  onEdit,
}: {
  project: ClientProjectWithCustomer;
  billingEntities: BillingEntity[];
  onEdit: () => void;
}) {
  const [deadline, setDeadline] = useState(project.deadline ?? "");
  const [assigneeId, setAssigneeId] = useState(project.assigneeEntityId);
  const [, startTransition] = useTransition();

  const isOverdue = deadline && project.status !== "klar" && deadline < new Date().toISOString().slice(0, 10);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-bone">Projektinfo</h2>
        <button type="button" onClick={onEdit} className="text-xs font-medium text-emerald hover:underline">
          Redigera
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <Row label="Kund">
          {project.customer ? (
            <Link href={`/admin/kunder/${project.customer.id}`} className="hover:text-emerald hover:underline">
              {project.customer.company || project.customer.name}
            </Link>
          ) : (
            <span className="text-stone">Ingen kund kopplad</span>
          )}
        </Row>

        {project.customer?.company && (
          <Row label="Kontakt">
            <Link href={`/admin/kunder/${project.customer.id}`} className="hover:text-emerald hover:underline">
              {project.customer.name}
            </Link>
          </Row>
        )}

        <Row label="Deadline">
          <input
            type="date"
            value={deadline}
            onChange={(event) => {
              const value = event.target.value;
              setDeadline(value);
              startTransition(() => {
                setProjectDeadline(project.id, value);
              });
            }}
            className={`${fieldInputClasses} ${isOverdue ? "border-coral/40 text-coral" : ""}`}
          />
          {isOverdue && <p className="mt-1 text-xs font-medium text-coral">Försenad</p>}
        </Row>

        <Row label="Ansvarig">
          <Select
            value={assigneeId ?? ""}
            onValueChange={(value) => {
              setAssigneeId(value);
              const name = billingEntities.find((entity) => entity.id === value)?.name ?? "";
              startTransition(() => {
                setProjectAssignee(project.id, value, name);
              });
            }}
            placeholder="Ingen vald"
            className={fieldSelectClasses}
            options={billingEntities.map((entity) => ({ value: entity.id, label: entity.name }))}
          />
        </Row>

        <Row label="Skapad">{formatDateSv(project.createdAt)}</Row>
        <Row label="Senast ändrad">{formatDateSv(project.updatedAt)}</Row>
      </div>
    </Card>
  );
}
