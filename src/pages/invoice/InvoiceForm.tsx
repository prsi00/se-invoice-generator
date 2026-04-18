import { Plus, Trash2 } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { Invoice, InvoiceItem } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InvoiceFormProps {
    invoice: Partial<Invoice>;
    setInvoice: (inv: Partial<Invoice>) => void;
}

export function InvoiceForm({ invoice, setInvoice }: InvoiceFormProps) {
    const { firms, clients, items: catalogItems } = useStore()

    const handleUpdate = (field: keyof Invoice, value: any) => {
        setInvoice({ ...invoice, [field]: value })
    }

    const handleClientSelect = (clientId: string) => {
        const client = clients.find(c => c.id === clientId)
        if (client) {
            handleUpdate('buyerDetails', client)
        }
    }

    const recalcTotals = (newItems: InvoiceItem[], newTaxType: 'IGST' | 'CGST_SGST') => {
        let subtotal = 0;
        let taxAmount = 0;

        newItems.forEach(item => {
            // qty * rate calculation
            const baseTotal = item.qty * item.rate;
            const discountAmount = baseTotal * ((item.discountPercent || 0) / 100);
            const afterDiscount = baseTotal - discountAmount;

            const itemTaxAmount = afterDiscount * (item.taxPercent / 100);

            item.total = afterDiscount + itemTaxAmount; // total per line

            subtotal += afterDiscount;
            taxAmount += itemTaxAmount;
        })

        const grandTotal = subtotal + taxAmount;

        setInvoice({
            ...invoice,
            items: newItems,
            subtotal,
            taxAmount,
            grandTotal,
            taxType: newTaxType
        })
    }

    const addItemRow = () => {
        const newItems = [...(invoice.items || []), {
            id: window.crypto.randomUUID(),
            description: '',
            qty: 1,
            rate: 0,
            taxPercent: 0,
            total: 0
        }]
        recalcTotals(newItems, invoice.taxType || 'CGST_SGST')
    }

    const importFromCatalog = (catalogId: string) => {
        const cItem = catalogItems.find(c => c.id === catalogId)
        if (cItem) {
            const newItems = [...(invoice.items || []), {
                id: window.crypto.randomUUID(),
                description: cItem.description,
                hsnCode: cItem.hsnCode,
                qty: 1,
                rate: cItem.rate,
                taxPercent: cItem.taxPercent,
                total: cItem.rate + (cItem.rate * cItem.taxPercent / 100)
            }]
            recalcTotals(newItems, invoice.taxType || 'CGST_SGST')
        }
    }

    const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
        const newItems = [...(invoice.items || [])]
        newItems[index] = { ...newItems[index], [field]: value }
        recalcTotals(newItems, invoice.taxType || 'CGST_SGST')
    }

    const removeItem = (index: number) => {
        const newItems = [...(invoice.items || [])]
        newItems.splice(index, 1)
        recalcTotals(newItems, invoice.taxType || 'CGST_SGST')
    }

    return (
        <div className="p-6 space-y-6 pb-24">
            <Card>
                <CardHeader><CardTitle>General Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Firm Context</Label>
                        <Select value={invoice.firmId} onValueChange={(v) => handleUpdate('firmId', v)}>
                            <SelectTrigger><SelectValue placeholder="Select Firm" /></SelectTrigger>
                            <SelectContent>
                                {firms.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Invoice Number</Label>
                        <Input value={invoice.invoiceNo || ''} onChange={(e) => handleUpdate('invoiceNo', e.target.value)} />
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Invoice Date</Label>
                        <Input type="date" value={invoice.date || ''} onChange={(e) => handleUpdate('date', e.target.value)} />
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label>Tax Layout (Inter vs Intrastate)</Label>
                        <Select value={invoice.taxType} onValueChange={(v: any) => recalcTotals(invoice.items || [], v)}>
                            <SelectTrigger><SelectValue placeholder="Select Tax Type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CGST_SGST">CGST & SGST (Intrastate)</SelectItem>
                                <SelectItem value="IGST">IGST (Interstate)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 col-span-2">
                        <Label>PDF Template Theme</Label>
                        <Select value={invoice.template || 'standard'} onValueChange={(v: any) => handleUpdate('template', v)}>
                            <SelectTrigger><SelectValue placeholder="Select Theme" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="standard">Standard Corporate</SelectItem>
                                <SelectItem value="minimal">Modern Minimal</SelectItem>
                                <SelectItem value="creative">Creative Accent</SelectItem>
                                <SelectItem value="elegant">Elegant Serif</SelectItem>
                                <SelectItem value="bold">Bold Dark Header</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Bill To (Buyer Details)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {clients.length > 0 && (
                        <div className="space-y-2 mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
                            <Label className="text-slate-500">Quick Select from Address Book</Label>
                            <Select onValueChange={handleClientSelect}>
                                <SelectTrigger><SelectValue placeholder="Select Saved Client" /></SelectTrigger>
                                <SelectContent>
                                    {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label>Buyer Name</Label>
                            <Input
                                value={invoice.buyerDetails?.name || ''}
                                onChange={(e) => handleUpdate('buyerDetails', { ...invoice.buyerDetails, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label>GSTIN</Label>
                            <Input
                                value={invoice.buyerDetails?.gstin || ''}
                                onChange={(e) => handleUpdate('buyerDetails', { ...invoice.buyerDetails, gstin: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label>Billing Address</Label>
                            <Input
                                value={invoice.buyerDetails?.address || ''}
                                onChange={(e) => handleUpdate('buyerDetails', { ...invoice.buyerDetails, address: e.target.value })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Line Items</CardTitle>
                    {catalogItems.length > 0 && (
                        <Select onValueChange={importFromCatalog}>
                            <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue placeholder="Import from Catalog" /></SelectTrigger>
                            <SelectContent>
                                {catalogItems.map(c => <SelectItem key={c.id} value={c.id}>{c.description}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {(invoice.items || []).map((item, idx) => (
                            <div key={item.id} className="grid grid-cols-12 gap-2 items-end border border-slate-200 dark:border-slate-800 p-4 rounded-md shadow-sm relative group bg-slate-50/50 dark:bg-slate-900/50">
                                <Button
                                    variant="destructive" size="icon"
                                    className="absolute -top-3 -right-3 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem(idx)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>

                                <div className="col-span-12 md:col-span-4 space-y-2">
                                    <Label className="text-xs">Description</Label>
                                    <Input value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} />
                                </div>
                                <div className="col-span-6 md:col-span-2 space-y-2">
                                    <Label className="text-xs">HSN</Label>
                                    <Input value={item.hsnCode || ''} onChange={e => updateItem(idx, 'hsnCode', e.target.value)} />
                                </div>
                                <div className="col-span-6 md:col-span-1 space-y-2">
                                    <Label className="text-xs">Qty</Label>
                                    <Input type="number" min={1} value={item.qty === 0 ? '' : item.qty} onChange={e => updateItem(idx, 'qty', Number(e.target.value))} />
                                </div>
                                <div className="col-span-4 md:col-span-2 space-y-2">
                                    <Label className="text-xs">Rate (₹)</Label>
                                    <Input type="number" value={item.rate === 0 ? '' : item.rate} onChange={e => updateItem(idx, 'rate', Number(e.target.value))} />
                                </div>
                                <div className="col-span-4 md:col-span-1 space-y-2">
                                    <Label className="text-xs">Tax %</Label>
                                    <Input type="number" max={100} value={item.taxPercent === 0 ? '' : item.taxPercent} onChange={e => updateItem(idx, 'taxPercent', Number(e.target.value))} />
                                </div>
                                <div className="col-span-4 md:col-span-2 space-y-2">
                                    <Label className="text-xs">Total (₹)</Label>
                                    <Input className="font-semibold" readOnly value={(item.total || 0).toFixed(2)} />
                                </div>
                            </div>
                        ))}

                        <Button variant="outline" className="w-full border-dashed" onClick={addItemRow}>
                            <Plus className="w-4 h-4 mr-2" /> Add Line Item
                        </Button>

                        <div className="mt-8 border-t pt-4 space-y-2 ml-auto w-full md:w-1/2 lg:w-2/3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Subtotal</span>
                                <span className="font-medium">₹ {(invoice.subtotal || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Taxes ({invoice.taxType === 'IGST' ? 'IGST' : 'CGST + SGST'})</span>
                                <span className="font-medium">₹ {(invoice.taxAmount || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Grand Total</span>
                                <span className="text-primary">₹ {(invoice.grandTotal || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
