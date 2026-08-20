import { StatsOverview } from "@/features/restaurant-platform/components/owner/StatsOverview";

export default function MumsaOwnerPage() {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h1 className="font-display text-xl font-bold text-demo-text">Statistik</h1>
        <p className="text-sm text-demo-text-muted">Ett snabbt läge på hur försäljningen går, beräknat från dagens ordrar.</p>
      </div>
      <StatsOverview />
    </div>
  );
}
