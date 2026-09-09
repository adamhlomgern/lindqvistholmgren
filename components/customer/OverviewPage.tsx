import { CalendarClock, CheckCircle2, Mail, Phone, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { statusClasses, statusIcons, statusLabels } from "@/lib/project-status";
import { formatDateSv, formatRelativeSv } from "@/lib/format";
import type { BillingEntity, ClientProjectWithCustomer } from "@/lib/types";

type Props = {
  activeProjects: ClientProjectWithCustomer[];
  latestUpdate: ClientProjectWithCustomer | undefined;
  nextMilestone: ClientProjectWithCustomer | undefined;
  contact: BillingEntity | undefined;
};

export function OverviewPage({ activeProjects, latestUpdate, nextMilestone, contact }: Props) {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-bone">Vad händer nu?</h1>
      <p className="mt-1 text-sm text-stone">
        {activeProjects.length > 0
          ? `${activeProjects.length} ${activeProjects.length === 1 ? "aktivt projekt" : "aktiva projekt"} hos oss just nu.`
          : "Inga aktiva projekt just nu."}
      </p>

      <Card className="mt-8">
        <h2 className="font-display text-sm font-bold text-bone">Behöver din återkoppling</h2>
        <p className="mt-3 flex items-center gap-2 text-sm text-stone">
          <CheckCircle2 size={16} className="text-emerald" />
          Inget som väntar på dig just nu.
        </p>
      </Card>

      <h2 className="mt-8 font-display text-lg font-bold text-bone">Det här arbetar vi med</h2>
      <Card className="mt-4">
        {activeProjects.length === 0 ? (
          <p className="text-sm text-stone">Inget aktivt projekt just nu — hör av dig om ni vill starta något nytt.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {activeProjects.map((project) => {
              const StatusIcon = statusIcons[project.status];
              return (
                <div key={project.id} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-bone">{project.title}</p>
                    {project.assignee && <p className="text-xs text-stone">Ansvarig: {project.assignee.name}</p>}
                  </div>
                  <span
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusClasses[project.status]}`}
                  >
                    <StatusIcon size={12} strokeWidth={2.25} />
                    {statusLabels[project.status]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-bone">
            <AccentBadge icon={CalendarClock} accent="sky" boxSize="compact" size={14} />
            Nästa milstolpe
          </h3>
          {nextMilestone?.nextMilestoneLabel ? (
            <div className="mt-3">
              <p className="text-sm font-medium text-bone">{nextMilestone.nextMilestoneLabel}</p>
              <p className="mt-0.5 text-sm text-stone">
                {nextMilestone.nextMilestoneDate ? formatDateSv(nextMilestone.nextMilestoneDate) : nextMilestone.title}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-stone">Inget bestämt datum just nu.</p>
          )}
        </Card>

        <Card>
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-bone">
            <AccentBadge icon={Sparkles} accent="lavender" boxSize="compact" size={14} />
            Senaste uppdateringen
          </h3>
          {latestUpdate?.customerUpdate ? (
            <div className="mt-3">
              <p className="whitespace-pre-wrap text-sm text-bone">{latestUpdate.customerUpdate}</p>
              <p className="mt-2 text-xs text-stone/60">
                {latestUpdate.title}
                {latestUpdate.customerUpdateAt && ` · ${formatRelativeSv(latestUpdate.customerUpdateAt)}`}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-stone">Ingen uppdatering ännu.</p>
          )}
        </Card>
      </div>

      <h2 className="mt-8 font-display text-lg font-bold text-bone">Kontakt</h2>
      <Card className="mt-4">
        {contact?.email || contact?.phone ? (
          <div className="flex flex-col gap-1">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-bone/[0.06]"
              >
                <span className="flex items-center gap-2 text-sm text-bone">
                  <Mail size={14} className="text-stone/70" />
                  {contact.name}
                </span>
                <span className="text-sm text-stone">{contact.email}</span>
              </a>
            )}
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-bone/[0.06]"
              >
                <span className="flex items-center gap-2 text-sm text-bone">
                  <Phone size={14} className="text-stone/70" />
                  Ring oss
                </span>
                <span className="text-sm text-stone">{contact.phone}</span>
              </a>
            )}
          </div>
        ) : (
          <p className="text-sm text-stone">Ingen kontaktuppgift satt ännu.</p>
        )}
      </Card>
    </div>
  );
}
