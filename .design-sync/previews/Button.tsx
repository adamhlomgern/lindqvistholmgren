import { ChevronRight } from "lucide-react";
import { Button } from "lindqvistholmgren-ui";

export function Primary() {
  return (
    <div className="bg-forest p-6">
      <Button href="/kontakt">
        Starta ett projekt
        <ChevronRight size={16} strokeWidth={2.5} />
      </Button>
    </div>
  );
}

export function Secondary() {
  return (
    <div className="bg-forest p-6">
      <Button href="/tjanster" variant="secondary">
        Se alla tjänster
        <ChevronRight size={16} strokeWidth={2.5} />
      </Button>
    </div>
  );
}

export function Ghost() {
  return (
    <div className="bg-forest p-6">
      <Button href="/portfolio" variant="ghost">
        Se vårt arbete
      </Button>
    </div>
  );
}
