import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { GlassCard } from "@/components/ui/GlassCard";
import { getProjects } from "@/lib/data/projects";
import { accentForKey, iconTextClasses } from "@/lib/design/accents";

type RelatedProjectsProps = {
  currentSlug: string;
  category: string;
};

export async function RelatedProjects({ currentSlug, category }: RelatedProjectsProps) {
  const projects = await getProjects();
  const others = projects.filter((project) => project.slug !== currentSlug);
  const sameCategory = others.filter((project) => project.category === category);
  const rest = others.filter((project) => project.category !== category);
  const related = [...sameCategory, ...rest].slice(0, 3);

  if (related.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 border-t border-bone/10 pt-10">
      <h2 className="font-display text-xl font-bold text-bone">Fler projekt</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {related.map((project) => {
          const accent = accentForKey(project.category);
          return (
            <Link key={project.slug} href={`/projekt/${project.slug}`} className="group block">
              <GlassCard accent={accent} className="justify-between">
                <div>
                  <div className="relative -mx-6 -mt-6 mb-4 aspect-[4/3] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      quality={90}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <Tag>{project.category}</Tag>
                  <h3 className="mt-3 font-display text-sm font-bold leading-snug text-bone">
                    {project.title}
                  </h3>
                </div>
                <ArrowUpRight
                  className={`mt-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${iconTextClasses[accent]}`}
                  size={16}
                />
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
