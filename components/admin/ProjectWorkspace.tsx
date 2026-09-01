"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Pencil } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { BackLink } from "@/components/admin/BackLink";
import { ClientProjectForm } from "@/components/admin/ClientProjectForm";
import { ProjectStatusSelect } from "@/components/admin/ProjectStatusSelect";
import { DeleteClientProjectButton } from "@/components/admin/DeleteClientProjectButton";
import { NextStepCard } from "@/components/admin/NextStepCard";
import { ProjectFilesSection } from "@/components/admin/ProjectFilesSection";
import { ProjectChecklist } from "@/components/admin/ProjectChecklist";
import { NotesCard } from "@/components/admin/NotesCard";
import { ProjectInfoPanel } from "@/components/admin/ProjectInfoPanel";
import { ProjectActivityFeed } from "@/components/admin/ProjectActivityFeed";
import { deleteClientProject } from "@/lib/actions/client-projects";
import type {
  BillingEntity,
  ClientProjectWithCustomer,
  Customer,
  ProjectActivityEntry,
  ProjectChecklistItem,
  ProjectFile,
} from "@/lib/types";

type Props = {
  project: ClientProjectWithCustomer;
  customers: Customer[];
  billingEntities: BillingEntity[];
  files: (ProjectFile & { url: string | null })[];
  checklist: ProjectChecklistItem[];
  activity: ProjectActivityEntry[];
};

export function ProjectWorkspace({ project, customers, billingEntities, files, checklist, activity }: Props) {
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  return (
    <div>
      <BackLink href="/admin/projekt" label="Projekt" />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold text-bone">{project.title}</h1>
          <p className="mt-1 text-sm text-stone">
            {project.customer ? project.customer.company || project.customer.name : "Ingen kund kopplad"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ProjectStatusSelect projectId={project.id} status={project.status} />
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Fler alternativ"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/5 hover:text-bone"
            >
              <MoreHorizontal size={18} strokeWidth={2.25} />
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-20 mt-1.5 w-56 rounded-xl border border-bone/10 bg-forest p-1.5 shadow-xl"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setEditing(true);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-bone transition-colors hover:bg-bone/5"
                >
                  <Pencil size={14} strokeWidth={2.25} />
                  Redigera projektinfo
                </button>
                <div className="my-1 border-t border-bone/10" />
                <DeleteClientProjectButton
                  action={deleteClientProject.bind(null, project.id)}
                  projectTitle={project.title}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {editing ? (
        <Card className="mt-8 max-w-2xl">
          <ClientProjectForm
            project={project}
            customers={customers}
            billingEntities={billingEntities}
            onCancel={() => setEditing(false)}
          />
        </Card>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <NextStepCard projectId={project.id} nextStep={project.nextStep} />
            <ProjectFilesSection projectId={project.id} files={files} />
            <ProjectChecklist projectId={project.id} items={checklist} />
            <NotesCard notes={project.notes} onEdit={() => setEditing(true)} />
          </div>
          <div className="flex flex-col gap-6">
            <ProjectInfoPanel project={project} billingEntities={billingEntities} onEdit={() => setEditing(true)} />
          </div>
        </div>
      )}

      <ProjectActivityFeed activity={activity} />
    </div>
  );
}
