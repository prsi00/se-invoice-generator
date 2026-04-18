import { useState } from 'react'
import { Plus, Trash2, Edit } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { CatalogItem } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function CatalogTab() {
    const { items, addItem, updateItem, deleteItem } = useStore()
    const [isEditing, setIsEditing] = useState(false)
    const [currentItem, setCurrentItem] = useState<Partial<CatalogItem>>({ taxPercent: 0, rate: 0 })

    const handleSave = () => {
        if (!currentItem.description) return
        if (currentItem.id) {
            updateItem(currentItem.id, currentItem)
        } else {
            addItem({ ...currentItem, id: window.crypto.randomUUID() } as CatalogItem)
        }
        setIsEditing(false)
        setCurrentItem({ taxPercent: 0, rate: 0 })
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Items Catalog</h2>
                {!isEditing && (
                    <Button onClick={() => { setCurrentItem({ taxPercent: 0, rate: 0 }); setIsEditing(true) }}>
                        <Plus className="w-4 h-4 mr-2" /> Add Item
                    </Button>
                )}
            </div>

            {isEditing ? (
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label>Item Description *</Label>
                                <Input value={currentItem.description || ''} onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Rate (₹) *</Label>
                                <Input type="number" min={0} value={currentItem.rate || ''} onChange={e => setCurrentItem({ ...currentItem, rate: Number(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <Label>HSN Code</Label>
                                <Input value={currentItem.hsnCode || ''} onChange={e => setCurrentItem({ ...currentItem, hsnCode: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Tax (%) *</Label>
                                <Input type="number" min={0} max={100} value={currentItem.taxPercent !== undefined ? currentItem.taxPercent : ''} onChange={e => setCurrentItem({ ...currentItem, taxPercent: Number(e.target.value) })} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save Item</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map(item => (
                        <Card key={item.id}>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{item.description}</h3>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => { setCurrentItem(item); setIsEditing(true) }}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteItem(item.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 mt-4">
                                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Rate: ₹{item.rate}</span>
                                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Tax: {item.taxPercent}%</span>
                                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">HSN: {item.hsnCode || 'N/A'}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {items.length === 0 && (
                        <p className="text-slate-500 col-span-2 text-center py-8">No items added to catalog yet.</p>
                    )}
                </div>
            )}
        </div>
    )
}
