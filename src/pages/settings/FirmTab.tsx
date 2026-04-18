import { useState } from 'react'
import { Plus, Trash2, Edit } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { Firm } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function FirmTab() {
    const { firms, addFirm, updateFirm, deleteFirm, activeFirmId, setActiveFirm } = useStore()
    const [isEditing, setIsEditing] = useState(false)
    const [currentFirm, setCurrentFirm] = useState<Partial<Firm>>({})

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setCurrentFirm({ ...currentFirm, logo: reader.result as string })
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = () => {
        if (!currentFirm.name || !currentFirm.address) return
        if (currentFirm.id) {
            updateFirm(currentFirm.id, currentFirm)
        } else {
            addFirm({ ...currentFirm, id: window.crypto.randomUUID() } as Firm)
        }
        setIsEditing(false)
        setCurrentFirm({})
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Firm Profiles</h2>
                {!isEditing && (
                    <Button onClick={() => { setCurrentFirm({}); setIsEditing(true) }}>
                        <Plus className="w-4 h-4 mr-2" /> Add Firm
                    </Button>
                )}
            </div>

            {isEditing ? (
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Company Name *</Label>
                                <Input value={currentFirm.name || ''} onChange={e => setCurrentFirm({ ...currentFirm, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>GSTIN</Label>
                                <Input value={currentFirm.gstin || ''} onChange={e => setCurrentFirm({ ...currentFirm, gstin: e.target.value })} />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Firm Logo (Optional)</Label>
                                <div className="flex items-center gap-4">
                                    {currentFirm.logo && (
                                        <img src={currentFirm.logo} alt="Logo" className="w-16 h-16 object-contain border rounded" />
                                    )}
                                    <Input type="file" accept="image/*" onChange={handleLogoUpload} />
                                </div>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Default PDF Template Theme</Label>
                                <Select value={currentFirm.defaultTemplate || 'standard'} onValueChange={(v: any) => setCurrentFirm({ ...currentFirm, defaultTemplate: v })}>
                                    <SelectTrigger><SelectValue placeholder="Select Default Theme" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="standard">Standard Corporate</SelectItem>
                                        <SelectItem value="minimal">Modern Minimal</SelectItem>
                                        <SelectItem value="creative">Creative Accent</SelectItem>
                                        <SelectItem value="elegant">Elegant Serif</SelectItem>
                                        <SelectItem value="bold">Bold Dark Header</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Address *</Label>
                                <Input value={currentFirm.address || ''} onChange={e => setCurrentFirm({ ...currentFirm, address: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Bank Details (A/c No, IFSC)</Label>
                                <Input value={currentFirm.bankDetails || ''} onChange={e => setCurrentFirm({ ...currentFirm, bankDetails: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>UPI ID</Label>
                                <Input value={currentFirm.upiId || ''} onChange={e => setCurrentFirm({ ...currentFirm, upiId: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save Firm</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {firms.map(firm => (
                        <Card key={firm.id} className={activeFirmId === firm.id ? "border-primary shadow-sm" : ""}>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{firm.name}</h3>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => { setCurrentFirm(firm); setIsEditing(true) }}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteFirm(firm.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 mb-4">{firm.address}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                                        GST: {firm.gstin || 'N/A'}
                                    </span>
                                    {activeFirmId !== firm.id && (
                                        <Button variant="outline" size="sm" onClick={() => setActiveFirm(firm.id)}>Set Active</Button>
                                    )}
                                    {activeFirmId === firm.id && (
                                        <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded">Active Default</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {firms.length === 0 && (
                        <p className="text-slate-500 col-span-2 text-center py-8">No firms added yet. Add a firm to start generating invoices.</p>
                    )}
                </div>
            )}
        </div>
    )
}
