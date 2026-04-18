import { useState } from 'react'
import { Download, Upload } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export function DataTab() {
    const { exportData, importData } = useStore()
    const [importText, setImportText] = useState('')
    const [copied, setCopied] = useState(false)

    const handleExport = () => {
        const data = exportData()
        navigator.clipboard.writeText(data)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)

        // Also trigger file download
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice-gen-backup-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                const text = event.target?.result
                if (text && typeof text === 'string') {
                    importData(text)
                    alert("Data imported successfully!")
                }
            }
            reader.readAsText(file)
        }
    }

    const handleManualImport = () => {
        if (importText.trim()) {
            importData(importText)
            alert("Data imported successfully!")
            setImportText('')
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Export Data</CardTitle>
                    <CardDescription>Download all your firms, clients, items, and invoices as a JSON backup.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleExport} className="w-full">
                        <Download className="w-4 h-4 mr-2" /> {copied ? 'Copied to Clipboard!' : 'Download Backup'}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Import Data</CardTitle>
                    <CardDescription>Restore data from a JSON backup file across devices.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Select JSON File</Label>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or paste raw JSON</span></div>
                    </div>
                    <div className="space-y-2">
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={importText}
                            onChange={e => setImportText(e.target.value)}
                            placeholder="Paste JSON data here..."
                        />
                        <Button onClick={handleManualImport} variant="secondary" className="w-full" disabled={!importText.trim()}>
                            <Upload className="w-4 h-4 mr-2" /> Import Raw JSON
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
