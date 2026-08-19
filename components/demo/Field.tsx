import { ReactNode } from "react";

export const inputClass =
  "w-full rounded-lg border border-demo-border bg-demo-surface px-3 py-2 text-sm text-demo-text placeholder:text-demo-text-faint outline-none transition-colors focus:border-demo-primary focus:ring-1 focus:ring-demo-primary";

type FieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
};

export function Field({ label, htmlFor, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-demo-text-muted">
        {label}
        {required && <span className="text-demo-danger"> *</span>}
      </label>
      {children}
    </div>
  );
}
