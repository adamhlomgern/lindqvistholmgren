import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/demo/Card";
import { toneIconBgClasses, type Tone } from "@/components/demo/tokens";

type KpiCardProps = {
  icon: LucideIcon;
  label: string;
  value: number | string;
  tone?: Tone;
};

export function KpiCard({ icon: Icon, label, value, tone = "primary" }: KpiCardProps) {
  return (
    <Card padding="compact" className="flex flex-row items-start gap-3 sm:gap-4">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${toneIconBgClasses[tone]}`}>
        <Icon size={16} strokeWidth={2} />
      </span>
      <div>
        <p className="font-display text-2xl font-bold tracking-tight text-demo-text sm:text-3xl">{value}</p>
        <p className="mt-1 text-sm text-demo-text-muted">{label}</p>
      </div>
    </Card>
  );
}
