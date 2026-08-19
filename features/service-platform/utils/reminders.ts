import type { Asset, Reminder, ReminderChannel } from "@/features/service-platform/types";
import { addDays } from "@/features/service-platform/utils/dates";

const REMINDER_RULES: { daysBefore: number; channel: ReminderChannel }[] = [
  { daysBefore: 60, channel: "email" },
  { daysBefore: 30, channel: "email" },
  { daysBefore: 14, channel: "sms" },
  { daysBefore: 7, channel: "sms" },
];

// Reminders are derived from next_service_date rather than stored, so they
// never fall out of sync when a service is registered and the date shifts.
export function getReminderTimeline(asset: Asset, today: Date = new Date()): Reminder[] {
  if (!asset.nextServiceDate) return [];
  const next = new Date(asset.nextServiceDate);

  return REMINDER_RULES.map((rule) => {
    const scheduledAt = addDays(next, -rule.daysBefore);
    return {
      id: `${asset.id}-${rule.daysBefore}`,
      assetId: asset.id,
      daysBefore: rule.daysBefore,
      channel: rule.channel,
      scheduledAt: scheduledAt.toISOString(),
      state: scheduledAt.getTime() <= today.getTime() ? "sent" : "scheduled",
    };
  });
}
