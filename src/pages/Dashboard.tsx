import { useNavigate } from 'react-router-dom'
import { Plus, MoreVertical, FileText, Download, Copy, Trash2, Edit } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function Dashboard() {
    const navigate = useNavigate()
    const { invoices, deleteInvoice } = useStore()

    // Sort by newest first
    const sortedInvoices = [...invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-slate-500">Manage your invoices</p>
                </div>
                <Button onClick={() => navigate('/invoice/new')}>
                    <Plus className="w-4 h-4 mr-2" /> New Invoice
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {sortedInvoices.length > 0 ? (
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 uppercase">
                                        <tr>
                                            <th className="px-6 py-4 rounded-tl-lg">Invoice No</th>
                                            <th className="px-6 py-4">Client</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right rounded-tr-lg">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {sortedInvoices.map((inv) => (
                                            <tr key={inv.id} className="bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                                <td className="px-6 py-4 font-medium">{inv.invoiceNo}</td>
                                                <td className="px-6 py-4">{inv.buyerDetails?.name || 'Unknown'}</td>
                                                <td className="px-6 py-4">{new Date(inv.date).toLocaleDateString('en-IN')}</td>
                                                <td className="px-6 py-4 font-semibold">{formatCurrency(inv.grandTotal)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(inv.status)}`}>
                                                        {inv.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => navigate(`/invoice/edit/${inv.id}`)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => navigate(`/invoice/edit/${inv.id}`)}>
                                                                <Download className="w-4 h-4 mr-2" /> Edit / View PDF
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive" onClick={() => {
                                                                if (window.confirm("Are you sure you want to delete this invoice?")) {
                                                                    deleteInvoice(inv.id)
                                                                }
                                                            }}>
                                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-dashed border-2 bg-transparent shadow-none">
                        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                                <FileText className="w-8 h-8" />
                            </div>
                            <CardTitle className="mb-2">No Invoices Yet</CardTitle>
                            <CardDescription className="mb-6 mb-max-w-xs">
                                Create your first invoice to get started. Be sure to set up your Firm Profile in Settings first!
                            </CardDescription>
                            <Button onClick={() => navigate('/invoice/new')}>
                                Create First Invoice
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
