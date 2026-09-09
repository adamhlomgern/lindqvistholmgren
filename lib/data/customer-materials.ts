import type { CustomerMaterial } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { tryDecryptText } from "@/lib/crypto/secrets";

const BUCKET = "attachments";
// Long enough to cover one page view; regenerated on every request since
// this is deliberately uncached.
const SIGNED_URL_TTL_SECONDS = 60 * 60;

type CustomerMaterialRow = {
  id: string;
  customer_id: string;
  title: string;
  note: string | null;
  filename: string | null;
  content_type: string | null;
  size: number | null;
  storage_path: string | null;
  created_at: string;
};

function toCustomerMaterial(row: CustomerMaterialRow): CustomerMaterial {
  return {
    id: row.id,
    customerId: row.customer_id,
    title: row.title,
    note: row.note ? tryDecryptText(row.note) : undefined,
    filename: row.filename ?? undefined,
    contentType: row.content_type ?? undefined,
    size: row.size ?? undefined,
    storagePath: row.storage_path ?? undefined,
    createdAt: row.created_at,
  };
}

// Deliberately uncached: signed URLs expire, and items can be added or
// removed at any time.
export async function getCustomerMaterials(
  customerId: string,
): Promise<(CustomerMaterial & { url: string | null })[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("customer_materials")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getCustomerMaterials] Supabase-fråga misslyckades", error);
    return [];
  }

  return Promise.all(
    (data ?? []).map(async (row) => {
      const material = toCustomerMaterial(row);
      if (!material.storagePath) return { ...material, url: null };
      const { data: signed } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(material.storagePath, SIGNED_URL_TTL_SECONDS);
      return { ...material, url: signed?.signedUrl ?? null };
    }),
  );
}
