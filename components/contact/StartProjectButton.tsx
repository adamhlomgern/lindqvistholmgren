"use client";

import { AnchorHTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useProjectInquiry } from "@/components/contact/ProjectInquiryContext";

type Variant = "primary" | "secondary" | "ghost";

type StartProjectButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

export function StartProjectButton({ children, onClick, ...props }: StartProjectButtonProps) {
  const { open } = useProjectInquiry();

  return (
    <Button
      href="/kontakt"
      onClick={(event) => {
        event.preventDefault();
        open();
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
