import type { AssetStatus } from "@/features/service-platform/types";
import { statusLabels } from "@/features/service-platform/utils/status";
import { Badge } from "@/components/demo/Badge";
import type { Tone } from "@/components/demo/tokens";

const statusTone: Record<AssetStatus, Tone> = {
  overdue: "danger",
  due_soon: "warning",
  upcoming: "info",
  ok: "primary",
  no_service_date: "neutral",
};

export function StatusBadge({ status }: { status: AssetStatus }) {
  return <Badge tone={statusTone[status]}>{statusLabels[status]}</Badge>;
}
