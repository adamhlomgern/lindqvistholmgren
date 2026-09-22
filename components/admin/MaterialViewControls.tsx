"use client";

import { LayoutGrid, Grid3x3, List } from "lucide-react";
import { Select } from "@/components/ui/Select";
import type { MaterialSortMode, MaterialViewMode } from "@/lib/material-view";

const sortOptions: { value: MaterialSortMode; label: string }[] = [
  { value: "custom", label: "Egen ordning" },
  { value: "name", label: "Namn" },
  { value: "created", label: "Senast tillagt" },
  { value: "updated", label: "Senast ändrat" },
  { value: "type", label: "Filtyp" },
];

const viewModes: { value: MaterialViewMode; label: string; Icon: typeof List }[] = [
  { value: "list", label: "Lista", Icon: List },
  { value: "grid-sm", label: "Små kort", Icon: Grid3x3 },
  { value: "grid-lg", label: "Stora kort", Icon: LayoutGrid },
];

type Props = {
  sortMode: MaterialSortMode;
  onSortModeChange: (mode: MaterialSortMode) => void;
  viewMode: MaterialViewMode;
  onViewModeChange: (mode: MaterialViewMode) => void;
};

export function MaterialViewControls({ sortMode, onSortModeChange, viewMode, onViewModeChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={sortMode}
        onValueChange={(value) => onSortModeChange(value as MaterialSortMode)}
        options={sortOptions}
        className="rounded-full px-3.5 py-2 text-xs"
      />
      <div className="flex items-center gap-0.5 rounded-full bg-bone/5 p-0.5">
        {viewModes.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => onViewModeChange(value)}
            aria-label={label}
            aria-pressed={viewMode === value}
            title={label}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              viewMode === value ? "bg-emerald text-charcoal" : "text-stone hover:text-bone"
            }`}
          >
            <Icon size={14} strokeWidth={2.25} />
          </button>
        ))}
      </div>
    </div>
  );
}
