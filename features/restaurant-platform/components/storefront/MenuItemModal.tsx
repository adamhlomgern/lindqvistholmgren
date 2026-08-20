"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { Modal } from "@/components/demo/Modal";
import { Button } from "@/components/demo/Button";
import type { MenuItem, SelectedTopping } from "@/features/restaurant-platform/types";
import { formatSek } from "@/features/restaurant-platform/utils/format";

type SelectionState = Record<string, string[]>;

export function MenuItemModal({
  item,
  onClose,
  onAdd,
}: {
  item: MenuItem;
  onClose: () => void;
  onAdd: (input: { quantity: number; toppings: SelectedTopping[] }) => void;
}) {
  const [selections, setSelections] = useState<SelectionState>(() => {
    const initial: SelectionState = {};
    for (const group of item.toppingGroups) {
      if (group.required && !group.multiple) initial[group.id] = [group.options[0].id];
    }
    return initial;
  });
  const [quantity, setQuantity] = useState(1);

  const toppings = useMemo<SelectedTopping[]>(() => {
    const result: SelectedTopping[] = [];
    for (const group of item.toppingGroups) {
      const selectedIds = selections[group.id] ?? [];
      for (const optionId of selectedIds) {
        const option = group.options.find((candidate) => candidate.id === optionId);
        if (option) result.push({ groupId: group.id, optionId: option.id, name: option.name, priceDelta: option.priceDelta });
      }
    }
    return result;
  }, [item.toppingGroups, selections]);

  const unitPrice = item.price + toppings.reduce((sum, topping) => sum + topping.priceDelta, 0);
  const missingRequired = item.toppingGroups.some((group) => group.required && (selections[group.id]?.length ?? 0) === 0);

  function toggleOption(groupId: string, optionId: string, multiple: boolean, maxSelect?: number) {
    setSelections((prev) => {
      const current = prev[groupId] ?? [];
      if (!multiple) return { ...prev, [groupId]: [optionId] };
      if (current.includes(optionId)) {
        return { ...prev, [groupId]: current.filter((id) => id !== optionId) };
      }
      if (maxSelect && current.length >= maxSelect) return prev;
      return { ...prev, [groupId]: [...current, optionId] };
    });
  }

  return (
    <Modal open onClose={onClose} title={item.name}>
      {item.image && (
        <div className="relative -mx-6 -mt-6 mb-4 h-40 w-[calc(100%+3rem)] overflow-hidden">
          <Image src={item.image} alt="" fill sizes="448px" className="object-cover" />
        </div>
      )}
      <p className="text-sm text-demo-text-muted">{item.description}</p>

      <div className="mt-5 flex flex-col gap-5">
        {item.toppingGroups.map((group) => (
          <div key={group.id}>
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold text-demo-text">{group.name}</p>
              <p className="text-xs text-demo-text-faint">
                {group.required ? "Obligatoriskt" : group.multiple ? "Valfritt, flera möjliga" : "Valfritt"}
              </p>
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              {group.options.map((option) => {
                const checked = (selections[group.id] ?? []).includes(option.id);
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm transition-colors ${
                      checked ? "border-demo-primary bg-demo-primary-soft" : "border-demo-border hover:bg-demo-surface-hover"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type={group.multiple ? "checkbox" : "radio"}
                        name={group.id}
                        checked={checked}
                        onChange={() => toggleOption(group.id, option.id, group.multiple, group.maxSelect)}
                        className="accent-[var(--color-demo-primary)]"
                      />
                      <span className={checked ? "font-medium text-demo-primary-soft-text" : "text-demo-text"}>{option.name}</span>
                    </span>
                    {option.priceDelta > 0 && <span className="text-xs text-demo-text-muted">+{formatSek(option.priceDelta)}</span>}
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-demo-text">Antal</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-demo-border text-demo-text-muted hover:bg-demo-surface-hover"
              aria-label="Minska antal"
            >
              <Minus size={14} />
            </button>
            <span className="w-4 text-center text-sm font-semibold text-demo-text">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((value) => value + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-demo-border text-demo-text-muted hover:bg-demo-surface-hover"
              aria-label="Öka antal"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      <Button
        className="mt-6 w-full"
        disabled={missingRequired}
        onClick={() => {
          onAdd({ quantity, toppings });
          onClose();
        }}
      >
        Lägg i varukorg — {formatSek(unitPrice * quantity)}
      </Button>
    </Modal>
  );
}
