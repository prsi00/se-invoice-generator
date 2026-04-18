import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FirmTab } from "./settings/FirmTab"
import { ClientTab } from "./settings/ClientTab"
import { CatalogTab } from "./settings/CatalogTab"
import { DataTab } from "./settings/DataTab"

export function Settings() {
    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Settings & Data Management</h1>
            <Tabs defaultValue="firms" className="w-full">
                <TabsList className="mb-6 bg-slate-200 dark:bg-slate-800">
                    <TabsTrigger value="firms">Firm Profiles</TabsTrigger>
                    <TabsTrigger value="clients">Address Book</TabsTrigger>
                    <TabsTrigger value="catalog">Items Catalog</TabsTrigger>
                    <TabsTrigger value="data">Data Sync</TabsTrigger>
                </TabsList>
                <TabsContent value="firms"><FirmTab /></TabsContent>
                <TabsContent value="clients"><ClientTab /></TabsContent>
                <TabsContent value="catalog"><CatalogTab /></TabsContent>
                <TabsContent value="data"><DataTab /></TabsContent>
            </Tabs>
        </div>
    )
}
