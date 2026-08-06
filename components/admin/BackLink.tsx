import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone transition-colors hover:text-emerald"
    >
      <ArrowLeft size={15} strokeWidth={2.25} />
      {label}
    </Link>
  );
}
