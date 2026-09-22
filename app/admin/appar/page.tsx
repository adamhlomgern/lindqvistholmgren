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
          className="flex items-center gap-1.5 text-sm font-medium text-stone transition-colors hover:text-bone"
        >
          <ArrowLeft size={15} strokeWidth={2} />
          Admin
        </Link>
        <form action={logout}>
          <button
            type="submit"
            aria-label="Logga ut"
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/5 hover:text-coral"
          >
            <LogOut size={15} strokeWidth={2} />
          </button>
        </form>
      </div>
      <h1 className="font-display text-2xl font-bold text-bone">Appar</h1>
      <p className="mt-1 text-sm text-stone">Interna verktyg, separata från resten av adminpanelen.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <Link
              key={app.href}
              href={app.href}
              className="group flex flex-col gap-3 rounded-2xl border border-bone/10 bg-bone/5 p-6 transition-colors hover:bg-bone/[0.08]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald/15 text-emerald">
                <Icon size={20} strokeWidth={2} />
              </span>
              <span>
                <span className="font-display text-lg font-bold text-bone">{app.name}</span>
                <p className="mt-1 text-sm text-stone">{app.description}</p>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
