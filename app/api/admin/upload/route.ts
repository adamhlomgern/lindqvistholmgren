import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};
const MAX_FILE_SIZE = 8 * 1024 * 1024;

export async function POST(request: NextRequest) {
  await verifySession();

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Ingen fil vald" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Filen är för stor (max 8 MB)" }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];

  if (!extension) {
    return NextResponse.json(
      { error: "Filtypen stöds inte. Använd JPG, PNG, WEBP, AVIF eller GIF." },
      { status: 400 },
    );
  }
  const path = `${crypto.randomUUID()}.${extension}`;

  const supabase = createServiceRoleClient();
  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("media").getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl });
}
