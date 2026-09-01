"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

export type SelectOption = { value: string; label: string; disabled?: boolean };

type SelectProps = {
  name?: string;
  options: SelectOption[];
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

// Native <select> popups are drawn by the OS/browser, not the page — no
// border-radius, no matching the app's dark theme reliably across browsers.
// Radix gives us a real, ordinary DOM node for the popup that we can style
// like anything else, while `name` still makes it participate in a plain
// <form action={...}> submission exactly like a native select would.
export function Select({
  name,
  options,
  placeholder = "Välj…",
  defaultValue,
  value,
  onValueChange,
  required,
  disabled,
  className = "",
}: SelectProps) {
  return (
    <RadixSelect.Root
      name={name}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      required={required}
      disabled={disabled}
    >
      <RadixSelect.Trigger
        className={`flex items-center justify-between gap-2 border border-bone/10 bg-bone/5 text-bone outline-none focus:border-emerald disabled:opacity-50 ${className}`}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ChevronDown size={15} strokeWidth={2.25} className="shrink-0 text-stone" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          className="z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-bone/10 bg-forest shadow-xl"
        >
          <RadixSelect.Viewport className="p-1.5">
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="relative flex cursor-pointer select-none items-center rounded-lg py-2.5 pl-8 pr-3 text-sm text-bone outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[highlighted]:bg-bone/10"
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
