// Satisfies ApprovalView's injectable DecisionForm slot for the admin
// "Visa som kund" preview — a pending approval must never be decidable from
// here, or an admin click could record a decision as if the customer made
// it. Same reasoning as the demo site's DemoApprovalDecisionForm override.
export function ReadOnlyApprovalDecisionForm() {
  return (
    <p className="text-sm text-stone">
      Förhandsvisning — beslutet kan bara fattas av kunden i deras egen portal.
    </p>
  );
}
