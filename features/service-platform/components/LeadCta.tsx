import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { serviceRoutes } from "@/features/service-platform/config/product";

export function LeadCta() {
  return (
    <Link
      href={serviceRoutes.contactCta()}
      title="Prata med oss"
      className="flex items-center gap-1.5 rounded-full bg-demo-primary px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-demo-primary-hover sm:px-3.5"
    >
      <span className="hidden md:inline">Vill ni ha detta för ert företag?</span>
      <span className="hidden sm:inline">Prata med oss</span>
      <ArrowUpRight size={13} />
    </Link>
  );
}
