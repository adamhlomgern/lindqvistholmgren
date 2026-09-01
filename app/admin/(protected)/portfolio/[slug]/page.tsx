import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getProjectBySlug, getProjectCategories } from "@/lib/data/projects";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { Card } from "@/components/ui/Card";
import { BackLink } from "@/components/admin/BackLink";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import { deleteProject } from "@/lib/actions/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EditPortfolioProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project, existingCategories] = await Promise.all([
    getProjectBySlug(slug),
    getProjectCategories(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div>
      <BackLink href="/admin/portfolio" label="Tillbaka till portfolio" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold text-bone">{project.title}</h1>
          <div className="mt-1.5 flex items-center gap-3 text-xs text-stone">
            <span>Redigera case</span>
            <Link
              href={`/projekt/${project.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald hover:underline"
            >
              Visa på sajten
              <ArrowUpRight size={12} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
        <DeleteProjectButton
          action={deleteProject.bind(null, project.slug)}
          projectTitle={project.title}
        />
      </div>
      <Card className="mt-8 max-w-2xl">
        <ProjectForm project={project} existingCategories={existingCategories} />
      </Card>
    </div>
  );
}
