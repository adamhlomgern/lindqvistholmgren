import type { CSSProperties } from "react";
import { accentHex, type Accent } from "@/lib/design/accents";

// lib/design/accents.ts's own badgeClasses/iconTextClasses are tuned for the
// dark marketing site (accent hue as text/border color against charcoal) —
// several of them (peach, lavender, sky, rose) are too pale to read as text
// on Bokad's light --color-demo-surface. color-mix against black gives a
// readable icon tint from the same hex on any background, the same trick
// GlassCard already uses for its glow (see components/ui/GlassCard.tsx).
export function orgAccentStyle(accent: Accent): { badge: CSSProperties; icon: CSSProperties } {
  const hex = accentHex[accent];
  return {
    badge: { backgroundColor: `${hex}29` },
    icon: { color: `color-mix(in srgb, ${hex} 60%, black)` },
  };
}
