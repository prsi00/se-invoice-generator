import { PDFViewer } from '@react-pdf/renderer'
import { InvoicePDF } from '@/components/pdf/InvoicePDF'
import { MinimalInvoicePDF } from '@/components/pdf/MinimalInvoicePDF'
import { CreativeInvoicePDF } from '@/components/pdf/CreativeInvoicePDF'
import { ElegantInvoicePDF } from '@/components/pdf/ElegantInvoicePDF'
import { BoldInvoicePDF } from '@/components/pdf/BoldInvoicePDF'
import type { Invoice, Firm } from '@/store/useStore'

export function InvoicePreview({ invoice, firm }: { invoice: Invoice, firm?: Firm }) {
    if (!firm || !invoice.buyerDetails) {
        return (
            <div className="flex h-full w-full items-center justify-center p-8 text-center text-slate-500">
                <p>Please select a firm and fill out invoice details to generate a preview.</p>
            </div>
        )
    }

    return (
        <div className="h-full w-full p-4 overflow-hidden flex flex-col">
            <PDFViewer className="flex-1 w-full rounded border-0 shadow-lg bg-white" showToolbar={false}>
                {invoice.template === 'elegant' ? (
                    <ElegantInvoicePDF invoice={invoice} firm={firm} />
                ) : invoice.template === 'bold' ? (
                    <BoldInvoicePDF invoice={invoice} firm={firm} />
                ) : invoice.template === 'creative' ? (
                    <CreativeInvoicePDF invoice={invoice} firm={firm} />
                ) : invoice.template === 'minimal' ? (
                    <MinimalInvoicePDF invoice={invoice} firm={firm} />
                ) : (
                    <InvoicePDF invoice={invoice} firm={firm} />
                )}
            </PDFViewer>
        </div>
    )
}
