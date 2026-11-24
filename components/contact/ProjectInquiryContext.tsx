"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { ProjectInquiryModal } from "@/components/contact/ProjectInquiryModal";

type ProjectInquiryContextValue = {
  open: () => void;
  isOpen: boolean;
};

const ProjectInquiryContext = createContext<ProjectInquiryContextValue | null>(null);

export function ProjectInquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ProjectInquiryContext.Provider value={{ open: () => setIsOpen(true), isOpen }}>
      {children}
      <ProjectInquiryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
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
