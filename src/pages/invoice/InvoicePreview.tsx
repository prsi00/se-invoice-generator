import { PDFViewer } from '@react-pdf/renderer'
import { InvoicePDF } from '@/components/pdf/InvoicePDF'
import { MinimalInvoicePDF } from '@/components/pdf/MinimalInvoicePDF'
import { CreativeInvoicePDF } from '@/components/pdf/CreativeInvoicePDF'
import { ElegantInvoicePDF } from '@/components/pdf/ElegantInvoicePDF'
import { BoldInvoicePDF } from '@/components/pdf/BoldInvoicePDF'
import type { Invoice, Firm } from '@/store/useStore'
import { useState, useEffect } from 'react'

export function InvoicePreview({ invoice, firm }: { invoice: Invoice, firm?: Firm }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (!firm || !invoice.buyerDetails) {
        return (
            <div className="flex h-full w-full items-center justify-center p-8 text-center text-slate-500">
                <p>Please select a firm and fill out invoice details to generate a preview.</p>
            </div>
        )
    }

    if (isMobile) {
        return (
            <div className="flex h-full w-full items-center justify-center p-8 text-center bg-white rounded shadow-sm text-slate-500">
                <div className="space-y-4 max-w-sm">
                    <p className="font-semibold text-slate-700 text-lg">Mobile Preview Disabled</p>
                    <p className="text-sm">Live PDF rendering is natively disabled on mobile browsers to optimize application performance and prevent mobile Safari crashes.</p>
                    <p className="text-sm">Please use the <b>Download PDF</b> button in the top menu to view and save the file instead.</p>
                </div>
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
