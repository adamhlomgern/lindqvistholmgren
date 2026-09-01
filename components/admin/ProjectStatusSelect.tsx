"use client";

import { useState, useTransition } from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { setClientProjectStatus } from "@/lib/actions/client-projects";
import { statusLabels, statusClasses } from "@/lib/project-status";
import type { ClientProjectStatus } from "@/lib/types";

const statusOptions = (Object.keys(statusLabels) as ClientProjectStatus[]).map((value) => ({
  value,
  label: statusLabels[value],
}));

// Not built on the shared <Select> — that component hardcodes a border and
// background on its trigger for form fields, which would fight this pill's
// per-status color classes over which utility wins in the compiled CSS
// (source order in the className string doesn't decide that). A dedicated
// Radix instance keeps the trigger's classes fully ours to control.
export function ProjectStatusSelect({ projectId, status }: { projectId: string; status: ClientProjectStatus }) {
  const [value, setValue] = useState(status);
  const [, startTransition] = useTransition();

  return (
    <RadixSelect.Root
      value={value}
      onValueChange={(next) => {
        const nextStatus = next as ClientProjectStatus;
        setValue(nextStatus);
        startTransition(() => {
          setClientProjectStatus(projectId, nextStatus);
        });
      }}
    >
      <RadixSelect.Trigger
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium outline-none transition-colors ${statusClasses[value]}`}
      >
        <RadixSelect.Value />
        <RadixSelect.Icon>
          <ChevronDown size={13} strokeWidth={2.25} />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-bone/10 bg-forest shadow-xl"
        >
          <RadixSelect.Viewport className="p-1.5">
            {statusOptions.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className="relative flex cursor-pointer select-none items-center rounded-lg py-2.5 pl-8 pr-3 text-sm text-bone outline-none data-[highlighted]:bg-bone/10"
              >
                <RadixSelect.ItemIndicator className="absolute left-2.5 inline-flex items-center">
                  <Check size={14} strokeWidth={2.5} className="text-emerald" />
                </RadixSelect.ItemIndicator>
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
