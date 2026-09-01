import fs from "fs";
import path from "path";
import { Document, Page, View, Text, StyleSheet, Link, Image, Font } from "@react-pdf/renderer";
import type { InvoiceWithItems, BillingEntity, BankAccount } from "@/lib/types";

// Font.register's `src` must be a string — it's resolved via fetch()
// internally. Node's fetch has no file:// support ("not implemented"), but
// it does support data: URIs, so the font files are inlined as base64.
const assetsDir = path.join(process.cwd(), "lib/pdf/fonts");
const mimeTypes: Record<string, string> = { ".ttf": "font/ttf", ".woff": "font/woff", ".woff2": "font/woff2" };
const assetUrl = (relativePath: string) => {
  const fullPath = path.join(assetsDir, relativePath);
  if (!fs.existsSync(fullPath)) return undefined;
  const mime = mimeTypes[path.extname(fullPath)] ?? "application/octet-stream";
  return `data:${mime};base64,${fs.readFileSync(fullPath).toString("base64")}`;
};

// Same fonts the site itself uses (--font-sans / --font-display in
// globals.css) — Geist for body text, Space Grotesk for the "Faktura"
// heading — instead of react-pdf's Helvetica default.
const geistRegular = assetUrl("Geist-Regular.ttf");
const geistMedium = assetUrl("Geist-Medium.ttf");
const geistBold = assetUrl("Geist-Bold.ttf");
const spaceGroteskBold = assetUrl("SpaceGrotesk-Bold.woff");

if (geistRegular && geistMedium && geistBold) {
  Font.register({
    family: "Geist",
    fonts: [
      { src: geistRegular, fontWeight: 400 },
      { src: geistMedium, fontWeight: 500 },
      { src: geistBold, fontWeight: 700 },
    ],
  });
}
if (spaceGroteskBold) {
  Font.register({ family: "Space Grotesk", fonts: [{ src: spaceGroteskBold, fontWeight: 700 }] });
}

const bodyFont = geistRegular ? "Geist" : "Helvetica";
const displayFont = spaceGroteskBold ? "Space Grotesk" : "Helvetica";

const logoPath = path.join(
  process.cwd(),
  "public/images/lindqvist-holmgren/lindqvist-holmgren-favicon.png",
);
const logoSrc = fs.existsSync(logoPath)
  ? { data: fs.readFileSync(logoPath), format: "png" as const }
  : undefined;

const orange = "#E8622C";

const styles = StyleSheet.create({
  // Extra bottom padding reserves space for the fixed footer so normal
  // content wraps to a new page instead of running underneath it.
  page: { paddingTop: 40, paddingLeft: 40, paddingRight: 40, paddingBottom: 220, fontSize: 10, fontFamily: bodyFont, color: "#1a1a1a" },

  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logo: { width: 34, height: 34, marginRight: 12, borderRadius: 8 },
  invoiceTitle: { fontFamily: displayFont, fontSize: 30, fontWeight: 700 },
  invoiceNumber: { fontFamily: displayFont, fontSize: 16, fontWeight: 700, marginTop: 2, color: "#444" },
  headerRight: { alignItems: "flex-end" },
  companyName: { fontSize: 11, fontWeight: 700 },
  small: { fontSize: 9, color: "#555", marginTop: 2, textAlign: "right" },

  divider: { borderBottom: "1pt solid #1a1a1a", marginBottom: 20 },

  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  sectionLabel: { fontSize: 8, textTransform: "uppercase", color: "#888", marginBottom: 6, letterSpacing: 1 },
  billTo: { maxWidth: 260 },
  totalBox: { alignItems: "flex-end" },
  totalAmountBig: { fontSize: 20, fontWeight: 700, color: orange, marginBottom: 6 },
  metaLine: { fontSize: 9, color: "#555", textAlign: "right" },

  table: { marginTop: 4 },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #1a1a1a",
    paddingBottom: 6,
    marginBottom: 6,
  },
  tableRow: { flexDirection: "row", borderBottom: "0.5pt solid #ddd", paddingVertical: 6 },
  colDescription: { flex: 4 },
  colPrice: { flex: 1.3, textAlign: "right" },
  colQty: { flex: 1, textAlign: "right" },
  colSum: { flex: 1.3, textAlign: "right" },
  headerCell: { fontSize: 8, textTransform: "uppercase", color: "#888", letterSpacing: 1 },

  totalsBlock: { marginTop: 16, alignSelf: "flex-end", width: 220 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  totalsRowBold: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    marginTop: 4,
    borderTop: "1pt solid #1a1a1a",
    fontWeight: 700,
    fontSize: 12,
  },

  notes: { marginTop: 16, fontSize: 9, color: "#555" },

  // Pinned to the bottom of every page, instead of just flowing after the
  // totals — so it doesn't end up stranded in the middle of a short invoice.
  footer: { position: "absolute", left: 40, right: 40, bottom: 40 },
  paymentCta: { marginBottom: 16 },
  paymentCtaNote: { fontSize: 11, fontWeight: 700, color: orange },
  paymentCtaLink: { fontSize: 9, color: "#2563eb", textDecoration: "underline", marginTop: 4 },

  paymentBox: {
    borderRadius: 6,
    border: "0.75pt solid #ddd",
    padding: 16,
  },
  paymentGrid: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  paymentCol: { flex: 1 },
  paymentLine: { fontSize: 9, color: "#333", marginBottom: 4 },
  inlineLink: { color: "#2563eb", textDecoration: "underline" },
  paymentTerms: { fontSize: 7.5, color: "#999", marginTop: 12, lineHeight: 1.4, borderTop: "0.5pt solid #eee", paddingTop: 10 },
});

function formatAmount(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const hasDecimals = Math.abs(rounded % 1) > 0.001;
  const formatted = rounded.toLocaleString("en-US", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `${formatted} :-`;
}

function formatIsoDate(value: string | null | undefined): string {
  if (!value) return "–";
  return value.slice(0, 10);
}

function accountLabel(kontonummer: string): string {
  return /^[A-Z]{2}\d{2}/.test(kontonummer.replace(/\s/g, "")) ? "IBAN" : "Kontonummer";
}

type InvoiceDocumentProps = {
  invoice: InvoiceWithItems;
  billingEntity: BillingEntity | null;
  bankAccount: BankAccount | null;
};

export function InvoiceDocument({ invoice, billingEntity, bankAccount }: InvoiceDocumentProps) {
  const { customer } = invoice;
  const customerHeading = customer.company || customer.name;
  const showContactPerson = Boolean(customer.company) && customer.name && customer.company !== customer.name;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf's Image is a PDF drawing primitive, not an HTML <img>; it has no alt prop */}
            {logoSrc && <Image src={logoSrc} style={styles.logo} />}
            <View>
              <Text style={styles.invoiceTitle}>Faktura</Text>
              <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.companyName}>{billingEntity?.name ?? "—"}</Text>
            {billingEntity?.website && <Text style={styles.small}>{billingEntity.website}</Text>}
            {billingEntity?.address && <Text style={styles.small}>{billingEntity.address}</Text>}
            {(billingEntity?.postalCode || billingEntity?.city) && (
              <Text style={styles.small}>
                {billingEntity?.postalCode}, {billingEntity?.city}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.billTo}>
            <Text style={styles.sectionLabel}>Faktureras till:</Text>
            <Text style={{ fontWeight: 700, marginBottom: 2 }}>{customerHeading}</Text>
            {customer.address && <Text>{customer.address}</Text>}
            {(customer.postalCode || customer.city) && (
              <Text>
                {customer.postalCode}, {customer.city}
              </Text>
            )}
            {customer.email && <Text>{customer.email}</Text>}
            {customer.orgNumber && <Text>Orgnr: {customer.orgNumber}</Text>}
            {showContactPerson && <Text>Kontaktperson: {customer.name}</Text>}
          </View>
          <View style={styles.totalBox}>
            <Text style={styles.sectionLabel}>Totalbelopp</Text>
            <Text style={styles.totalAmountBig}>{formatAmount(invoice.total)}</Text>
            <Text style={styles.metaLine}>Fakturadatum: {formatIsoDate(invoice.issuedDate)}</Text>
            <Text style={styles.metaLine}>Förfallodatum: {formatIsoDate(invoice.dueDate)}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.headerCell, styles.colDescription]}>Artikel</Text>
            <Text style={[styles.headerCell, styles.colPrice]}>Summa</Text>
            <Text style={[styles.headerCell, styles.colQty]}>Antal</Text>
            <Text style={[styles.headerCell, styles.colSum]}>Totalt</Text>
          </View>
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colPrice}>{formatAmount(item.unitPrice)}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colSum}>{formatAmount(item.quantity * item.unitPrice)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text>Subtotal :</Text>
            <Text>{formatAmount(invoice.subtotal)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text>MOMS({invoice.momsRate}%) :</Text>
            <Text>{formatAmount(invoice.vatAmount)}</Text>
          </View>
          <View style={styles.totalsRowBold}>
            <Text>Totalt:</Text>
            <Text>{formatAmount(invoice.total)}</Text>
          </View>
        </View>

        {invoice.notes && <Text style={styles.notes}>{invoice.notes}</Text>}

        <View style={styles.footer} fixed>
          {invoice.paymentLink && (
            <View style={styles.paymentCta}>
              <Text style={styles.paymentCtaNote}>
                Klicka på länken för att betala med kort eller Apple Pay
              </Text>
              <Link src={invoice.paymentLink} style={styles.paymentCtaLink}>
                {invoice.paymentLink}
              </Link>
            </View>
          )}

          <View style={styles.paymentBox}>
            <Text style={styles.sectionLabel}>Betalinformation</Text>
            <View style={styles.paymentGrid}>
              <View style={styles.paymentCol}>
                {bankAccount?.bank && <Text style={styles.paymentLine}>Bank: {bankAccount.bank}</Text>}
                {bankAccount?.kontonummer && (
                  <Text style={styles.paymentLine}>
                    {accountLabel(bankAccount.kontonummer)}: {bankAccount.kontonummer}
                  </Text>
                )}
                {billingEntity?.orgNumber && (
                  <Text style={styles.paymentLine}>Orgnr: {billingEntity.orgNumber}</Text>
                )}
              </View>
              <View style={styles.paymentCol}>
                <Text style={styles.paymentLine}>OCR/Meddelande: {invoice.invoiceNumber}</Text>
                {invoice.paymentLink && (
                  <Text style={styles.paymentLine}>
                    Betallänk:{" "}
                    <Link src={invoice.paymentLink} style={styles.inlineLink}>
                      Apple Pay/Kortbetalning
                    </Link>
                  </Text>
                )}
                {billingEntity?.fSkatt && <Text style={styles.paymentLine}>Godkänd för F-skatt</Text>}
                {billingEntity?.vatNumber && (
                  <Text style={styles.paymentLine}>Momsregnr: {billingEntity.vatNumber}</Text>
                )}
              </View>
            </View>
            {billingEntity?.paymentTerms && (
              <Text style={styles.paymentTerms}>{billingEntity.paymentTerms}</Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
