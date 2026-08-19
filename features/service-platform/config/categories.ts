import type { AssetCategory } from "@/features/service-platform/types";

export const categoryLabels: Record<AssetCategory, string> = {
  vehicle: "Fordon",
  machine: "Maskin",
  heat_pump: "Värmepump",
  ventilation: "Ventilation",
  fire_safety: "Brandskydd",
  compressor: "Kompressor",
  other: "Övrigt",
};

export const categoryOptions: { value: AssetCategory; label: string }[] = (
  Object.keys(categoryLabels) as AssetCategory[]
).map((value) => ({ value, label: categoryLabels[value] }));
