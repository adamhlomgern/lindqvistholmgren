"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { ProjectInquiryModal } from "@/components/contact/ProjectInquiryModal";

// source = vilken knapp/vilket verktyg som öppnade formuläret (sparas på
// förfrågan, se lib/inquiries/sources.ts).
export type InquiryPrefill = { description?: string; company?: string; source?: string };

type ProjectInquiryContextValue = {
  // Med prefill öppnas "Snabbt meddelande" med texten redan ifylld, t.ex.
  // från Sajtbyggaren.
  open: (prefill?: InquiryPrefill) => void;
  isOpen: boolean;
};

const ProjectInquiryContext = createContext<ProjectInquiryContextValue | null>(null);

export function ProjectInquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<InquiryPrefill | undefined>(undefined);
  const [openCount, setOpenCount] = useState(0);

  function open(next?: InquiryPrefill) {
    setPrefill(next);
    setOpenCount((n) => n + 1);
    setIsOpen(true);
  }

  return (
    <ProjectInquiryContext.Provider value={{ open, isOpen }}>
      {children}
      <ProjectInquiryModal key={openCount} isOpen={isOpen} prefill={prefill} onClose={() => setIsOpen(false)} />
    </ProjectInquiryContext.Provider>
  );
}

export function useProjectInquiry() {
  const context = useContext(ProjectInquiryContext);
  if (!context) {
    throw new Error("useProjectInquiry must be used within a ProjectInquiryProvider");
  }
  return context;
}
