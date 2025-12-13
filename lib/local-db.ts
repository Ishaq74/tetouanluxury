
import * as Seeds from '../database/seed';
import { 
    Villa, Booking, Client, MaintenanceTicket, Task, Expense, Invoice, Supplier, 
    ServiceRequest, InventoryItem, StaffMember, BlogPost, GuideItem, PremiumService, 
    FAQItem, MarketingCampaign, Category, IndexPageSettings, Review, ClientInteraction,
    VillaStatus, ChatMessage
} from '../types';
import { MOCK_VILLA_STATUS, MOCK_CHAT, TRANSLATIONS, MOCK_INDEX_SETTINGS } from '../constants';

const DB_KEY = 'tetouan_villas_db_v3';

interface DatabaseSchema {
    villas: Villa[];
    bookings: Booking[];
    clients: Client[];
    tickets: MaintenanceTicket[];
    tasks: Task[];
    expenses: Expense[];
    invoices: Invoice[];
    suppliers: Supplier[];
    requests: ServiceRequest[];
    inventory: InventoryItem[];
    staff: StaffMember[];
    blog: BlogPost[];
    guide: GuideItem[];
    services: PremiumService[];
    faqs: FAQItem[];
    campaigns: MarketingCampaign[];
    reviews: Review[];
    interactions: ClientInteraction[];
    categories: Category[];
    pageSettings: IndexPageSettings[];
    villaStatuses: VillaStatus[];
    chat: ChatMessage[];
    translations: typeof TRANSLATIONS;
}

const INITIAL_DB: DatabaseSchema = {
    villas: Seeds.VILLAS,
    bookings: Seeds.MOCK_BOOKINGS,
    clients: Seeds.MOCK_CLIENTS,
    tickets: Seeds.MOCK_TICKETS,
    tasks: Seeds.MOCK_TASKS,
    expenses: Seeds.MOCK_EXPENSES,
    invoices: Seeds.MOCK_INVOICES,
    suppliers: Seeds.MOCK_SUPPLIERS,
    requests: Seeds.MOCK_SERVICE_REQUESTS,
    inventory: Seeds.INVENTORY_ITEMS,
    staff: Seeds.MOCK_STAFF,
    blog: Seeds.BLOG_POSTS,
    guide: Seeds.TETOUAN_GUIDE,
    services: Seeds.PREMIUM_SERVICES,
    faqs: Seeds.FAQ_ITEMS,
    campaigns: Seeds.MOCK_MARKETING_CAMPAIGNS,
    reviews: Seeds.MOCK_REVIEWS,
    interactions: Seeds.MOCK_CLIENT_INTERACTIONS,
    categories: Seeds.MOCK_CATEGORIES,
    pageSettings: MOCK_INDEX_SETTINGS,
    villaStatuses: MOCK_VILLA_STATUS,
    chat: MOCK_CHAT,
    translations: TRANSLATIONS
};

// Keys in DatabaseSchema that are arrays (collections)
type CollectionKey = Exclude<keyof DatabaseSchema, 'translations'>;

class LocalDB {
    private data: DatabaseSchema;

    constructor() {
        this.data = this.load();
    }

    private load(): DatabaseSchema {
        if (typeof window === 'undefined') return INITIAL_DB;
        
        const stored = localStorage.getItem(DB_KEY);
        if (!stored) {
            this.save(INITIAL_DB);
            return INITIAL_DB;
        }

        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error("Failed to parse local DB, resetting.", e);
            this.save(INITIAL_DB);
            return INITIAL_DB;
        }
    }

    private save(data: DatabaseSchema) {
        if (typeof window === 'undefined') return;
        localStorage.setItem(DB_KEY, JSON.stringify(data));
        this.data = data;
    }

    // Generic Getters
    public get<K extends keyof DatabaseSchema>(key: K): DatabaseSchema[K] {
        return this.data[key];
    }

    // Generic Setters (Updates entire collection)
    public set<K extends keyof DatabaseSchema>(key: K, value: DatabaseSchema[K]) {
        const newData = { ...this.data, [key]: value };
        this.save(newData);
    }

    // Entity Helpers
    public addItem<K extends CollectionKey>(key: K, item: DatabaseSchema[K] extends Array<infer U> ? U : never) {
        const list = this.data[key] as any[];
        const newData = { ...this.data, [key]: [item, ...list] };
        this.save(newData);
        return item;
    }

    public updateItem<K extends CollectionKey>(key: K, item: DatabaseSchema[K] extends Array<infer U> ? (U extends { id: string } ? U : never) : never) {
        const list = this.data[key] as any[];
        const updatedList = list.map(i => i.id === (item as any).id ? item : i);
        const newData = { ...this.data, [key]: updatedList };
        this.save(newData);
        return item;
    }

    public deleteItem<K extends CollectionKey>(key: K, id: string) {
        const list = this.data[key] as any[];
        const updatedList = list.filter(i => i.id !== id);
        const newData = { ...this.data, [key]: updatedList };
        this.save(newData);
        return id;
    }

    public reset() {
        this.save(INITIAL_DB);
        window.location.reload();
    }
}

export const db = new LocalDB();
