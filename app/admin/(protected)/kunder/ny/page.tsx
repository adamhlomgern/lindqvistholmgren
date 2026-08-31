import { CustomerForm } from "@/components/admin/CustomerForm";
import { Card } from "@/components/ui/Card";
import { BackLink } from "@/components/admin/BackLink";

export default function NewCustomerPage() {
  return (
    <div>
      <BackLink href="/admin/kunder" label="Tillbaka till kunder" />
      <h1 className="font-display text-2xl font-bold text-bone">Ny kund</h1>
      <Card className="mt-8 max-w-2xl">
        <CustomerForm />
      </Card>
    </div>
  );
}
