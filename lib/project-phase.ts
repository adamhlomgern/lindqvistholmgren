import type { AwaitingCustomerType, ClientProject } from "@/lib/types";

export type PhaseStep = { label: string; state: "done" | "current" | "upcoming" };

// Turns a project's phaseLabels/phaseCurrent pair into a rendered sequence.
// Returns an empty array when phases aren't set up for this project — the
// indicator is opt-in, not every engagement type needs one.
export function getPhaseSteps(project: Pick<ClientProject, "phaseLabels" | "phaseCurrent">): PhaseStep[] {
  if (!project.phaseLabels || project.phaseLabels.length === 0) return [];
  const current = project.phaseCurrent ?? 0;
  return project.phaseLabels.map((label, index) => ({
    label,
    state: index < current ? "done" : index === current ? "current" : "upcoming",
  }));
}

export type MilestoneState = "planned" | "delivered" | "overdue" | "none";

// A passed date never gets silently upgraded to "delivered" — that has to
// be set explicitly (nextMilestoneDelivered) by the admin. Absent that, a
// passed date just means the plan needs revisiting.
export function getMilestoneState(
  project: Pick<ClientProject, "nextMilestoneLabel" | "nextMilestoneDate" | "nextMilestoneDelivered">,
): MilestoneState {
  if (!project.nextMilestoneLabel) return "none";
  if (project.nextMilestoneDelivered) return "delivered";
  const today = new Date().toISOString().slice(0, 10);
  if (project.nextMilestoneDate && project.nextMilestoneDate < today) return "overdue";
  return "planned";
}

export type AwaitingCustomerCta = { ctaLabel: string; href: (projectId: string) => string };

const awaitingCustomerCtas: Record<AwaitingCustomerType, AwaitingCustomerCta> = {
  material: { ctaLabel: "Ladda upp material", href: () => "/kund/material" },
  message: { ctaLabel: "Öppna meddelande", href: () => "/kund/meddelanden" },
  project: { ctaLabel: "Visa projekt", href: (projectId) => `/kund/projekt/${projectId}` },
};

export function getAwaitingCustomerCta(type: AwaitingCustomerType | undefined): AwaitingCustomerCta {
  return awaitingCustomerCtas[type ?? "project"];
}

// "Vem gör nästa steg?" — derived from status rather than a separate field,
// since "waiting on the customer" is already the project's status in
// practice (see lib/project-status.ts).
export function getNextStepOwnerLabel(status: ClientProject["status"]): string {
  return status === "vantar_pa_kund" ? "Vi behöver din återkoppling" : "Vi arbetar vidare";
}
