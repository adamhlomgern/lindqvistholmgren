// Passed as ApprovalView's DecisionForm override in the admin "Kundvy"
// preview — same reason MessagesPanel takes a readOnly flag: the real
// decideApproval Server Action resolves the customer from the *session*,
// and an admin session isn't a customer, so letting this render the real
// form would just dead-end on submit.
export function ReadOnlyApprovalDecisionForm() {
  return (
    <p className="text-xs text-stone/60">
      Det här är en förhandsvisning — beslut går inte att skicka härifrån.
    </p>
  );
}
