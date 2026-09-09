"use client";

import { notFound } from "next/navigation";
import { ApprovalView } from "@/components/customer/ApprovalView";
import { DemoApprovalDecisionForm } from "@/features/customer-portal-demo/components/DemoApprovalDecisionForm";
import { useCustomerPortalDemo } from "@/features/customer-portal-demo/state/CustomerPortalDemoProvider";
import { getDemoApprovalWithItem } from "@/features/customer-portal-demo/data/approvalsView";
import { DEMO_PROJECT_ID } from "@/features/customer-portal-demo/data/seed";

export function DemoApprovalPage({ approvalId }: { approvalId: string }) {
  const demo = useCustomerPortalDemo();
  const approval = getDemoApprovalWithItem(approvalId, demo);
  if (!approval) notFound();

  return (
    <ApprovalView
      approval={approval}
      projectTitle="Ny visuell identitet för Glänta Trädgård"
      backHref={`/demo/kundportal/projekt/${DEMO_PROJECT_ID}`}
      DecisionForm={DemoApprovalDecisionForm}
    />
  );
}
