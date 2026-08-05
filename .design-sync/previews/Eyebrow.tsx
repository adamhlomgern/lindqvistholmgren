import { Hammer, Heart } from "lucide-react";
import { Eyebrow } from "lindqvistholmgren-ui";

export function Default() {
  return (
    <div className="bg-forest p-6">
      <Eyebrow icon={Hammer}>Under uppbyggnad</Eyebrow>
    </div>
  );
}

export function AboutVariant() {
  return (
    <div className="bg-forest p-6">
      <Eyebrow icon={Heart}>Om oss</Eyebrow>
    </div>
  );
}
