import Image from "next/image";
import { partners } from "@/lib/data/partners";

export function LogoCarousel() {
  const track = [...partners, ...partners];

  return (
    <div className="border-y border-bone/5 bg-forest py-10">
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-8">
          {track.map((partner, i) => (
            <div key={`${partner.file}-${i}`} className="relative h-8 w-32 shrink-0">
              <Image
                src={`/images/logo/${partner.file}`}
                alt={partner.name}
                fill
                sizes="128px"
                className="object-contain opacity-70 transition-opacity hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
