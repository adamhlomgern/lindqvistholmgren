import { Dumbbell, Gem, Scissors, Smile, Sparkles, Waves, type LucideIcon } from "lucide-react";
import type { BusinessCategory } from "@/features/booking-platform/types";

export const categoryLabels: Record<BusinessCategory, string> = {
  frisor: "Frisör",
  skonhet: "Skönhet",
  massage: "Massage",
  pt: "PT",
  naglar: "Naglar",
  tandvard: "Tandvård",
};

export const categoryIcons: Record<BusinessCategory, LucideIcon> = {
  frisor: Scissors,
  skonhet: Sparkles,
  massage: Waves,
  pt: Dumbbell,
  naglar: Gem,
  tandvard: Smile,
};

export type CategoryOption = { value: BusinessCategory; label: string; icon: LucideIcon };

export const categoryOrder: BusinessCategory[] = ["frisor", "skonhet", "massage", "pt", "naglar", "tandvard"];

export const categoryOptions: CategoryOption[] = categoryOrder.map((value) => ({
  value,
  label: categoryLabels[value],
  icon: categoryIcons[value],
}));
