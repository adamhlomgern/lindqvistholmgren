import { TrendingUp } from "lucide-react";
import type { Project } from "@/lib/types";

// Det första resultatet från ett case (t.ex. "+140 % förfrågningar"), lagt
// över case-bilden. Resultat säljer bättre än en beskrivning av vad vi gjort.
// Visas bara när caset faktiskt har siffror inlagda i admin.
export function ProjectResultBadge({ project, className = "" }: { project: Project; className?: string }) {
  const stat = project.stats?.[0];
  if (!stat) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-surface/95 py-1.5 pl-2 pr-3 text-[13px] text-fg shadow-raised ring-1 ring-line backdrop-blur ${className}`}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pine-100 text-pine-800">
        <TrendingUp size={12} strokeWidth={2.5} />
      </span>
      <span className="font-semibold">{stat.value}</span>
      <span className="text-fg-muted">{stat.label.toLowerCase()}</span>
    </span>
  );
}
