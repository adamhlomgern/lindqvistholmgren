import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { serviceRoutes } from "@/features/service-platform/config/product";

export function LeadCta() {
  return (
    <Link
      href={serviceRoutes.contactCta()}
      className="flex items-center gap-1.5 rounded-full bg-demo-primary px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-demo-primary-hover"
    >
      <span className="hidden sm:inline">Vill ni ha detta för ert företag?</span>
      Prata med oss
      <ArrowUpRight size={13} />
    </Link>
  );
}
