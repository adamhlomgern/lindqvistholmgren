import { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "inverse";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

// primary: fylld i tonens primärfärg (grön på ljust, vit på tone-pine).
// secondary: kantlinje, fylls lätt vid hover. ghost: bara text.
// inverse: nästan svart, för när grönt redan finns runt omkring.
const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-on-primary shadow-card hover:bg-primary-hover",
  secondary: "bg-surface text-fg ring-1 ring-inset ring-line-strong hover:bg-surface-sunken hover:ring-ink-400",
  ghost: "text-fg hover:bg-fg/5",
  inverse: "bg-fg text-canvas hover:bg-ink-800",
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <a
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-medium transition-[background-color,box-shadow,transform] duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
