import { Document, Page, View, Text, StyleSheet, Link } from "@react-pdf/renderer";
import type { InvoiceWithItems, BillingEntity, BankAccount } from "@/lib/types";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1a1a1a" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
  companyName: { fontSize: 14, fontWeight: 700 },
  small: { fontSize: 9, color: "#555", marginTop: 2 },
  invoiceTitle: { fontSize: 18, fontWeight: 700, textAlign: "right" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 8, textTransform: "uppercase", color: "#888", marginBottom: 4, letterSpacing: 0.5 },
  table: { marginTop: 8 },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #1a1a1a",
    paddingBottom: 6,
    marginBottom: 6,
  },
  tableRow: { flexDirection: "row", borderBottom: "0.5pt solid #ddd", paddingVertical: 6 },
  colDescription: { flex: 4 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 1.5, textAlign: "right" },
  colSum: { flex: 1.5, textAlign: "right" },
  headerCell: { fontSize: 8, textTransform: "uppercase", color: "#888", letterSpacing: 0.5 },
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
  footer: { marginTop: 40, paddingTop: 16, borderTop: "0.5pt solid #ddd", fontSize: 9, color: "#555" },
  paymentLink: { marginTop: 6, color: "#1a1a1a", textDecoration: "underline" },
});

function formatSek(amount: number): string {
  return new Intl.NumberFormat("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    amount,
  );
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "–";
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "medium" }).format(new Date(iso));
}

type InvoiceDocumentProps = {
  invoice: InvoiceWithItems;
  billingEntity: BillingEntity | null;
  bankAccount: BankAccount | null;
};

export function InvoiceDocument({ invoice, billingEntity, bankAccount }: InvoiceDocumentProps) {
  const { customer } = invoice;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.companyName}>{billingEntity?.name ?? "—"}</Text>
            {billingEntity?.address && <Text style={styles.small}>{billingEntity.address}</Text>}
            {(billingEntity?.postalCode || billingEntity?.city) && (
              <Text style={styles.small}>
                {billingEntity?.postalCode} {billingEntity?.city}
              </Text>
            )}
            {billingEntity?.orgNumber && <Text style={styles.small}>Org.nr {billingEntity.orgNumber}</Text>}
            {billingEntity?.email && <Text style={styles.small}>{billingEntity.email}</Text>}
          </View>
          <View>
            <Text style={styles.invoiceTitle}>FAKTURA</Text>
            <Text style={[styles.small, { textAlign: "right" }]}>#{invoice.invoiceNumber}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.small}>Fakturadatum</Text>
              <Text style={[styles.small, { marginLeft: 12 }]}>{formatDate(invoice.issuedDate)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.small}>Förfallodatum</Text>
              <Text style={[styles.small, { marginLeft: 12 }]}>{formatDate(invoice.dueDate)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Faktureras till</Text>
          <Text>{customer.name}</Text>
          {customer.company && <Text>{customer.company}</Text>}
          {customer.address && <Text>{customer.address}</Text>}
          {(customer.postalCode || customer.city) && (
            <Text>
              {customer.postalCode} {customer.city}
            </Text>
          )}
          {customer.orgNumber && <Text>Org.nr {customer.orgNumber}</Text>}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.headerCell, styles.colDescription]}>Tjänst</Text>
            <Text style={[styles.headerCell, styles.colQty]}>Antal</Text>
            <Text style={[styles.headerCell, styles.colPrice]}>À-pris</Text>
            <Text style={[styles.headerCell, styles.colSum]}>Summa</Text>
          </View>
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatSek(item.unitPrice)} kr</Text>
              <Text style={styles.colSum}>{formatSek(item.quantity * item.unitPrice)} kr</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text>Summa</Text>
            <Text>{formatSek(invoice.subtotal)} kr</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text>Moms ({invoice.momsRate}%)</Text>
            <Text>{formatSek(invoice.vatAmount)} kr</Text>
          </View>
          <View style={styles.totalsRowBold}>
            <Text>Att betala</Text>
            <Text>{formatSek(invoice.total)} kr</Text>
          </View>
        </View>

        <View style={styles.footer}>
          {invoice.notes && <Text style={{ marginBottom: 6 }}>{invoice.notes}</Text>}
          {bankAccount?.kontonummer && (
            <Text>
              Kontonummer: {bankAccount.kontonummer}
              {bankAccount.bank ? ` (${bankAccount.bank})` : ""}
            </Text>
          )}
          {invoice.paymentLink && (
            <Link src={invoice.paymentLink} style={styles.paymentLink}>
              Betala direkt: {invoice.paymentLink}
            </Link>
          )}
        </View>
      </Page>
    </Document>
  );
}
