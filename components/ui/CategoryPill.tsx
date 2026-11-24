import type { ReactNode } from "react";
import { pillClasses, type Accent } from "@/lib/design/accents";

// Färgad pill för kategorier (artiklar, projekt, admin-listor). Färgen kommer
// från kategorins accent, så samma kategori ser likadan ut överallt.
export function CategoryPill({
  accent,
  children,
  className = "",
}: {
  accent: Accent;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${pillClasses[accent]} ${className}`}
    >
      {children}
    </span>
  );
}
