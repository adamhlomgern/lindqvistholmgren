import Link from "next/link";
import { formaRoutes } from "@/features/forma/config/product";

// Deliberately a quiet text link, not a solid pill — "Börja konfigurera" is
// the header's one primary CTA now; this shouldn't compete with it (see the
// brief: "Prata med oss kan fortfarande finnas men ska inte dominera").
export function LeadCta({ variant = "default" }: { variant?: "default" | "onPhoto" }) {
  return (
    <Link
      href={formaRoutes.contactCta()}
      title="Prata med oss"
      className={
        variant === "onPhoto"
          ? "hidden text-xs font-medium text-white/70 transition-colors hover:text-white sm:inline"
          : "hidden text-xs font-medium text-forma-text-faint transition-colors hover:text-forma-text-muted sm:inline"
      }
    >
      Prata med oss
    </Link>
  );
}
