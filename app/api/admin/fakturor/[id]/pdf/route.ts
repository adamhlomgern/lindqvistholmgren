import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/dal";
import { getInvoiceById } from "@/lib/data/invoices";
import { renderInvoicePdf } from "@/lib/pdf/render";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Props) {
  await verifySession();
  const { id } = await params;

  const invoice = await getInvoiceById(id);
  if (!invoice) {
    return NextResponse.json({ error: "Fakturan kunde inte hittas." }, { status: 404 });
  }

  const pdf = await renderInvoicePdf(id);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="faktura-${invoice.invoiceNumber}.pdf"`,
    },
  });
}
