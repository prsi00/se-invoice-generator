import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import type { Invoice, Firm } from '@/store/useStore'

const styles = StyleSheet.create({
    page: { padding: 50, fontFamily: 'Times-Roman', fontSize: 11, color: '#000' },
    header: { alignItems: 'center', marginBottom: 30, borderBottom: '1 solid #000', paddingBottom: 20 },
    logo: { width: 80, height: 80, objectFit: 'contain', marginBottom: 10 },
    title: { fontSize: 26, letterSpacing: 2, textTransform: 'uppercase' },
    subtitle: { fontSize: 11, marginTop: 5 },
    invoiceBox: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    label: { fontSize: 9, textTransform: 'uppercase', marginBottom: 2, fontStyle: 'italic', color: '#555' },
    value: { fontSize: 11, marginBottom: 1 },
    addressBlock: { width: '45%' },
    metaBlock: { width: '45%', alignItems: 'flex-end' },
    table: { width: '100%', marginBottom: 20 },
    tableHeader: { flexDirection: 'row', borderBottom: '2 solid #000', paddingBottom: 5, marginBottom: 5 },
    thSn: { width: '10%', fontWeight: 'bold' },
    thDesc: { width: '45%', fontWeight: 'bold' },
    thQty: { width: '15%', textAlign: 'right', fontWeight: 'bold' },
    thRate: { width: '15%', textAlign: 'right', fontWeight: 'bold' },
    thTotal: { width: '15%', textAlign: 'right', fontWeight: 'bold' },
    tableRow: { flexDirection: 'row', borderBottom: '1 solid #ccc', paddingVertical: 8 },
    tdSn: { width: '10%' },
    tdDesc: { width: '45%' },
    tdQty: { width: '15%', textAlign: 'right' },
    tdRate: { width: '15%', textAlign: 'right' },
    tdTotal: { width: '15%', textAlign: 'right' },
    summaryArea: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
    summaryBox: { width: '50%' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    summaryText: { fontSize: 11 },
    grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTop: '2 solid #000', borderBottom: '2 solid #000', marginTop: 5, paddingVertical: 6 },
    grandTotalText: { fontSize: 14, fontWeight: 'bold' },
    footer: { position: 'absolute', bottom: 40, left: 50, right: 50, textAlign: 'center', fontSize: 10, fontStyle: 'italic', borderTop: '1 solid #000', paddingTop: 10 }
});

export function ElegantInvoicePDF({ invoice, firm }: { invoice: Invoice, firm?: Firm }) {
    if (!firm || !invoice.buyerDetails) return null;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    {firm?.logo && <Image src={firm.logo} style={styles.logo} />}
                    <Text style={styles.title}>{firm?.name || 'Firm Name'}</Text>
                    <Text style={styles.subtitle}>{firm?.address || ''}</Text>
                    {firm?.gstin && <Text style={styles.subtitle}>GSTIN: {firm.gstin}</Text>}
                </View>

                <View style={styles.invoiceBox}>
                    <View style={styles.addressBlock}>
                        <Text style={styles.label}>INVOICE TO:</Text>
                        <Text style={styles.value}>{invoice.buyerDetails.name}</Text>
                        <Text style={styles.value}>{invoice.buyerDetails.address}</Text>
                        {invoice.buyerDetails.gstin && <Text style={styles.value}>GSTIN: {invoice.buyerDetails.gstin}</Text>}
                    </View>
                    <View style={styles.metaBlock}>
                        <Text style={styles.label}>INVOICE NO.</Text>
                        <Text style={[styles.value, { marginBottom: 10 }]}>{invoice.invoiceNo}</Text>
                        <Text style={styles.label}>DATE</Text>
                        <Text style={styles.value}>{new Date(invoice.date).toLocaleDateString('en-IN')}</Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.thSn}>No.</Text>
                        <Text style={styles.thDesc}>Description</Text>
                        <Text style={styles.thQty}>Qty</Text>
                        <Text style={styles.thRate}>Rate</Text>
                        <Text style={styles.thTotal}>Amount</Text>
                    </View>

                    {(invoice.items || []).map((item, i) => (
                        <View style={styles.tableRow} key={item.id}>
                            <Text style={styles.tdSn}>{i + 1}</Text>
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
                            <Text style={styles.summaryText}>Subtotal:</Text>
                            <Text style={styles.summaryText}>{invoice.subtotal?.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Tax ({invoice.taxType}):</Text>
                            <Text style={styles.summaryText}>{invoice.taxAmount?.toFixed(2)}</Text>
                        </View>
                        <View style={styles.grandTotalRow}>
                            <Text style={styles.grandTotalText}>Total Due:</Text>
                            <Text style={styles.grandTotalText}>Rs. {invoice.grandTotal?.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ marginTop: 40 }}>
                    <Text style={styles.label}>PAYMENT DETAILS:</Text>
                    {firm.bankDetails ? <Text style={styles.value}>{firm.bankDetails}</Text> : null}
                    {firm.upiId ? <Text style={styles.value}>UPI: {firm.upiId}</Text> : null}
                </View>

                <Text style={styles.footer}>Thank you for your business.</Text>
            </Page>
        </Document>
    )
}
