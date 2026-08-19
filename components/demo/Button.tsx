import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-demo-primary text-white hover:bg-demo-primary-hover",
  secondary: "border border-demo-border bg-demo-surface text-demo-text hover:bg-demo-surface-hover",
  ghost: "text-demo-text-muted hover:text-demo-text",
};

export function Button({ variant = "primary", type = "button", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
