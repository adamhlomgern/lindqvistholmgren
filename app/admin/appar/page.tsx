import Link from "next/link";
import { ArrowLeft, Backpack, LogOut } from "lucide-react";
import { logout } from "@/lib/actions/auth";

const apps = [
  {
    href: "/admin/appar/prepper",
    name: "Prepper",
    description: "Arbetsböcker och checklistor för allt som ska förberedas.",
    icon: Backpack,
  },
];

export default function ApparPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft size={15} strokeWidth={2} />
          Admin
        </Link>
        <form action={logout}>
          <button
            type="submit"
            aria-label="Logga ut"
            className="flex h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-fg/5 hover:text-coral"
          >
            <LogOut size={15} strokeWidth={2} />
          </button>
        </form>
      </div>
      <h1 className="font-display text-2xl font-semibold text-fg">Appar</h1>
      <p className="mt-1 text-sm text-fg-muted">Interna verktyg, separata från resten av adminpanelen.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <Link
              key={app.href}
              href={app.href}
              className="group flex flex-col gap-3 rounded-2xl border border-line bg-fg/5 p-6 transition-colors hover:bg-fg/[0.08]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Icon size={20} strokeWidth={2} />
              </span>
              <span>
                <span className="font-display text-lg font-semibold text-fg">{app.name}</span>
                <p className="mt-1 text-sm text-fg-muted">{app.description}</p>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
