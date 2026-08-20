import Link from "next/link";
import { ArrowUpRight, Briefcase, Mail, Newspaper } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Tag } from "@/components/ui/Tag";
import { getProjectsCount } from "@/lib/data/projects";
import { getArticlesCount } from "@/lib/data/articles";
import { getInquiriesCount, getRecentInquiries } from "@/lib/data/inquiries";
import { projectCategoryLabels } from "@/lib/constants";
import { MigrateButton } from "@/components/admin/MigrateButton";

export default async function AdminDashboardPage() {
  const [projectsCount, articlesCount, inquiriesCount, latestInquiries] = await Promise.all([
    getProjectsCount(),
    getArticlesCount(),
    getInquiriesCount(),
    getRecentInquiries(3),
  ]);
  const isEmpty = projectsCount === 0 && articlesCount === 0;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-bone">Översikt</h1>
      <p className="mt-1 text-sm text-stone">Hantera portfölj, artiklar och förfrågningar från ett ställe.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/projekt" className="group block">
          <GlassCard accent="emerald">
            <div className="flex items-center justify-between">
              <AccentBadge icon={Briefcase} accent="emerald" />
              <ArrowUpRight
                size={18}
                className="text-stone/60 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-emerald"
              />
            </div>
            <p className="mt-6 font-display text-3xl font-bold text-bone">{projectsCount}</p>
            <p className="mt-1 text-sm text-stone">Projekt</p>
          </GlassCard>
        </Link>
        <Link href="/admin/artiklar" className="group block">
          <GlassCard accent="sky">
            <div className="flex items-center justify-between">
              <AccentBadge icon={Newspaper} accent="sky" />
              <ArrowUpRight
                size={18}
                className="text-stone/60 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-sky"
              />
            </div>
            <p className="mt-6 font-display text-3xl font-bold text-bone">{articlesCount}</p>
            <p className="mt-1 text-sm text-stone">Artiklar</p>
          </GlassCard>
        </Link>
        <Link href="/admin/forfragningar" className="group block">
          <GlassCard accent="coral">
            <div className="flex items-center justify-between">
              <AccentBadge icon={Mail} accent="coral" />
              <ArrowUpRight
                size={18}
                className="text-stone/60 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-coral"
              />
            </div>
            <p className="mt-6 font-display text-3xl font-bold text-bone">{inquiriesCount}</p>
            <p className="mt-1 text-sm text-stone">Förfrågningar</p>
          </GlassCard>
        </Link>
      </div>

      {latestInquiries.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-bone">Senaste förfrågningar</h2>
            <Link href="/admin/forfragningar" className="text-xs font-medium text-emerald hover:underline">
              Visa alla
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {latestInquiries.map((inquiry) => (
              <Link
                key={inquiry.id}
                href="/admin/forfragningar"
                className="flex items-center justify-between rounded-2xl bg-bone/5 px-5 py-3 transition-colors hover:bg-bone/[0.08]"
              >
                <div>
                  <p className="text-sm font-medium text-bone">{inquiry.name}</p>
                  <p className="mt-0.5 text-xs text-stone">
                    {inquiry.categories.map((category) => projectCategoryLabels[category]).join(", ")}
                  </p>
                </div>
                <Tag>{new Date(inquiry.createdAt).toLocaleDateString("sv-SE")}</Tag>
              </Link>
            ))}
          </div>
        </div>
      )}

      {isEmpty && <MigrateButton />}
    </div>
  );
}
