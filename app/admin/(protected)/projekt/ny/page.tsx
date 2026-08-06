import { ProjectForm } from "@/components/admin/ProjectForm";
import { Card } from "@/components/ui/Card";
import { BackLink } from "@/components/admin/BackLink";
import { getProjectCategories } from "@/lib/data/projects";

export default async function NewProjectPage() {
  const existingCategories = await getProjectCategories();

  return (
    <div>
      <BackLink href="/admin/projekt" label="Tillbaka till projekt" />
      <h1 className="font-display text-2xl font-bold text-bone">Nytt projekt</h1>
      <Card className="mt-8 max-w-2xl">
        <ProjectForm existingCategories={existingCategories} />
      </Card>
    </div>
  );
}
