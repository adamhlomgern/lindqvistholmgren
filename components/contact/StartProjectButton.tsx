"use client";

import { AnchorHTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useProjectInquiry } from "@/components/contact/ProjectInquiryContext";
import { trackConversion } from "@/lib/analytics";

type Variant = "primary" | "secondary" | "ghost" | "inverse";

type StartProjectButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  variant?: Variant;
  className?: string;
  // Var på sajten knappen sitter, t.ex. "hero" eller "header" — skickas med
  // till analytics så att vi ser vilka knappar som faktiskt används.
  trackingLocation?: string;
  children: ReactNode;
};

export function StartProjectButton({ children, onClick, trackingLocation = "okand", ...props }: StartProjectButtonProps) {
  const { open } = useProjectInquiry();

  return (
    <Button
      href="/kontakt"
      onClick={(event) => {
        event.preventDefault();
        trackConversion({ name: "cta_click", location: trackingLocation });
        open({ source: trackingLocation });
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
