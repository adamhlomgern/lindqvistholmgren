import { Shuffle, User } from "lucide-react";
import type { Staff } from "@/features/booking-platform/types";

// Sentinel for "no preference" — the customer doesn't pick a person, so the
// booking flow shows the union of every staff member's free slots and, on
// confirm, assigns whichever one is actually free at the chosen time (see
// SalonProfileClient). The Booking record itself always ends up with a real
// staffId for a staffed organization — this value never reaches state.
export const AUTO_STAFF = "auto" as const;

export function StaffPicker({
  staff,
  selectedStaffId,
  onSelect,
}: {
  staff: Staff[];
  selectedStaffId: string;
  onSelect: (staffId: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(AUTO_STAFF)}
        aria-pressed={selectedStaffId === AUTO_STAFF}
        className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
          selectedStaffId === AUTO_STAFF
            ? "border-demo-primary bg-demo-primary-soft text-demo-primary-soft-text"
            : "border-demo-border bg-demo-surface text-demo-text-muted hover:text-demo-text"
        }`}
      >
        <Shuffle size={14} />
        Första lediga
      </button>
      {staff.map((member) => {
        const active = member.id === selectedStaffId;
        return (
          <button
            key={member.id}
            type="button"
            onClick={() => onSelect(member.id)}
            aria-pressed={active}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
              active
                ? "border-demo-primary bg-demo-primary-soft text-demo-primary-soft-text"
                : "border-demo-border bg-demo-surface text-demo-text-muted hover:text-demo-text"
            }`}
          >
            <User size={14} />
            {member.name}
          </button>
        );
      })}
    </div>
  );
}
