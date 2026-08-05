import {
  Code2,
  GitCompare,
  Globe,
  Handshake,
  Layers,
  MapPin,
  Megaphone,
  MousePointerClick,
  Palette,
  PiggyBank,
  Search,
  ShoppingCart,
  TriangleAlert,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { ArticleIconKey } from "@/lib/types";

export const articleIcons: Record<ArticleIconKey, LucideIcon> = {
  wallet: Wallet,
  layers: Layers,
  "mouse-pointer-click": MousePointerClick,
  "git-compare": GitCompare,
  palette: Palette,
  search: Search,
  "triangle-alert": TriangleAlert,
  "shopping-cart": ShoppingCart,
  handshake: Handshake,
  "map-pin": MapPin,
  "piggy-bank": PiggyBank,
};

export const accents = ["emerald", "moss", "peach", "lavender", "coral", "sky", "rose"] as const;
export type Accent = (typeof accents)[number];

export const badgeClasses: Record<Accent, string> = {
  emerald: "bg-emerald/15 text-emerald",
  moss: "bg-moss/15 text-moss",
  peach: "bg-peach/15 text-peach",
  lavender: "bg-lavender/15 text-lavender",
  coral: "bg-coral/15 text-coral",
  sky: "bg-sky/15 text-sky",
  rose: "bg-rose/15 text-rose",
};

export const iconTextClasses: Record<Accent, string> = {
  emerald: "text-emerald",
  moss: "text-moss",
  peach: "text-peach",
  lavender: "text-lavender",
  coral: "text-coral",
  sky: "text-sky",
  rose: "text-rose",
};

export const blobClasses: Record<Accent, { big: string; small: string }> = {
  emerald: { big: "bg-emerald/25", small: "bg-emerald/15" },
  moss: { big: "bg-moss/25", small: "bg-moss/15" },
  peach: { big: "bg-peach/25", small: "bg-peach/15" },
  lavender: { big: "bg-lavender/25", small: "bg-lavender/15" },
  coral: { big: "bg-coral/25", small: "bg-coral/15" },
  sky: { big: "bg-sky/25", small: "bg-sky/15" },
  rose: { big: "bg-rose/25", small: "bg-rose/15" },
};

// Hex values matching the CSS custom properties in globals.css, for contexts
// (like generated OG images) that can't resolve Tailwind classes or CSS vars.
export const accentHex: Record<Accent, string> = {
  emerald: "#34d399",
  moss: "#4ca37a",
  peach: "#f5b87e",
  lavender: "#d7b4ea",
  coral: "#e28a87",
  sky: "#8ec5e8",
  rose: "#e8a0c0",
};

// Fixed per-category assignments (not cycled) so we can hand-pick which
// categories share a color — only Design/UX and WordPress/Rådgivning repeat,
// down from every pair repeating under a 5-color cycle across 9 categories.
export const categoryAccents: Record<string, Accent> = {
  Design: "peach",
  Utveckling: "sky",
  SEO: "emerald",
  WordPress: "lavender",
  "E-handel": "coral",
  Marknadsföring: "rose",
  Webb: "moss",
  UX: "peach",
  Rådgivning: "lavender",
};

export function getAccent(category: string): Accent {
  return categoryAccents[category] ?? "emerald";
}

// One fixed, meaningful icon per category.
export const categoryIcons: Record<string, LucideIcon> = {
  Design: Palette,
  Utveckling: Code2,
  SEO: Search,
  WordPress: Layers,
  "E-handel": ShoppingCart,
  Marknadsföring: Megaphone,
  Webb: Globe,
  UX: MousePointerClick,
  Rådgivning: Handshake,
};
