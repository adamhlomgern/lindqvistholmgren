"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, type LucideIcon } from "lucide-react";

export type ActionMenuItem = {
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  destructive?: boolean;
};

// Always-visible ⋯ trigger — not hover-gated. A previous version hid
// rename/delete behind opacity-0 + group-hover, which worked on desktop but
// left touch devices with no way to discover or reach the buttons at all.
// One small, permanently-tappable trigger that reveals a menu solves both
// the "too many admin icons on every row" problem and the mobile-hover
// problem in a single move.
export function ActionMenu({ items, ariaLabel = "Fler alternativ" }: { items: ActionMenuItem[]; ariaLabel?: string }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-prepper-text-muted transition-colors hover:bg-prepper-surface-soft hover:text-prepper-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prepper-focus"
        >
          <MoreHorizontal size={16} strokeWidth={2} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[190px] rounded-xl border border-prepper-border bg-prepper-surface p-1.5 shadow-lg focus:outline-none"
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenu.Item
                key={item.label}
                onSelect={item.onSelect}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium outline-none transition-colors data-[highlighted]:bg-prepper-surface-soft ${
                  item.destructive ? "text-prepper-primary" : "text-prepper-text"
                }`}
              >
                <Icon size={14} strokeWidth={2} />
                {item.label}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
