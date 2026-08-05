import { Code2 } from "lucide-react";
import { Card } from "lindqvistholmgren-ui";

export function ServiceCard() {
  return (
    <div className="bg-forest p-6">
      <Card>
        <Code2 className="text-emerald" size={22} strokeWidth={2} />
        <h3 className="mt-4 font-display text-lg font-bold text-bone">Webb</h3>
        <p className="mt-2 text-sm leading-relaxed text-stone">
          Snabba, responsiva webbplatser byggda för att konvertera besökare till kunder.
        </p>
      </Card>
    </div>
  );
}

export function SimpleCard() {
  return (
    <div className="bg-forest p-6">
      <Card>
        <p className="text-sm leading-relaxed text-bone">
          Ett enkelt kort med valfritt innehåll — grundbyggstenen för tjänste-, projekt- och
          processkort i resten av sidan.
        </p>
      </Card>
    </div>
  );
}
