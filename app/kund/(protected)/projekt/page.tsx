import { verifyCustomerSession } from "@/lib/auth/customer";
import { getClientProjectsByCustomerId } from "@/lib/data/client-projects";
import { ProjectListRow } from "@/components/customer/ProjectListRow";
import { Card } from "@/components/ui/Card";

export default async function CustomerProjectsRoute() {
  const { customerId } = await verifyCustomerSession();
  const projects = await getClientProjectsByCustomerId(customerId);

  const active = projects.filter((project) => project.status !== "klar");
  const finished = projects.filter((project) => project.status === "klar");

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Projekt</h1>
      <p className="mt-1 text-sm text-fg-muted">Alla era projekt hos oss, pågående och avslutade.</p>

      <div className="mt-6 flex flex-col gap-3">
        {active.length === 0 ? (
          <Card>
            <p className="text-sm text-fg-muted">Inget aktivt projekt just nu.</p>
          </Card>
        ) : (
          active.map((project) => <ProjectListRow key={project.id} project={project} />)
        )}
      </div>

      {finished.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-sm font-semibold text-fg">Avslutade</h2>
          <div className="mt-3 flex flex-col gap-3">
            {finished.map((project) => (
              <ProjectListRow key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
