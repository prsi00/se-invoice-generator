import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { StateStorage } from 'zustand/middleware'
import { get, set, del } from 'idb-keyval'

// Custom storage for idb-keyval
const idbStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        return (await get(name)) || null
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await set(name, value)
    },
    removeItem: async (name: string): Promise<void> => {
        await del(name)
    },
}

// Interfaces
export interface Firm {
    id: string;
    name: string;
    logo?: string; // base64
    address: string;
    gstin?: string;
    bankDetails?: string;
    payeeId?: string;
    defaultTemplate?: 'standard' | 'minimal' | 'creative' | 'elegant' | 'bold';
    termsAndConditions?: string;
    signatoryName?: string;
}

export interface Client {
    id: string;
    name: string;
    address: string;
    gstin?: string;
}

export interface CatalogItem {
    id: string;
    description: string;
    hsnCode?: string;
    rate: number;
    taxPercent: number;
}

export interface InvoiceItem {
    id: string;
    description: string;
    hsnCode?: string;
    qty: number;
    rate: number;
    discountPercent?: number;
    taxPercent: number;
    total: number;
}

export interface Invoice {
    id: string;
    invoiceNo: string;
    date: string;
    dueDate?: string;
    firmId: string;
    buyerDetails: Client; // snapshot
    items: InvoiceItem[];
    subtotal: number;
    taxType: 'IGST' | 'CGST_SGST';
    taxAmount: number;
    grandTotal: number;
    status: 'Draft' | 'Pending' | 'Paid';
    template?: 'standard' | 'minimal' | 'creative' | 'elegant' | 'bold';
    termsAndConditions?: string;
    signatoryName?: string;
}

interface AppState {
    firms: Firm[];
    clients: Client[];
    items: CatalogItem[];
    invoices: Invoice[];
    activeFirmId: string | null;

    // Actions
    addFirm: (firm: Firm) => void;
    updateFirm: (id: string, firm: Partial<Firm>) => void;
    deleteFirm: (id: string) => void;
    setActiveFirm: (id: string) => void;

    addClient: (client: Client) => void;
    updateClient: (id: string, client: Partial<Client>) => void;
    deleteClient: (id: string) => void;

    addItem: (item: CatalogItem) => void;
    updateItem: (id: string, item: Partial<CatalogItem>) => void;
    deleteItem: (id: string) => void;

    addInvoice: (invoice: Invoice) => void;
    updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
    deleteInvoice: (id: string) => void;

    importData: (data: string) => void;
    exportData: () => string;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            firms: [],
            clients: [],
            items: [],
            invoices: [],
            activeFirmId: null,

            addFirm: (firm) => set((state) => ({ firms: [...state.firms, firm], activeFirmId: state.activeFirmId || firm.id })),
            updateFirm: (id, firmUpdate) => set((state) => ({
                firms: state.firms.map((f) => f.id === id ? { ...f, ...firmUpdate } : f)
            })),
            deleteFirm: (id) => set((state) => ({
                firms: state.firms.filter((f) => f.id !== id),
                activeFirmId: state.activeFirmId === id ? null : state.activeFirmId
            })),
            setActiveFirm: (id) => set({ activeFirmId: id }),

            addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
            updateClient: (id, clientUpdate) => set((state) => ({
                clients: state.clients.map((c) => c.id === id ? { ...c, ...clientUpdate } : c)
            })),
            deleteClient: (id) => set((state) => ({
                clients: state.clients.filter((c) => c.id !== id)
            })),

            addItem: (item) => set((state) => ({ items: [...state.items, item] })),
            updateItem: (id, itemUpdate) => set((state) => ({
                items: state.items.map((i) => i.id === id ? { ...i, ...itemUpdate } : i)
            })),
            deleteItem: (id) => set((state) => ({
                items: state.items.filter((i) => i.id !== id)
            })),

            addInvoice: (invoice) => set((state) => ({ invoices: [...state.invoices, invoice] })),
            updateInvoice: (id, invoiceUpdate) => set((state) => ({
                invoices: state.invoices.map((inv) => inv.id === id ? { ...inv, ...invoiceUpdate } : inv)
            })),
            deleteInvoice: (id) => set((state) => ({
                invoices: state.invoices.filter((inv) => inv.id !== id)
            })),

            importData: (dataStr) => {
                try {
                    const parsed = JSON.parse(dataStr);
                    if (parsed && typeof parsed === 'object') {
                        set((state) => ({
                            firms: parsed.firms || state.firms,
                            clients: parsed.clients || state.clients,
                            items: parsed.items || state.items,
                            invoices: parsed.invoices || state.invoices,
                            activeFirmId: parsed.activeFirmId || state.activeFirmId
                        }));
                    }
                } catch (e) {
                    console.error("Failed to parse import data", e);
                }
            },
            exportData: () => {
                const state = get();
                return JSON.stringify({
                    firms: state.firms,
                    clients: state.clients,
                    items: state.items,
                    invoices: state.invoices,
                    activeFirmId: state.activeFirmId
                }, null, 2);
            }
        }),
        {
            name: 'invoice-gen-storage',
            storage: createJSONStorage(() => idbStorage),
        }
    )
)
