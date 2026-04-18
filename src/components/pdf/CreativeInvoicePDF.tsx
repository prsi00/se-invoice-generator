import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import type { Invoice, Firm } from '@/store/useStore'

const styles = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10, color: '#334155' },
    topAccent: { height: 12, backgroundColor: '#2563eb', width: '100%' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 40, paddingBottom: 30, backgroundColor: '#f8fafc' },
    logo: { width: 70, height: 70, objectFit: 'contain', marginRight: 15, borderRadius: 4 },
    companyName: { fontSize: 28, fontWeight: 'bold', color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: 1 },
    invoiceTitle: { fontSize: 18, color: '#2563eb', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8, textAlign: 'right' },
    detailsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 40, marginBottom: 30, marginTop: 20 },
    section: { width: '45%' },
    label: { fontSize: 9, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 4, fontWeight: 'bold' },
    value: { fontSize: 11, color: '#334155', marginBottom: 2 },
    valueBold: { fontSize: 12, fontWeight: 'bold', color: '#0f172a', marginBottom: 2 },
    table: { width: '100%', paddingHorizontal: 40, marginTop: 10 },
    tableHeader: { flexDirection: 'row', backgroundColor: '#e0e7ff', paddingVertical: 10, paddingHorizontal: 8, borderRadius: 4, marginBottom: 8 },
    thSn: { width: '10%', fontSize: 9, color: '#3730a3', fontWeight: 'bold' },
    thDesc: { width: '40%', fontSize: 9, color: '#3730a3', fontWeight: 'bold' },
    thQty: { width: '15%', textAlign: 'right', fontSize: 9, color: '#3730a3', fontWeight: 'bold' },
    thRate: { width: '15%', textAlign: 'right', fontSize: 9, color: '#3730a3', fontWeight: 'bold' },
    thTotal: { width: '20%', textAlign: 'right', fontSize: 9, color: '#3730a3', fontWeight: 'bold' },
    tableRow: { flexDirection: 'row', borderBottom: '1 solid #f1f5f9', paddingVertical: 10, paddingHorizontal: 8 },
    tdSn: { width: '10%' },
    tdDesc: { width: '40%', color: '#0f172a' },
    tdQty: { width: '15%', textAlign: 'right' },
    tdRate: { width: '15%', textAlign: 'right' },
    tdTotal: { width: '20%', textAlign: 'right', color: '#0f172a', fontWeight: 'bold' },
    totalsWrap: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, paddingHorizontal: 40 },
    totalsBox: { width: '45%', backgroundColor: '#f8fafc', padding: 15, borderRadius: 6 },
    totalsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    totalsLabel: { color: '#64748b' },
    totalsValue: { color: '#0f172a', fontWeight: 'bold' },
    grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '2 solid #cbd5e1' },
    grandTotalLabel: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' },
    grandTotalValue: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' },
    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: '#f1f5f9', fontSize: 9, color: '#64748b', textAlign: 'center' }
});

export function CreativeInvoicePDF({ invoice, firm }: { invoice: Invoice, firm?: Firm }) {
    if (!firm || !invoice.buyerDetails) return null;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.topAccent} />
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {firm?.logo && <Image src={firm.logo} style={styles.logo} />}
                        <View>
                            <Text style={styles.companyName}>{firm?.name}</Text>
                            <Text style={{ marginTop: 4 }}>{firm?.address}</Text>
                            {firm?.gstin && <Text style={{ marginTop: 2 }}>GSTIN: {firm.gstin}</Text>}
                        </View>
                    </View>
                    <View>
                        <Text style={styles.invoiceTitle}>INVOICE</Text>
                        <Text style={{ textAlign: 'right', color: '#64748b' }}>#{invoice.invoiceNo}</Text>
                        <Text style={{ textAlign: 'right', marginTop: 2, color: '#64748b' }}>{new Date(invoice.date).toLocaleDateString('en-IN')}</Text>
                    </View>
                </View>

                <View style={styles.detailsRow}>
                    <View style={styles.section}>
                        <Text style={styles.label}>Invoice To</Text>
                        <Text style={styles.valueBold}>{invoice.buyerDetails.name}</Text>
                        <Text style={styles.value}>{invoice.buyerDetails.address}</Text>
                        {invoice.buyerDetails.gstin && <Text style={styles.value}>GST: {invoice.buyerDetails.gstin}</Text>}
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.label}>Payment Details</Text>
                        {firm.bankDetails ? <Text style={styles.value}>{firm.bankDetails}</Text> : <Text style={styles.value}>N/A</Text>}
                        {firm.upiId && <Text style={styles.value}>UPI: {firm.upiId}</Text>}
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.thSn}>SN.</Text>
                        <Text style={styles.thDesc}>DESCRIPTION</Text>
                        <Text style={styles.thQty}>QTY</Text>
                        <Text style={styles.thRate}>RATE</Text>
                        <Text style={styles.thTotal}>AMOUNT</Text>
                    </View>
                    {(invoice.items || []).map((item, i) => (
                        <View style={styles.tableRow} key={item.id}>
                            <Text style={styles.tdSn}>{String(i + 1).padStart(2, '0')}</Text>
                            <Text style={styles.tdDesc}>{item.description}</Text>
                            <Text style={styles.tdQty}>{item.qty}</Text>
                            <Text style={styles.tdRate}>{item.rate.toFixed(2)}</Text>
                            <Text style={styles.tdTotal}>{item.total.toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.totalsWrap}>
                    <View style={styles.totalsBox}>
                        <View style={styles.totalsRow}>
                            <Text style={styles.totalsLabel}>Subtotal</Text>
                            <Text style={styles.totalsValue}>{invoice.subtotal?.toFixed(2)}</Text>
                        </View>
                        <View style={styles.totalsRow}>
                            <Text style={styles.totalsLabel}>Tax ({invoice.taxType})</Text>
                            <Text style={styles.totalsValue}>{invoice.taxAmount?.toFixed(2)}</Text>
                        </View>
                        <View style={styles.grandTotalRow}>
                            <Text style={styles.grandTotalLabel}>Total Due</Text>
                            <Text style={styles.grandTotalValue}>Rs. {invoice.grandTotal?.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.footer}>Thank you for your business. Generated by InvoiceGen PWA.</Text>
            </Page>
        </Document>
    )
}
