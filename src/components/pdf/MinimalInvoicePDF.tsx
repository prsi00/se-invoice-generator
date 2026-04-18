import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import type { Invoice, Firm } from '@/store/useStore'

const styles = StyleSheet.create({
    page: { padding: 45, fontFamily: 'Helvetica', fontSize: 10, color: '#475569' },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 50 },
    logo: { width: 70, height: 70, objectFit: 'contain', marginBottom: 10 },
    firmName: { color: '#0f172a', fontWeight: 'bold', fontSize: 12 },

    titleArea: { alignItems: 'flex-end' },
    invTitle: { fontSize: 48, color: '#f1f5f9', fontWeight: 'bold', letterSpacing: 4, marginRight: -20, marginTop: -15 },
    invNo: { color: '#0f172a', fontWeight: 'bold', fontSize: 14, marginTop: 5 },
    invDate: { color: '#94a3b8', fontSize: 10, marginTop: 2 },

    threeCol: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
    col: { width: '30%' },
    label: { fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 1 },
    valBold: { color: '#0f172a', fontWeight: 'bold', marginBottom: 3 },
    valNorm: { marginBottom: 3, lineHeight: 1.4 },

    table: { width: '100%', marginBottom: 30 },
    trHead: { flexDirection: 'row', borderBottom: '1 solid #e2e8f0', paddingBottom: 10, marginBottom: 10 },
    trRow: { flexDirection: 'row', borderBottom: '1 solid #f8fafc', paddingBottom: 10, marginBottom: 10 },

    cDesc: { width: '45%' },
    cQty: { width: '15%', textAlign: 'right' },
    cRate: { width: '20%', textAlign: 'right' },
    cTotal: { width: '20%', textAlign: 'right' },

    thLabel: { fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },
    itemBold: { color: '#0f172a', fontWeight: 'bold' },

    totalsWrap: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
    totalsBox: { width: '40%' },
    totRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    totLabel: { color: '#94a3b8' },
    totVal: { color: '#0f172a' },
    grandRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, paddingTop: 6, borderTop: '1 solid #0f172a' },
    grandLabel: { color: '#0f172a', fontWeight: 'bold', fontSize: 14 },
    grandVal: { color: '#0f172a', fontWeight: 'bold', fontSize: 14 },

    footer: { position: 'absolute', bottom: 40, left: 45, right: 45, textAlign: 'center', fontSize: 8, color: '#cbd5e1' }
});

export function MinimalInvoicePDF({ invoice, firm }: { invoice: Invoice, firm?: Firm }) {
    if (!firm || !invoice.buyerDetails) return null;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        {firm.logo ? <Image src={firm.logo} style={styles.logo} /> : null}
                        <Text style={styles.firmName}>{firm.name}</Text>
                        <Text style={styles.valNorm}>{firm.address}</Text>
                        {firm.gstin && <Text style={styles.valNorm}>GST: {firm.gstin}</Text>}
                    </View>
                    <View style={styles.titleArea}>
                        <Text style={styles.invTitle}>INVOICE</Text>
                        <Text style={styles.invNo}>#{invoice.invoiceNo}</Text>
                        <Text style={styles.invDate}>{new Date(invoice.date).toLocaleDateString('en-IN')}</Text>
                    </View>
                </View>

                <View style={styles.threeCol}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Billed To</Text>
                        <Text style={styles.valBold}>{invoice.buyerDetails.name}</Text>
                        <Text style={styles.valNorm}>{invoice.buyerDetails.address}</Text>
                        {invoice.buyerDetails.gstin && <Text style={styles.valNorm}>GST: {invoice.buyerDetails.gstin}</Text>}
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.label}>Payment Details</Text>
                        {firm.bankDetails ? <Text style={styles.valNorm}>{firm.bankDetails}</Text> : null}
                        {firm.payeeId && <Text style={styles.valNorm}>Payee: {firm.payeeId}</Text>}
                    </View>
                    <View style={styles.col}></View>
                </View>

                <View style={styles.table}>
                    <View style={styles.trHead}>
                        <Text style={[styles.cDesc, styles.thLabel]}>Description</Text>
                        <Text style={[styles.cQty, styles.thLabel]}>Qty</Text>
                        <Text style={[styles.cRate, styles.thLabel]}>Rate</Text>
                        <Text style={[styles.cTotal, styles.thLabel]}>Amount</Text>
                    </View>

                    {(invoice.items || []).map(item => (
                        <View style={styles.trRow} key={item.id}>
                            <Text style={[styles.cDesc, styles.itemBold]}>{item.description}</Text>
                            <Text style={styles.cQty}>{item.qty}</Text>
                            <Text style={styles.cRate}>{item.rate.toFixed(2)}</Text>
                            <Text style={[styles.cTotal, styles.itemBold]}>{item.total.toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.totalsWrap}>
                    <View style={styles.totalsBox}>
                        <View style={styles.totRow}>
                            <Text style={styles.totLabel}>Subtotal</Text>
                            <Text style={styles.totVal}>{invoice.subtotal?.toFixed(2)}</Text>
                        </View>
                        <View style={styles.totRow}>
                            <Text style={styles.totLabel}>Tax ({invoice.taxType})</Text>
                            <Text style={styles.totVal}>{invoice.taxAmount?.toFixed(2)}</Text>
                        </View>
                        <View style={styles.grandRow}>
                            <Text style={styles.grandLabel}>Total Due</Text>
                            <Text style={styles.grandVal}>Rs. {invoice.grandTotal?.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.footer}>Thank You</Text>
            </Page>
        </Document>
    )
}
