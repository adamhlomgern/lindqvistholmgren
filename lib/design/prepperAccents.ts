import {
  Archive,
  Backpack,
  Baby,
  Bath,
  Bed,
  Bookmark,
  Camera,
  Clock,
  ClipboardList,
  Calendar,
  Coffee,
  DoorOpen,
  Gift,
  Heart,
  Home,
  Lamp,
  ListChecks,
  MapPin,
  Milk,
  Moon,
  Palette,
  Refrigerator,
  Shirt,
  ShoppingBag,
  Sofa,
  Sparkles,
  Star,
  Sun,
  Umbrella,
  Wallet,
  WashingMachine,
  type LucideIcon,
} from "lucide-react";

// Same pattern as lib/design/accents.ts for the main site: a small, fixed set
// of tokens rather than a free color picker (per the design audit — "kurerad
// palett, inte en fri color picker").
export const prepperAccentColors = [
  "rose",
  "clay",
  "sage",
  "oat",
  "lavender",
  "blue-grey",
  "burgundy",
  "graphite",
] as const;

export type PrepperAccentColor = (typeof prepperAccentColors)[number];

export const DEFAULT_PREPPER_ACCENT_COLOR: PrepperAccentColor = "burgundy";

export const prepperAccentBadgeClasses: Record<PrepperAccentColor, string> = {
  rose: "bg-prepper-swatch-rose/15 text-prepper-swatch-rose",
  clay: "bg-prepper-swatch-clay/15 text-prepper-swatch-clay",
  sage: "bg-prepper-swatch-sage/15 text-prepper-swatch-sage",
  oat: "bg-prepper-swatch-oat/15 text-prepper-swatch-oat",
  lavender: "bg-prepper-swatch-lavender/15 text-prepper-swatch-lavender",
  "blue-grey": "bg-prepper-swatch-blue-grey/15 text-prepper-swatch-blue-grey",
  burgundy: "bg-prepper-swatch-burgundy/15 text-prepper-swatch-burgundy",
  graphite: "bg-prepper-swatch-graphite/15 text-prepper-swatch-graphite",
};

export const prepperAccentSwatchClasses: Record<PrepperAccentColor, string> = {
  rose: "bg-prepper-swatch-rose",
  clay: "bg-prepper-swatch-clay",
  sage: "bg-prepper-swatch-sage",
  oat: "bg-prepper-swatch-oat",
  lavender: "bg-prepper-swatch-lavender",
  "blue-grey": "bg-prepper-swatch-blue-grey",
  burgundy: "bg-prepper-swatch-burgundy",
  graphite: "bg-prepper-swatch-graphite",
};

export const prepperAccentLabels: Record<PrepperAccentColor, string> = {
  rose: "Rose",
  clay: "Clay",
  sage: "Sage",
  oat: "Oat",
  lavender: "Lavendel",
  "blue-grey": "Blågrå",
  burgundy: "Burgundy",
  graphite: "Grafit",
};

export function isPrepperAccentColor(value: string | undefined): value is PrepperAccentColor {
  return !!value && (prepperAccentColors as readonly string[]).includes(value);
}

// Curated icon set — not the full Lucide library, so the picker stays fast
// to scan and every icon reads clearly at 18–20px. Grouped to match the
// audit's suggested picker categories.
export const DEFAULT_PREPPER_ICON = "Sparkles";

export const prepperIconCategories: { category: string; icons: { name: string; Icon: LucideIcon }[] }[] = [
  {
    category: "Baby",
    icons: [
      { name: "Baby", Icon: Baby },
      { name: "Milk", Icon: Milk },
      { name: "Bath", Icon: Bath },
      { name: "Shirt", Icon: Shirt },
      { name: "Moon", Icon: Moon },
      { name: "Heart", Icon: Heart },
      { name: "Backpack", Icon: Backpack },
    ],
  },
  {
    category: "Hem",
    icons: [
      { name: "Home", Icon: Home },
      { name: "Bed", Icon: Bed },
      { name: "Sofa", Icon: Sofa },
      { name: "Lamp", Icon: Lamp },
      { name: "WashingMachine", Icon: WashingMachine },
      { name: "Refrigerator", Icon: Refrigerator },
      { name: "DoorOpen", Icon: DoorOpen },
      { name: "Archive", Icon: Archive },
    ],
  },
  {
    category: "Planering",
    icons: [
      { name: "Calendar", Icon: Calendar },
      { name: "ListChecks", Icon: ListChecks },
      { name: "ClipboardList", Icon: ClipboardList },
      { name: "ShoppingBag", Icon: ShoppingBag },
      { name: "Wallet", Icon: Wallet },
      { name: "Clock", Icon: Clock },
      { name: "MapPin", Icon: MapPin },
      { name: "Bookmark", Icon: Bookmark },
    ],
  },
  {
    category: "Allmänt",
    icons: [
      { name: "Sparkles", Icon: Sparkles },
      { name: "Star", Icon: Star },
      { name: "Gift", Icon: Gift },
      { name: "Coffee", Icon: Coffee },
      { name: "Sun", Icon: Sun },
      { name: "Umbrella", Icon: Umbrella },
      { name: "Camera", Icon: Camera },
      { name: "Palette", Icon: Palette },
    ],
  },
];

// A plain Record (not a function call) so components can do a direct
// property/bracket lookup in JSX — `prepperIconMap[name]` — rather than
// calling a function to resolve the component reference, which the
// react-hooks/static-components lint rule flags as "created during render"
// even when the underlying lookup is stable.
export const prepperIconMap: Record<string, LucideIcon> = Object.fromEntries(
  prepperIconCategories.flatMap((group) => group.icons.map((icon) => [icon.name, icon.Icon])),
);
