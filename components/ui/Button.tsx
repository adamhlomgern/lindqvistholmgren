import { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-emerald text-charcoal hover:bg-bone",
  secondary: "bg-bone/10 text-bone hover:bg-bone/15",
  ghost: "text-bone hover:text-emerald",
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <a
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
