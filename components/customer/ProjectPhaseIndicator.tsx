import { Check } from "lucide-react";
import { getPhaseSteps } from "@/lib/project-phase";
import type { ClientProject } from "@/lib/types";

type Props = { project: Pick<ClientProject, "phaseLabels" | "phaseCurrent"> };

// Text label always accompanies the dot — color/shape alone is a weak
// signal for anyone scanning quickly or color-blind (see the same
// reasoning on the status pills in lib/project-status.ts).
export function ProjectPhaseIndicator({ project }: Props) {
  const steps = getPhaseSteps(project);
  if (steps.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center gap-1.5">
          {index > 0 && <span className="h-px w-3 shrink-0 bg-bone/15" aria-hidden />}
          <span
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              step.state === "current"
                ? "bg-emerald/15 text-emerald"
                : step.state === "done"
                  ? "text-stone/70"
                  : "text-stone/40"
            }`}
          >
            {step.state === "done" ? (
              <Check size={11} strokeWidth={2.5} />
            ) : (
              <span
                className={`h-1.5 w-1.5 rounded-full ${step.state === "current" ? "bg-emerald" : "bg-stone/40"}`}
                aria-hidden
              />
            )}
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}
