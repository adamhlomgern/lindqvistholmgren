"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getInvoiceById } from "@/lib/data/invoices";
import { renderInvoicePdf } from "@/lib/pdf/render";
import { getSmtpTransport } from "@/lib/email/client";
import { getBillingEntityById, getDefaultBillingEntity, getDefaultBankAccount } from "@/lib/data/billing";
import { formatCurrencySek } from "@/lib/format";
import type { InvoiceStatus } from "@/lib/types";

export type InvoiceFormState = { error?: string } | undefined;
export type SendInvoiceState = { error?: string; success?: boolean } | undefined;

type ItemInput = { description: string; quantity: number; unitPrice: number };

function parseItems(raw: string): ItemInput[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((item) => ({
      description: String((item as ItemInput)?.description ?? "").trim(),
      quantity: Number((item as ItemInput)?.quantity),
      unitPrice: Number((item as ItemInput)?.unitPrice),
    }))
    .filter((item) => item.description && Number.isFinite(item.quantity) && item.quantity > 0 && Number.isFinite(item.unitPrice));
}

function computeTotals(items: ItemInput[], momsRate: number) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vatAmount = subtotal * (momsRate / 100);
  const total = subtotal + vatAmount;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

export async function createInvoice(
  _prevState: InvoiceFormState,
  formData: FormData,
): Promise<InvoiceFormState> {
  await verifySession();

  const customerId = String(formData.get("customerId") ?? "").trim();
  let billingEntityId = String(formData.get("billingEntityId") ?? "").trim();
  let bankAccountId = String(formData.get("bankAccountId") ?? "").trim();
  const paymentLink = String(formData.get("paymentLink") ?? "").trim() || null;
  const momsRate = Number(formData.get("momsRate") ?? 25);
  const dueDate = String(formData.get("dueDate") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const items = parseItems(String(formData.get("items") ?? "[]"));

  if (!customerId) {
    return { error: "Välj en kund." };
  }
  if (items.length === 0) {
    return { error: "Lägg till minst en rad." };
  }
  if (!billingEntityId) {
    billingEntityId = (await getDefaultBillingEntity())?.id ?? "";
  }
  if (!bankAccountId) {
    bankAccountId = (await getDefaultBankAccount())?.id ?? "";
  }
  if (!billingEntityId || !bankAccountId) {
    return { error: "Lägg till minst en firma och ett bankkonto under Inställningar innan du skapar en faktura." };
  }

  const { subtotal, vatAmount, total } = computeTotals(items, momsRate);
  const supabase = createServiceRoleClient();

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      customer_id: customerId,
      billing_entity_id: billingEntityId,
      bank_account_id: bankAccountId,
      payment_link: paymentLink,
      moms_rate: momsRate,
      subtotal,
      vat_amount: vatAmount,
      total,
      due_date: dueDate,
      notes,
    })
    .select("id")
    .single();

  if (invoiceError) {
    return { error: `Kunde inte skapa fakturan: ${invoiceError.message}` };
  }

  const { error: itemsError } = await supabase.from("invoice_items").insert(
    items.map((item, index) => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      position: index,
    })),
  );

  if (itemsError) {
    // Compensating delete — no multi-statement transaction available from
    // the service-role client, so this keeps an insert failure from leaving
    // a totals-less invoice behind.
    await supabase.from("invoices").delete().eq("id", invoice.id);
    return { error: `Kunde inte spara fakturarader: ${itemsError.message}` };
  }

  revalidatePath("/admin/fakturor");
  revalidatePath(`/admin/kunder/${customerId}`);
  redirect(`/admin/fakturor/${invoice.id}`);
}

export async function updateInvoice(
  id: string,
  _prevState: InvoiceFormState,
  formData: FormData,
): Promise<InvoiceFormState> {
  await verifySession();

  const current = await getInvoiceById(id);
  if (!current) {
    return { error: "Fakturan kunde inte hittas." };
  }
  if (current.status !== "utkast") {
    return { error: "Fakturan är redan skickad och kan inte ändras." };
  }

  const billingEntityId = String(formData.get("billingEntityId") ?? current.billingEntityId).trim();
  const bankAccountId = String(formData.get("bankAccountId") ?? current.bankAccountId).trim();
  const paymentLink = String(formData.get("paymentLink") ?? "").trim() || null;
  const momsRate = Number(formData.get("momsRate") ?? 25);
  const dueDate = String(formData.get("dueDate") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const items = parseItems(String(formData.get("items") ?? "[]"));

  if (items.length === 0) {
    return { error: "Lägg till minst en rad." };
  }

  const { subtotal, vatAmount, total } = computeTotals(items, momsRate);
  const supabase = createServiceRoleClient();

  const { error: invoiceError } = await supabase
    .from("invoices")
    .update({
      billing_entity_id: billingEntityId,
      bank_account_id: bankAccountId,
      payment_link: paymentLink,
      moms_rate: momsRate,
      subtotal,
      vat_amount: vatAmount,
      total,
      due_date: dueDate,
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (invoiceError) {
    return { error: `Kunde inte spara ändringarna: ${invoiceError.message}` };
  }

  await supabase.from("invoice_items").delete().eq("invoice_id", id);
  const { error: itemsError } = await supabase.from("invoice_items").insert(
    items.map((item, index) => ({
      invoice_id: id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      position: index,
    })),
  );

  if (itemsError) {
    return { error: `Kunde inte spara fakturarader: ${itemsError.message}` };
  }

  revalidatePath("/admin/fakturor");
  revalidatePath(`/admin/fakturor/${id}`);
  redirect(`/admin/fakturor/${id}`);
}

export async function deleteInvoice(id: string) {
  await verifySession();

  const current = await getInvoiceById(id);
  if (!current || current.status !== "utkast") {
    // Not deletable — bounce back without touching anything.
    redirect(`/admin/fakturor/${id}`);
  }

  const supabase = createServiceRoleClient();
  await supabase.from("invoices").delete().eq("id", id);

  revalidatePath("/admin/fakturor");
  revalidatePath(`/admin/kunder/${current.customerId}`);
  redirect("/admin/fakturor");
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
  await verifySession();

  const supabase = createServiceRoleClient();
  const patch: Record<string, unknown> = { status, updated_at: new Date().toISOString() };

  if (status === "skickad") {
    const current = await getInvoiceById(id);
    patch.sent_at = new Date().toISOString();
    if (!current?.issuedDate) patch.issued_date = new Date().toISOString().slice(0, 10);
  }

  await supabase.from("invoices").update(patch).eq("id", id);

  revalidatePath("/admin/fakturor");
  revalidatePath(`/admin/fakturor/${id}`);
  redirect(`/admin/fakturor/${id}`);
}

export async function sendInvoiceEmail(
  id: string,
  _prevState: SendInvoiceState,
): Promise<SendInvoiceState> {
  await verifySession();

  const invoice = await getInvoiceById(id);
  if (!invoice) {
    return { error: "Fakturan kunde inte hittas." };
  }
  if (!invoice.customer.email) {
    return { error: "Kunden saknar e-postadress." };
  }

  let pdf: Buffer;
  try {
    pdf = await renderInvoicePdf(id);
  } catch (err) {
    return { error: `Kunde inte skapa PDF:en: ${err instanceof Error ? err.message : String(err)}` };
  }

  const billingEntity = await getBillingEntityById(invoice.billingEntityId);
  const billingEntityName = billingEntity?.name ?? "Faktura";

  try {
    const transport = getSmtpTransport();
    await transport.sendMail({
      from: `"${billingEntityName}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: invoice.customer.email,
      subject: `Faktura #${invoice.invoiceNumber} — ${billingEntityName}`,
      text: `Hej ${invoice.customer.name},\n\nBifogat finner du faktura #${invoice.invoiceNumber} på ${formatCurrencySek(invoice.total)}.\n\nMed vänliga hälsningar,\n${billingEntityName}`,
      attachments: [
        { filename: `faktura-${invoice.invoiceNumber}.pdf`, content: pdf, contentType: "application/pdf" },
      ],
    });
  } catch (err) {
    return { error: `Mejlet kunde inte skickas: ${err instanceof Error ? err.message : String(err)}` };
  }

  const supabase = createServiceRoleClient();
  await supabase
    .from("invoices")
    .update({
      status: "skickad",
      sent_at: new Date().toISOString(),
      issued_date: invoice.issuedDate ?? new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin/fakturor");
  revalidatePath(`/admin/fakturor/${id}`);
  return { success: true };
}
