import { useState } from 'react'
import { Plus, Trash2, Edit } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { Client } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ClientTab() {
    const { clients, addClient, updateClient, deleteClient } = useStore()
    const [isEditing, setIsEditing] = useState(false)
    const [currentClient, setCurrentClient] = useState<Partial<Client>>({})

    const handleSave = () => {
        if (!currentClient.name || !currentClient.address) return
        if (currentClient.id) {
            updateClient(currentClient.id, currentClient)
        } else {
            addClient({ ...currentClient, id: window.crypto.randomUUID() } as Client)
        }
        setIsEditing(false)
        setCurrentClient({})
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Address Book</h2>
                {!isEditing && (
                    <Button onClick={() => { setCurrentClient({}); setIsEditing(true) }}>
                        <Plus className="w-4 h-4 mr-2" /> Add Client
                    </Button>
                )}
            </div>

            {isEditing ? (
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Client Name *</Label>
                                <Input value={currentClient.name || ''} onChange={e => setCurrentClient({ ...currentClient, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>GSTIN (Optional)</Label>
                                <Input value={currentClient.gstin || ''} onChange={e => setCurrentClient({ ...currentClient, gstin: e.target.value })} />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Address *</Label>
                                <Input value={currentClient.address || ''} onChange={e => setCurrentClient({ ...currentClient, address: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save Client</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clients.map(client => (
                        <Card key={client.id}>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{client.name}</h3>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => { setCurrentClient(client); setIsEditing(true) }}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteClient(client.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 mb-4">{client.address}</p>
                                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                                    GST: {client.gstin || 'N/A'}
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                    {clients.length === 0 && (
                        <p className="text-slate-500 col-span-2 text-center py-8">No clients added yet.</p>
                    )}
                </div>
            )}
        </div>
    )
}
