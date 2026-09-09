import { Download, File as FileIcon, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { CustomerMaterial } from "@/lib/types";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MaterialsPanel({ materials }: { materials: (CustomerMaterial & { url: string | null })[] }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-bone">Material</h1>
      <p className="mt-1 text-sm text-stone">Filer och information ni kan behöva — logotyp, inloggningar och annat.</p>

      <Card className="mt-8">
        {materials.length === 0 ? (
          <p className="text-sm text-stone">Inget här ännu.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {materials.map((material) => (
              <div key={material.id} className="rounded-xl bg-bone/5 px-4 py-3.5">
                <p className="text-sm font-medium text-bone">{material.title}</p>
                {material.note && (
                  <p className="mt-1.5 flex items-start gap-1.5 whitespace-pre-wrap text-sm text-stone">
                    <Lock size={12} strokeWidth={2.25} className="mt-0.5 shrink-0 text-stone/60" />
                    {material.note}
                  </p>
                )}
                {material.filename && material.url && (
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-2 rounded-lg bg-bone/5 px-3 py-2 text-sm text-bone transition-colors hover:bg-bone/10"
                  >
                    <FileIcon size={14} className="shrink-0 text-stone" />
                    <span className="min-w-0 flex-1 truncate">{material.filename}</span>
                    {material.size !== undefined && (
                      <span className="shrink-0 text-xs text-stone">{formatBytes(material.size)}</span>
                    )}
                    <Download size={14} className="shrink-0 text-stone" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
