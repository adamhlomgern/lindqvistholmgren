import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Mail,
  Newspaper,
  TrendingUp,
  Users,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Card } from "@/components/ui/Card";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Tag } from "@/components/ui/Tag";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { EntityRevenueBars } from "@/components/admin/EntityRevenueBars";
import { getProjectsCount } from "@/lib/data/projects";
import { getArticlesCount } from "@/lib/data/articles";
import { getInquiriesCount, getRecentInquiries } from "@/lib/data/inquiries";
import { getCustomersCount } from "@/lib/data/customers";
import { getInvoiceStats, getRevenueByEntity, getMonthlyRevenue } from "@/lib/data/invoices";
import { getBillingEntities } from "@/lib/data/billing";
import { formatCurrencySek } from "@/lib/format";
import { projectCategoryLabels } from "@/lib/constants";

export default async function AdminDashboardPage() {
  const [
    projectsCount,
    articlesCount,
    inquiriesCount,
    customersCount,
    latestInquiries,
    invoiceStats,
    revenueByEntity,
    monthlyRevenue,
    billingEntities,
  ] = await Promise.all([
    getProjectsCount(),
    getArticlesCount(),
    getInquiriesCount(),
    getCustomersCount(),
    getRecentInquiries(3),
    getInvoiceStats(),
    getRevenueByEntity(),
    getMonthlyRevenue(6),
    getBillingEntities(),
  ]);

  // Stable per-entity color assignment (not by revenue rank) — sorted by
  // creation date so a firma's color never shifts just because it had a
  // slower month. See EntityRevenueBars for the validated color pair.
  const colorByEntityId = new Map(
    billingEntities
      .slice()
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((entity, index) => [entity.id, index]),
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-bone">Översikt</h1>
      <p className="mt-1 text-sm text-stone">Hantera portfölj, artiklar, förfrågningar och kunder från ett ställe.</p>

      <h2 className="mt-10 font-display text-lg font-bold text-bone">Ekonomi</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard accent="moss">
          <AccentBadge icon={TrendingUp} accent="moss" />
          <p className="mt-6 font-display text-2xl font-bold text-bone">
            {formatCurrencySek(invoiceStats.invoicedThisYear)}
          </p>
          <p className="mt-1 text-sm text-stone">Fakturerat i år</p>
        </GlassCard>
        <GlassCard accent="emerald">
          <AccentBadge icon={CheckCircle2} accent="emerald" />
          <p className="mt-6 font-display text-2xl font-bold text-bone">
            {formatCurrencySek(invoiceStats.paidThisYear)}
          </p>
          <p className="mt-1 text-sm text-stone">Betalt i år</p>
        </GlassCard>
        <GlassCard accent="sky">
          <AccentBadge icon={Clock} accent="sky" />
          <p className="mt-6 font-display text-2xl font-bold text-bone">
            {formatCurrencySek(invoiceStats.outstandingAmount)}
          </p>
          <p className="mt-1 text-sm text-stone">
            Utestående{invoiceStats.outstandingCount > 0 ? ` · ${invoiceStats.outstandingCount} st` : ""}
          </p>
        </GlassCard>
        <GlassCard accent="coral">
          <AccentBadge icon={AlertTriangle} accent="coral" />
          <p className="mt-6 font-display text-2xl font-bold text-bone">
            {invoiceStats.overdueCount > 0 ? formatCurrencySek(invoiceStats.overdueAmount) : "Inga"}
          </p>
          <p className="mt-1 text-sm text-stone">
            Förfallet{invoiceStats.overdueCount > 0 ? ` · ${invoiceStats.overdueCount} st` : ""}
          </p>
        </GlassCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="font-display text-sm font-bold text-bone">Omsättning, senaste 6 månaderna</h3>
          <div className="mt-6">
            <RevenueChart data={monthlyRevenue} />
          </div>
        </Card>
        {revenueByEntity.length > 1 && (
          <Card>
            <h3 className="font-display text-sm font-bold text-bone">Per firma</h3>
            <div className="mt-6">
              <EntityRevenueBars data={revenueByEntity} colorByEntityId={colorByEntityId} />
            </div>
          </Card>
        )}
      </div>

      <h2 className="mt-10 font-display text-lg font-bold text-bone">Innehåll</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        <Link href="/admin/kunder" className="group block">
          <GlassCard accent="lavender">
            <div className="flex items-center justify-between">
              <AccentBadge icon={Users} accent="lavender" />
              <ArrowUpRight
                size={18}
                className="text-stone/60 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-lavender"
              />
            </div>
            <p className="mt-6 font-display text-3xl font-bold text-bone">{customersCount}</p>
            <p className="mt-1 text-sm text-stone">Kunder</p>
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
    </div>
  );
}
