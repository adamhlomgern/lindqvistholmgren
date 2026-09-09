import Link from "next/link";
import { ArrowUpRight, File as FileIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { CustomerMaterial } from "@/lib/types";

export function CustomerMaterialsPreviewCard({
  customerId,
  materials,
}: {
  customerId: string;
  materials: CustomerMaterial[];
}) {
  const recent = materials.slice(0, 3);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-bone">
          Material {materials.length > 0 && <span className="text-stone">({materials.length})</span>}
        </h2>
        <Link
          href={`/admin/kunder/${customerId}/material`}
          className="flex items-center gap-1 text-xs font-medium text-emerald hover:underline"
        >
          Öppna material
          <ArrowUpRight size={12} />
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="mt-3 text-sm text-stone">Inget tillagt ännu.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-1.5">
          {recent.map((material) => (
            <div key={material.id} className="flex items-center gap-2 text-sm text-bone">
              <FileIcon size={13} className="shrink-0 text-stone" />
              <span className="truncate">{material.title}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
