import { verifyCustomerSession } from "@/lib/auth/customer";
import { getCustomerById } from "@/lib/data/customers";
import { logoutCustomer } from "@/lib/actions/customer-auth";

// Platshållare för kundöversikten — ersätts i Etapp 1.3 ("Vad händer nu?")
// med behöver-återkoppling/status/milstolpe/senaste uppdatering/snabbåtkomst.
export default async function CustomerOverviewPage() {
  const { customerId } = await verifyCustomerSession();
  const customer = await getCustomerById(customerId);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-display text-2xl font-bold text-bone">Vad händer nu?</h1>
      <p className="text-sm text-stone">
        Inloggad som {customer?.company ?? customer?.name ?? "kund"}. Den fullständiga översikten byggs i nästa steg.
      </p>
      <form action={logoutCustomer} className="mt-4">
        <button type="submit" className="text-sm text-stone underline underline-offset-2 hover:text-bone">
          Logga ut
        </button>
      </form>
    </div>
  );
}
