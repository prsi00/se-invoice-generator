import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import type { Invoice, Firm } from '@/store/useStore'

const styles = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10, color: '#111' },
    headerBox: { flexDirection: 'row', backgroundColor: '#0f172a', color: '#fff', padding: 40, alignItems: 'center' },
    headerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    headerRight: { alignItems: 'flex-end' },
    logo: { width: 70, height: 70, objectFit: 'contain', marginRight: 15, backgroundColor: '#fff', padding: 2 },
    firmName: { fontSize: 24, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' },
    firmMeta: { fontSize: 10, color: '#cbd5e1', marginTop: 2 },
    invoiceTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', letterSpacing: 2 },
    contentWrapper: { padding: 40 },
    detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    billTo: { width: '45%' },
    invoiceMeta: { width: '45%', alignItems: 'flex-end' },
    label: { fontSize: 8, textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', marginBottom: 4 },
    value: { fontSize: 12, marginBottom: 2, color: '#0f172a' },
    valueStrong: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
    table: { width: '100%', marginBottom: 20 },
    tableHeader: { flexDirection: 'row', backgroundColor: '#0f172a', color: '#fff', padding: 10 },
    thDesc: { width: '50%', fontWeight: 'bold', fontSize: 10 },
    thQty: { width: '15%', textAlign: 'right', fontWeight: 'bold', fontSize: 10 },
    thRate: { width: '15%', textAlign: 'right', fontWeight: 'bold', fontSize: 10 },
    thTotal: { width: '20%', textAlign: 'right', fontWeight: 'bold', fontSize: 10 },
    tableRow: { flexDirection: 'row', borderBottom: '1 solid #e2e8f0', padding: 10 },
    tdDesc: { width: '50%' },
    tdQty: { width: '15%', textAlign: 'right' },
    tdRate: { width: '15%', textAlign: 'right' },
    tdTotal: { width: '20%', textAlign: 'right', fontWeight: 'bold' },
    summaryArea: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
    summaryBox: { width: '45%' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    summaryLabel: { color: '#64748b', fontSize: 11 },
    summaryValue: { color: '#0f172a', fontSize: 11, fontWeight: 'bold' },
    grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f1f5f9', padding: 10, marginTop: 4 },
    grandTotalLabel: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
    grandTotalValue: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
    paymentWrap: { marginTop: 40, borderLeft: '3 solid #0f172a', paddingLeft: 15 },
    footer: { position: 'absolute', bottom: 40, width: '100%', textAlign: 'center', color: '#94a3b8', fontSize: 9 }
});

export function BoldInvoicePDF({ invoice, firm }: { invoice: Invoice, firm?: Firm }) {
    if (!firm || !invoice.buyerDetails) return null;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerBox}>
                    <View style={styles.headerLeft}>
                        {firm?.logo && <Image src={firm.logo} style={styles.logo} />}
                        <View>
                            <Text style={styles.firmName}>{firm?.name}</Text>
                            <Text style={styles.firmMeta}>{firm?.address}</Text>
                            {firm?.gstin && <Text style={styles.firmMeta}>GSTIN: {firm.gstin}</Text>}
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.invoiceTitle}>INVOICE</Text>
                    </View>
                </View>

                <View style={styles.contentWrapper}>
                    <View style={styles.detailsRow}>
                        <View style={styles.billTo}>
                            <Text style={styles.label}>Bill To</Text>
                            <Text style={styles.valueStrong}>{invoice.buyerDetails.name}</Text>
                            <Text style={styles.value}>{invoice.buyerDetails.address}</Text>
                            {invoice.buyerDetails.gstin && <Text style={styles.value}>GST: {invoice.buyerDetails.gstin}</Text>}
                        </View>
                        <View style={styles.invoiceMeta}>
                            <Text style={styles.label}>Invoice Number</Text>
                            <Text style={styles.valueStrong}>#{invoice.invoiceNo}</Text>
                            <Text style={styles.label}>Issue Date</Text>
                            <Text style={styles.value}>{new Date(invoice.date).toLocaleDateString('en-IN')}</Text>
                        </View>
                    </View>

                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.thDesc}>DESCRIPTION</Text>
                            <Text style={styles.thQty}>QTY</Text>
                            <Text style={styles.thRate}>RATE</Text>
                            <Text style={styles.thTotal}>AMOUNT</Text>
                        </View>
                        {(invoice.items || []).map((item) => (
                            <View style={styles.tableRow} key={item.id}>
                                <Text style={styles.tdDesc}>{item.description}</Text>
                                <Text style={styles.tdQty}>{item.qty}</Text>
                                <Text style={styles.tdRate}>{item.rate.toFixed(2)}</Text>
                                <Text style={styles.tdTotal}>{item.total.toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.summaryArea}>
                        <View style={styles.summaryBox}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Subtotal</Text>
                                <Text style={styles.summaryValue}>{invoice.subtotal?.toFixed(2)}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Tax ({invoice.taxType})</Text>
                                <Text style={styles.summaryValue}>{invoice.taxAmount?.toFixed(2)}</Text>
                            </View>
                            <View style={styles.grandTotalRow}>
                                <Text style={styles.grandTotalLabel}>Total Due</Text>
                                <Text style={styles.grandTotalValue}>Rs. {invoice.grandTotal?.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.paymentWrap}>
                        <Text style={styles.label}>Payment Information</Text>
                        {firm.bankDetails ? <Text style={styles.value}>{firm.bankDetails}</Text> : null}
                        {firm.upiId ? <Text style={styles.value}>UPI: {firm.upiId}</Text> : null}
                    </View>
                </View>

                <Text style={styles.footer}>Thank you for your business. Generated by InvoiceGen PWA.</Text>
            </Page>
        </Document>
    )
}
