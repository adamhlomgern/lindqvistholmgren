import { Check } from "lucide-react";

// Kort trygghetstext under knappar som leder till en förfrågan. Varje punkt
// ska vara sann för alla uppdrag (se allmänna villkor): svar inom 24 timmar,
// en offert innan något påbörjas och ingen bindning innan ni sagt ja.
export const reassurancePoints = ["Svar inom 24 timmar", "Offert innan vi börjar", "Ingen bindning"];

export function CtaReassurance({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg-muted ${className}`}>
      {reassurancePoints.map((point) => (
        <li key={point} className="flex items-center gap-1.5">
          <Check size={15} strokeWidth={2.5} className="shrink-0 text-check" />
          {point}
        </li>
      ))}
    </ul>
  );
}
