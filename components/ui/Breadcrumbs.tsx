import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
  className?: string;
};

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Brödsmulor"
      className={`flex flex-wrap items-center gap-1.5 text-xs text-stone ${className}`}
    >
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight size={12} strokeWidth={2.5} />}
          {item.href ? (
            <Link href={item.href} className="hover:text-emerald">
              {item.label}
            </Link>
          ) : (
            <span className="truncate text-stone/70">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
