import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import type { Invoice, Firm } from '@/store/useStore'

const styles = StyleSheet.create({
    page: { padding: 30, fontFamily: 'Helvetica', fontSize: 9, color: '#111' },
    borderBox: { border: '1 solid #111', height: '100%', padding: 15 },
    headerTitle: { textAlign: 'center', fontSize: 16, fontWeight: 'bold', textDecoration: 'underline', marginBottom: 15 },

    firmBox: { flexDirection: 'row', alignItems: 'center', borderBottom: '1 solid #111', paddingBottom: 15, marginBottom: 15 },
    firmText: { flex: 1 },
    firmName: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
    logo: { width: 60, height: 60, objectFit: 'contain', marginLeft: 15 },

    splitGrid: { flexDirection: 'row', borderBottom: '1 solid #111', paddingBottom: 15, marginBottom: 15 },
    billBox: { width: '50%', paddingRight: 10, borderRight: '1 solid #111' },
    detailBox: { width: '50%', paddingLeft: 10 },

    heading: { fontSize: 9, fontWeight: 'bold', backgroundColor: '#e2e8f0', padding: 3, marginBottom: 5 },
    boldText: { fontWeight: 'bold', marginBottom: 2 },
    normText: { marginBottom: 2 },

    tableWrap: { border: '1 solid #111', borderBottom: 0, marginBottom: 15 },
    trHead: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderBottom: '1 solid #111', fontWeight: 'bold' },
    tr: { flexDirection: 'row', borderBottom: '1 solid #111' },

    // Columns
    c1: { width: '5%', padding: 4, borderRight: '1 solid #111' },
    c2: { width: '45%', padding: 4, borderRight: '1 solid #111' },
    c3: { width: '10%', padding: 4, textAlign: 'right', borderRight: '1 solid #111' },
    c4: { width: '10%', padding: 4, textAlign: 'right', borderRight: '1 solid #111' },
    c5: { width: '15%', padding: 4, textAlign: 'right', borderRight: '1 solid #111' },
    c6: { width: '15%', padding: 4, textAlign: 'right' },
    cNoBorder: { borderRight: 0 },

    footerGrid: { flexDirection: 'row', border: '1 solid #111' },
    bankBox: { width: '60%', padding: 10, borderRight: '1 solid #111' },
    totBox: { width: '40%', padding: 10 },
    totRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    grandRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, paddingTop: 4, borderTop: '1 solid #111', fontWeight: 'bold', fontSize: 11 }
});

export function InvoicePDF({ invoice, firm }: { invoice: Invoice, firm?: Firm }) {
    if (!firm || !invoice.buyerDetails) return null;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.borderBox}>
                    <Text style={styles.headerTitle}>TAX INVOICE</Text>

                    <View style={styles.firmBox}>
                        <View style={styles.firmText}>
                            <Text style={styles.firmName}>{firm.name}</Text>
                            <Text style={styles.normText}>{firm.address}</Text>
                            {firm.gstin && <Text style={styles.normText}>GSTIN: {firm.gstin}</Text>}
                        </View>
                        {firm.logo && <Image src={firm.logo} style={styles.logo} />}
                    </View>

                    <View style={styles.splitGrid}>
                        <View style={styles.billBox}>
                            <Text style={styles.heading}>Details of Buyer (Billed To)</Text>
                            <Text style={styles.boldText}>{invoice.buyerDetails.name}</Text>
                            <Text style={styles.normText}>{invoice.buyerDetails.address}</Text>
                            {invoice.buyerDetails.gstin && <Text style={styles.normText}>GSTIN: {invoice.buyerDetails.gstin}</Text>}
                        </View>
                        <View style={styles.detailBox}>
                            <Text style={styles.heading}>Invoice Details</Text>
                            <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                                <Text style={{ width: '40%' }}>Invoice No:</Text>
                                <Text style={styles.boldText}>{invoice.invoiceNo}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                                <Text style={{ width: '40%' }}>Date:</Text>
                                <Text style={styles.boldText}>{new Date(invoice.date).toLocaleDateString('en-IN')}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.tableWrap}>
                        <View style={styles.trHead}>
                            <Text style={styles.c1}>Sn.</Text>
                            <Text style={styles.c2}>Item Description</Text>
                            <Text style={styles.c3}>HSN</Text>
                            <Text style={styles.c4}>Qty</Text>
                            <Text style={styles.c5}>Rate</Text>
                            <Text style={[styles.c6, styles.cNoBorder]}>Total</Text>
                        </View>
                        {(invoice.items || []).map((item, i) => (
                            <View style={styles.tr} key={item.id}>
                                <Text style={styles.c1}>{i + 1}</Text>
                                <Text style={styles.c2}>{item.description}</Text>
                                <Text style={styles.c3}>{item.hsnCode || '-'}</Text>
                                <Text style={styles.c4}>{item.qty}</Text>
                                <Text style={styles.c5}>{item.rate.toFixed(2)}</Text>
                                <Text style={[styles.c6, styles.cNoBorder]}>{item.total.toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.footerGrid}>
                        <View style={styles.bankBox}>
                            <Text style={styles.heading}>Bank Details & Terms</Text>
                            {firm.bankDetails ? <Text style={styles.normText}>{firm.bankDetails}</Text> : <Text style={styles.normText}>N/A</Text>}
                            {firm.payeeId && <Text style={styles.normText}>Payee: {firm.payeeId}</Text>}
                            <Text style={{ marginTop: 15, fontStyle: 'italic', color: '#555', fontSize: 10 }}>Thank You</Text>
                        </View>
                        <View style={styles.totBox}>
                            <View style={styles.totRow}>
                                <Text>Subtotal</Text>
                                <Text>{invoice.subtotal?.toFixed(2)}</Text>
                            </View>
                            <View style={styles.totRow}>
                                <Text>Tax ({invoice.taxType})</Text>
                                <Text>{invoice.taxAmount?.toFixed(2)}</Text>
                            </View>
                            <View style={styles.grandRow}>
                                <Text>Grand Total</Text>
                                <Text>Rs. {invoice.grandTotal?.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    )
}
