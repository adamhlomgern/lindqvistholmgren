import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock,
  GalleryHorizontalEnd,
  Hourglass,
  Mail,
  Newspaper,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { EntityRevenueBars } from "@/components/admin/EntityRevenueBars";
import { getProjectsCount } from "@/lib/data/projects";
import { getArticlesCount } from "@/lib/data/articles";
import { getInquiriesCount, getRecentInquiriesCount } from "@/lib/data/inquiries";
import { getCustomersCount } from "@/lib/data/customers";
import { getInvoiceStats, getRevenueByEntity, getMonthlyRevenue } from "@/lib/data/invoices";
import { getActiveClientProjectsCount, getProjectsWaitingOnCustomerCount } from "@/lib/data/client-projects";
import { getBillingEntities } from "@/lib/data/billing";
import { getRecentActivity } from "@/lib/data/activity";
import { formatCurrencySek, formatRelativeSv } from "@/lib/format";
import { iconTextClasses, type Accent } from "@/lib/design/accents";
import { RECENT_INQUIRY_WINDOW_DAYS } from "@/lib/constants";

export default async function AdminDashboardPage() {
  const [
    portfolioCount,
    articlesCount,
    inquiriesCount,
    customersCount,
    recentInquiriesCount,
    invoiceStats,
    revenueByEntity,
    monthlyRevenue,
    billingEntities,
    activity,
    activeProjectsCount,
    waitingOnCustomerCount,
  ] = await Promise.all([
    getProjectsCount(),
    getArticlesCount(),
    getInquiriesCount(),
    getCustomersCount(),
    getRecentInquiriesCount(RECENT_INQUIRY_WINDOW_DAYS),
    getInvoiceStats(),
    getRevenueByEntity(),
    getMonthlyRevenue(6),
    getBillingEntities(),
    getRecentActivity(6),
    getActiveClientProjectsCount(),
    getProjectsWaitingOnCustomerCount(),
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

  const skickadNotOverdue = invoiceStats.outstandingCount - invoiceStats.overdueCount;

  const actionItems: { href: string; accent: Accent; icon: LucideIcon; text: string }[] = [
    ...(invoiceStats.overdueCount > 0
      ? [
          {
            href: "/admin/fakturor",
            accent: "coral" as const,
            icon: AlertTriangle,
            text: `${invoiceStats.overdueCount} ${invoiceStats.overdueCount === 1 ? "förfallen faktura" : "förfallna fakturor"} väntar`,
          },
        ]
      : []),
    ...(skickadNotOverdue > 0
      ? [
          {
            href: "/admin/fakturor",
            accent: "sky" as const,
            icon: Clock,
            text: `${skickadNotOverdue} ${skickadNotOverdue === 1 ? "faktura" : "fakturor"} skickade, väntar på betalning`,
          },
        ]
      : []),
    ...(invoiceStats.draftCount > 0
      ? [
          {
            href: "/admin/fakturor",
            accent: "lavender" as const,
            icon: Hourglass,
            text: `${invoiceStats.draftCount} ${invoiceStats.draftCount === 1 ? "faktura" : "fakturor"} sparade som utkast`,
          },
        ]
      : []),
    ...(recentInquiriesCount > 0
      ? [
          {
            href: "/admin/forfragningar",
            accent: "emerald" as const,
            icon: Mail,
            text: `${recentInquiriesCount} ${recentInquiriesCount === 1 ? "ny förfrågan" : "nya förfrågningar"} senaste veckan`,
          },
        ]
      : []),
    ...(waitingOnCustomerCount > 0
      ? [
          {
            href: "/admin/projekt",
            accent: "peach" as const,
            icon: BriefcaseBusiness,
            text: `${waitingOnCustomerCount} projekt väntar på återkoppling från kund`,
          },
        ]
      : []),
  ];

  const subtitle =
    invoiceStats.overdueCount > 0
      ? `${invoiceStats.overdueCount} förfallna ${invoiceStats.overdueCount === 1 ? "faktura" : "fakturor"} behöver din uppmärksamhet.`
      : recentInquiriesCount > 0
        ? `${recentInquiriesCount} ${recentInquiriesCount === 1 ? "ny förfrågan" : "nya förfrågningar"} senaste veckan.`
        : waitingOnCustomerCount > 0
          ? `${waitingOnCustomerCount} projekt väntar på återkoppling från kund.`
          : invoiceStats.outstandingCount > 0
            ? `${invoiceStats.outstandingCount} ${invoiceStats.outstandingCount === 1 ? "faktura" : "fakturor"} väntar på betalning.`
            : "En snabb bild av verksamheten just nu.";

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-bone">Översikt</h1>
      <p className="mt-1 text-sm text-stone">{subtitle}</p>

      <Card className="mt-8">
        <h2 className="font-display text-sm font-bold text-bone">Att hantera</h2>
        {actionItems.length === 0 ? (
          <p className="mt-3 flex items-center gap-2 text-sm text-stone">
            <CheckCircle2 size={16} className="text-emerald" />
            Inget som kräver din uppmärksamhet just nu.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-1">
            {actionItems.map((item) => (
              <Link
                key={item.text}
                href={item.href}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-bone/[0.06]"
              >
                <span className="flex items-center gap-2.5 text-sm font-medium text-bone">
                  <item.icon size={16} className={iconTextClasses[item.accent]} />
                  {item.text}
                </span>
                <ChevronRight size={16} className="text-stone/50" />
              </Link>
            ))}
          </div>
        )}
      </Card>

      <h2 className="mt-8 font-display text-lg font-bold text-bone">Ekonomi</h2>
      <Card className="mt-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
          <EconomyStat
            icon={TrendingUp}
            accent="moss"
            label="Fakturerat i år"
            value={formatCurrencySek(invoiceStats.invoicedThisYear)}
          />
          <EconomyStat
            icon={CheckCircle2}
            accent="emerald"
            label="Betalt i år"
            value={formatCurrencySek(invoiceStats.paidThisYear)}
          />
          <EconomyStat
            icon={Clock}
            accent="sky"
            label="Utestående"
            value={formatCurrencySek(invoiceStats.outstandingAmount)}
            sub={invoiceStats.outstandingCount > 0 ? `${invoiceStats.outstandingCount} st` : undefined}
          />
          <EconomyStat
            icon={AlertTriangle}
            accent="coral"
            label="Förfallet"
            value={invoiceStats.overdueCount > 0 ? formatCurrencySek(invoiceStats.overdueAmount) : "Inga"}
            sub={invoiceStats.overdueCount > 0 ? `${invoiceStats.overdueCount} st` : undefined}
          />
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="font-display text-sm font-bold text-bone">Omsättning, senaste 6 månaderna</h3>
          <div className="mt-5">
            <RevenueChart data={monthlyRevenue} />
          </div>
        </Card>
        <Card>
          <h3 className="font-display text-sm font-bold text-bone">Verksamhet</h3>
          <div className="mt-4 flex flex-col gap-1">
            <VerksamhetRow
              href="/admin/projekt"
              icon={BriefcaseBusiness}
              accent="emerald"
              label="Projekt"
              count={activeProjectsCount}
            />
            <VerksamhetRow href="/admin/kunder" icon={Users} accent="lavender" label="Kunder" count={customersCount} />
            <VerksamhetRow href="/admin/artiklar" icon={Newspaper} accent="sky" label="Artiklar" count={articlesCount} />
            <VerksamhetRow
              href="/admin/forfragningar"
              icon={Mail}
              accent="coral"
              label="Förfrågningar"
              count={inquiriesCount}
            />
            <VerksamhetRow
              href="/admin/portfolio"
              icon={GalleryHorizontalEnd}
              accent="moss"
              label="Portfolio"
              count={portfolioCount}
            />
          </div>
          {revenueByEntity.length > 1 && (
            <div className="mt-5 border-t border-bone/10 pt-4">
              <h4 className="text-xs font-medium uppercase tracking-label text-stone">Omsättning per firma</h4>
              <div className="mt-3">
                <EntityRevenueBars data={revenueByEntity} colorByEntityId={colorByEntityId} />
              </div>
            </div>
          )}
        </Card>
      </div>

      {activity.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-bold text-bone">Senaste aktivitet</h2>
          <div className="mt-4 flex flex-col gap-1">
            {activity.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-bone/[0.08]"
              >
                <span className="text-sm text-bone">{item.label}</span>
                <span className="shrink-0 text-xs text-stone">{formatRelativeSv(item.timestamp)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EconomyStat({
  icon: Icon,
  accent,
  label,
  value,
  sub,
}: {
  icon: LucideIcon;
  accent: Accent;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <AccentBadge icon={Icon} accent={accent} boxSize="compact" size={14} />
      <div>
        <p className="font-display text-base font-bold text-bone sm:text-lg">{value}</p>
        <p className="text-xs text-stone">
          {label}
          {sub ? ` · ${sub}` : ""}
        </p>
      </div>
    </div>
  );
}

function VerksamhetRow({
  href,
  icon: Icon,
  accent,
  label,
  count,
}: {
  href: string;
  icon: LucideIcon;
  accent: Accent;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-bone/[0.06]"
    >
      <span className="flex items-center gap-2 text-sm text-bone">
        <Icon size={14} className={iconTextClasses[accent]} />
        {label}
      </span>
      <span className="flex items-center gap-1 text-sm font-semibold text-bone">
        {count}
        <ArrowUpRight
          size={12}
          className="text-stone/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </Link>
  );
}
