import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return <div className={`rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line ${className}`}>{children}</div>;
}
