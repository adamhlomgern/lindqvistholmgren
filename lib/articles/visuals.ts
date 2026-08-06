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
import type { Accent } from "@/lib/design/accents";
import type { ArticleCategory } from "@/lib/data/categories";

export {
  accents,
  type Accent,
  badgeClasses,
  iconTextClasses,
  blobClasses,
  accentHex,
} from "@/lib/design/accents";

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
  "code-2": Code2,
  globe: Globe,
  megaphone: Megaphone,
};

const fallbackVisual: { icon: ArticleIconKey; accent: Accent } = { icon: "layers", accent: "emerald" };

// Categories are managed in /admin/kategorier and looked up by name here, so
// any list rendering categories (filter sidebar, article badges, admin
// pickers) shares the exact same icon+accent for a given category name.
export function resolveCategoryVisual(categories: ArticleCategory[], categoryName: string) {
  const match = categories.find((category) => category.name === categoryName);
  return match ? { icon: match.icon, accent: match.accent } : fallbackVisual;
}

export function getAccent(categories: ArticleCategory[], categoryName: string): Accent {
  return resolveCategoryVisual(categories, categoryName).accent;
}
