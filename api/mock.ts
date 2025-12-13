
import { db } from '../lib/local-db';
import { 
    Villa, Booking, Client, MaintenanceTicket, Task, Expense, Invoice, Supplier, 
    ServiceRequest, InventoryItem, StaffMember, BlogPost, GuideItem, PremiumService, 
    FAQItem, MarketingCampaign, Category, IndexPageSettings, Review, ClientInteraction,
    VillaStatus 
} from '../types';

const DELAY = 400; // Realistic latency

const delay = <T>(data: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), DELAY));
};

export const api = {
    // --- VILLAS ---
    getVillas: () => delay(db.get('villas')),
    addVilla: (villa: Villa) => delay(db.addItem('villas', villa)),
    updateVilla: (villa: Villa) => delay(db.updateItem('villas', villa)),
    deleteVilla: (id: string) => delay(db.deleteItem('villas', id)),

    // --- BOOKINGS ---
    getBookings: () => delay(db.get('bookings')),
    addBooking: (booking: Booking) => delay(db.addItem('bookings', booking)),
    updateBooking: (booking: Booking) => delay(db.updateItem('bookings', booking)),
    deleteBooking: (id: string) => delay(db.deleteItem('bookings', id)),

    // --- CLIENTS ---
    getClients: () => delay(db.get('clients')),
    addClient: (client: Client) => delay(db.addItem('clients', client)),
    updateClient: (client: Client) => delay(db.updateItem('clients', client)),
    deleteClient: (id: string) => delay(db.deleteItem('clients', id)),

    // --- OPS: TICKETS & TASKS ---
    getTickets: () => delay(db.get('tickets')),
    addTicket: (ticket: MaintenanceTicket) => delay(db.addItem('tickets', ticket)),
    updateTicket: (ticket: MaintenanceTicket) => delay(db.updateItem('tickets', ticket)),
    deleteTicket: (id: string) => delay(db.deleteItem('tickets', id)),

    getTasks: () => delay(db.get('tasks')),
    addTask: (task: Task) => delay(db.addItem('tasks', task)),
    updateTask: (task: Task) => delay(db.updateItem('tasks', task)),
    deleteTask: (id: string) => delay(db.deleteItem('tasks', id)),

    // --- FINANCE ---
    getExpenses: () => delay(db.get('expenses')),
    addExpense: (expense: Expense) => delay(db.addItem('expenses', expense)),
    deleteExpense: (id: string) => delay(db.deleteItem('expenses', id)),

    getInvoices: () => delay(db.get('invoices')),
    addInvoice: (invoice: Invoice) => delay(db.addItem('invoices', invoice)),
    deleteInvoice: (id: string) => delay(db.deleteItem('invoices', id)),

    // --- CMS ---
    getBlogPosts: () => delay(db.get('blog')),
    addBlogPost: (post: BlogPost) => delay(db.addItem('blog', post)),
    updateBlogPost: (post: BlogPost) => delay(db.updateItem('blog', post)),
    deleteBlogPost: (id: string) => delay(db.deleteItem('blog', id)),

    getCategories: () => delay(db.get('categories')),
    addCategory: (cat: Category) => delay(db.addItem('categories', cat)),
    updateCategory: (cat: Category) => delay(db.updateItem('categories', cat)),
    deleteCategory: (id: string) => delay(db.deleteItem('categories', id)),

    getIndexSettings: () => delay(db.get('pageSettings')),
    updateIndexSettings: (settings: IndexPageSettings) => delay(db.updateItem('pageSettings', settings)),

    getGuideItems: () => delay(db.get('guide')),
    addGuideItem: (item: GuideItem) => delay(db.addItem('guide', item)),
    updateGuideItem: (item: GuideItem) => delay(db.updateItem('guide', item)),
    deleteGuideItem: (id: string) => delay(db.deleteItem('guide', id)),

    getPremiumServices: () => delay(db.get('services')),
    addPremiumService: (item: PremiumService) => delay(db.addItem('services', item)),
    updatePremiumService: (item: PremiumService) => delay(db.updateItem('services', item)),
    deletePremiumService: (id: string) => delay(db.deleteItem('services', id)),

    getFAQs: () => delay(db.get('faqs')),
    addFAQ: (item: FAQItem) => delay(db.addItem('faqs', item)),
    updateFAQ: (item: FAQItem) => delay(db.updateItem('faqs', item)),
    deleteFAQ: (id: string) => delay(db.deleteItem('faqs', id)),

    // --- OTHER ---
    getInventory: () => delay(db.get('inventory')),
    addInventory: (item: InventoryItem) => delay(db.addItem('inventory', item)),
    updateInventory: (item: InventoryItem) => delay(db.updateItem('inventory', item)),
    deleteInventory: (id: string) => delay(db.deleteItem('inventory', id)),

    getStaff: () => delay(db.get('staff')),
    addStaff: (member: StaffMember) => delay(db.addItem('staff', member)),
    updateStaff: (member: StaffMember) => delay(db.updateItem('staff', member)),
    deleteStaff: (id: string) => delay(db.deleteItem('staff', id)),

    getServiceRequests: () => delay(db.get('requests')),
    addServiceRequest: (req: ServiceRequest) => delay(db.addItem('requests', req)),
    updateServiceRequest: (req: ServiceRequest) => delay(db.updateItem('requests', req)),

    getMarketingCampaigns: () => delay(db.get('campaigns')),
    addMarketingCampaign: (camp: MarketingCampaign) => delay(db.addItem('campaigns', camp)),
    updateMarketingCampaign: (camp: MarketingCampaign) => delay(db.updateItem('campaigns', camp)),

    // Transients
    getReviews: () => delay(db.get('reviews')),
    getInteractions: () => delay(db.get('interactions')),
    
    // Admin Helpers
    resetDB: () => delay(db.reset()),
    updateTranslations: (translations: any) => {
        db.set('translations', translations);
        return delay(translations);
    }
};
