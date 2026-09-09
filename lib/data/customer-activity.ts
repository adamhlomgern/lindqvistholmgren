import type { CustomerMessage, MaterialItem } from "@/lib/types";

export type CustomerActivityEntry = {
  id: string;
  label: string;
  timestamp: string;
  href: string;
};

// A lightweight merged timeline built from data the Overview page already
// fetches (messages, materials) — no new table, no extra query. Capped
// short since this is a glance-at-it card, not a full history view.
export function buildCustomerActivity(
  customerId: string,
  messages: CustomerMessage[],
  materials: MaterialItem[],
  limit = 6,
): CustomerActivityEntry[] {
  const messageEntries: CustomerActivityEntry[] = messages.map((message) => ({
    id: `message-${message.id}`,
    label: message.authorRole === "admin" ? "Ni skrev ett meddelande" : `${message.authorLabel} skrev ett meddelande`,
    timestamp: message.createdAt,
    href: `/admin/kunder/${customerId}/meddelanden`,
  }));

  const materialEntries: CustomerActivityEntry[] = materials.map((material) => ({
    id: `material-${material.id}`,
    label: `"${material.title}" lades till i Material`,
    timestamp: material.createdAt,
    href: `/admin/kunder/${customerId}/material`,
  }));

  return [...messageEntries, ...materialEntries]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit);
}
