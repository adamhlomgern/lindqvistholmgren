import Image from "next/image";
import Link from "next/link";
import { Briefcase, Plus } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tag } from "@/components/ui/Tag";
import { getProjects } from "@/lib/data/projects";
import { accentForKey } from "@/lib/design/accents";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-bone">Projekt</h1>
          <p className="mt-1 text-sm text-stone">{projects.length} projekt i portföljen.</p>
        </div>
        <Link
          href="/admin/projekt/ny"
          className="flex items-center justify-center gap-1.5 self-start rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone"
        >
          <Plus size={16} strokeWidth={2.5} />
          Nytt projekt
        </Link>
      </div>
      {projects.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-bone/15 px-6 py-16 text-center">
          <Briefcase size={24} strokeWidth={2} className="text-stone" />
          <p className="text-sm text-stone">Inga projekt ännu.</p>
          <Link
            href="/admin/projekt/ny"
            className="mt-1 text-sm font-medium text-emerald hover:underline"
          >
            Skapa ditt första projekt
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const accent = accentForKey(project.category);
            return (
              <Link key={project.slug} href={`/admin/projekt/${project.slug}`} className="group block">
                <GlassCard accent={accent}>
                  <div className="relative -mx-6 -mt-6 mb-4 aspect-[16/10] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      quality={75}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <Tag className="self-start">{project.category}</Tag>
                  <h2 className="mt-4 font-display text-base font-bold text-bone">{project.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-stone">{project.summary}</p>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
