import type { Asset, AssetStatus } from "@/features/service-platform/types";
import { diffInDays } from "@/features/service-platform/utils/dates";

const STATUS_PRIORITY: Record<AssetStatus, number> = {
  overdue: 0,
  due_soon: 1,
  upcoming: 2,
  ok: 3,
  no_service_date: 4,
};

export function getAssetStatus(asset: Asset, today: Date = new Date()): AssetStatus {
  if (!asset.nextServiceDate) return "no_service_date";
  const diff = diffInDays(new Date(asset.nextServiceDate), today);
  if (diff < 0) return "overdue";
  if (diff <= 30) return "due_soon";
  if (diff <= 90) return "upcoming";
  return "ok";
}

export function statusPriority(status: AssetStatus): number {
  return STATUS_PRIORITY[status];
}

export const statusLabels: Record<AssetStatus, string> = {
  overdue: "Försenad",
  due_soon: "Snart",
  upcoming: "Kommande",
  ok: "OK",
  no_service_date: "Inget datum",
};
