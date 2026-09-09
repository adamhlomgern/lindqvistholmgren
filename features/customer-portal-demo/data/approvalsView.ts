import { buildDemoApprovals, demoItemsAlwaysVisible, demoItemsUnlockedOnDelivery, withDemoDownloadUrl } from "@/features/customer-portal-demo/data/seed";
import type { DemoApprovalStatus } from "@/features/customer-portal-demo/state/CustomerPortalDemoProvider";

// Not filtered by lock state — an approval must always be able to show the
// item it references, same principle as the real getMaterialItemById.
const allDemoItems = [...demoItemsAlwaysVisible, ...demoItemsUnlockedOnDelivery];

export function getDemoApprovalWithItem(
  approvalId: string,
  demo: { approvalStatus: DemoApprovalStatus; decisionNote?: string; decidedAt?: string },
) {
  const approval = buildDemoApprovals(demo).find((candidate) => candidate.id === approvalId);
  if (!approval) return null;

  const item = allDemoItems.find((candidate) => candidate.id === approval.materialItemId);
  if (!item) return null;

  return { ...approval, materialItem: withDemoDownloadUrl(item) };
}
