
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api/mock';
import { 
    Booking, Client, MaintenanceTicket, Task, Expense, Supplier, ServiceRequest, 
    InventoryItem, StaffMember, Villa, BookingStatus, BlogPost, GuideItem, 
    PremiumService, FAQItem, MarketingCampaign, Review, ClientInteraction, 
    VillaStatus, ChatMessage, Invoice, Category, IndexPageSettings 
} from './types';
import { TRANSLATIONS, MOCK_VILLA_STATUS, MOCK_CHAT } from './constants';

interface DataContextType {
    // Entities (Read)
    bookings: Booking[];
    clients: Client[];
    tickets: MaintenanceTicket[];
    tasks: Task[];
    expenses: Expense[];
    invoices: Invoice[];
    suppliers: Supplier[];
    serviceRequests: ServiceRequest[];
    inventory: InventoryItem[];
    staff: StaffMember[];
    villas: Villa[];
    villaStatuses: VillaStatus[];
    teamChat: ChatMessage[];
    marketingCampaigns: MarketingCampaign[];
    categories: Category[];
    indexPageSettings: IndexPageSettings[];
    blogPosts: BlogPost[];
    guideItems: GuideItem[];
    premiumServices: PremiumService[];
    faqs: FAQItem[];
    reviews: Review[];
    clientInteractions: ClientInteraction[];
    
    // Mutations (Write)
    addBooking: (booking: Booking) => void;
    updateBooking: (booking: Booking) => void;
    deleteBooking: (id: string) => void;
    updateBookingStatus: (id: string, status: BookingStatus) => void;
    
    addClient: (client: Client) => void;
    updateClient: (client: Client) => void;
    deleteClient: (id: string) => void;
    
    addTicket: (ticket: MaintenanceTicket) => void;
    updateTicketStatus: (id: string, status: any) => void;
    deleteTicket: (id: string) => void;
    
    addTask: (task: Task) => void;
    updateTask: (task: Task) => void; // REMPLACÉ: updateTaskStatus -> updateTask
    deleteTask: (id: string) => void;
    
    addExpense: (expense: Expense) => void;
    deleteExpense: (id: string) => void;
    
    addInvoice: (invoice: Invoice) => void;
    updateInvoiceStatus: (id: string, status: 'PAID' | 'UNPAID' | 'OVERDUE') => void;
    deleteInvoice: (id: string) => void;

    addSupplier: (supplier: Supplier) => void;
    
    addServiceRequest: (req: ServiceRequest) => void;
    updateServiceRequestStatus: (id: string, status: any) => void;
    
    addInventoryItem: (item: InventoryItem) => void;
    updateInventory: (id: string, quantity: number) => void;
    updateInventoryItem: (item: InventoryItem) => void;
    deleteInventoryItem: (id: string) => void;
    
    addStaffMember: (member: StaffMember) => void;
    updateStaffMember: (member: StaffMember) => void;
    deleteStaffMember: (id: string) => void;
    updateStaffSchedule: (staffId: string, dayIndex: number, newShift: string) => void;
    
    addVilla: (villa: Villa) => void;
    updateVilla: (villa: Villa) => void;
    deleteVilla: (id: string) => void;

    updateVillaStatus: (id: string, status: Partial<VillaStatus>) => void;
    addTeamMessage: (msg: ChatMessage) => void;

    addMarketingCampaign: (campaign: MarketingCampaign) => void;
    updateCampaignStatus: (id: string, status: 'DRAFT' | 'SCHEDULED' | 'SENT') => void;

    addCategory: (category: Category) => void;
    updateCategory: (category: Category) => void;
    deleteCategory: (id: string) => void;

    updateIndexPageSettings: (settings: IndexPageSettings) => void;

    addBlogPost: (post: BlogPost) => void;
    updateBlogPost: (post: BlogPost) => void;
    deleteBlogPost: (id: string) => void;

    addGuideItem: (item: GuideItem) => void;
    updateGuideItem: (item: GuideItem) => void;
    deleteGuideItem: (id: string) => void;

    addPremiumService: (service: PremiumService) => void;
    updatePremiumService: (service: PremiumService) => void;
    deletePremiumService: (id: string) => void;

    addFAQ: (faq: FAQItem) => void;
    updateFAQ: (faq: FAQItem) => void;
    deleteFAQ: (id: string) => void;

    addReview: (review: Review) => void;
    addInteraction: (interaction: ClientInteraction) => void;

    // Misc
    translations: typeof TRANSLATIONS;
    updateTranslation: (lang: keyof typeof TRANSLATIONS, key: string, value: string) => void;
    mediaLibrary: string[];
    addMedia: (url: string) => void;
    resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    // --- QUERIES (READ) ---
    const { data: villas = [] } = useQuery({ queryKey: ['villas'], queryFn: api.getVillas });
    const { data: bookings = [] } = useQuery({ queryKey: ['bookings'], queryFn: api.getBookings });
    const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: api.getClients });
    const { data: tickets = [] } = useQuery({ queryKey: ['tickets'], queryFn: api.getTickets });
    const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: api.getTasks });
    const { data: expenses = [] } = useQuery({ queryKey: ['expenses'], queryFn: api.getExpenses });
    const { data: invoices = [] } = useQuery({ queryKey: ['invoices'], queryFn: api.getInvoices });
    const { data: inventory = [] } = useQuery({ queryKey: ['inventory'], queryFn: api.getInventory });
    const { data: staff = [] } = useQuery({ queryKey: ['staff'], queryFn: api.getStaff });
    const { data: blogPosts = [] } = useQuery({ queryKey: ['blog'], queryFn: api.getBlogPosts });
    const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: api.getCategories });
    const { data: indexPageSettings = [] } = useQuery({ queryKey: ['pageSettings'], queryFn: api.getIndexSettings });
    const { data: guideItems = [] } = useQuery({ queryKey: ['guide'], queryFn: api.getGuideItems });
    const { data: premiumServices = [] } = useQuery({ queryKey: ['services'], queryFn: api.getPremiumServices });
    const { data: faqs = [] } = useQuery({ queryKey: ['faqs'], queryFn: api.getFAQs });
    const { data: serviceRequests = [] } = useQuery({ queryKey: ['requests'], queryFn: api.getServiceRequests });
    const { data: marketingCampaigns = [] } = useQuery({ queryKey: ['campaigns'], queryFn: api.getMarketingCampaigns });
    
    // Local state for transient data
    const [villaStatuses, setVillaStatuses] = useState<VillaStatus[]>(MOCK_VILLA_STATUS);
    const [teamChat, setTeamChat] = useState<ChatMessage[]>(MOCK_CHAT);
    const [translations, setTranslations] = useState(TRANSLATIONS);
    const [mediaLibrary, setMediaLibrary] = useState<string[]>([
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800',
        'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=800',
        'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=800',
        'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800',
        'https://images.unsplash.com/photo-1597250559670-36209b19e2e5?q=80&w=800',
        'https://images.unsplash.com/photo-1563294860-2646270b2c3d?q=80&w=800',
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800',
        'https://images.unsplash.com/photo-1621852004158-b3916ebee016?q=80&w=800',
        'https://images.unsplash.com/photo-1558005530-a7958896ec60?q=80&w=800',
        'https://images.unsplash.com/photo-1523592121529-f6dde35f079e?q=80&w=800'
    ]);
    const [suppliers] = useState<Supplier[]>([]); 
    const [reviews] = useState<Review[]>([]);
    const [clientInteractions] = useState<ClientInteraction[]>([]);

    // --- MUTATIONS ---
    const invalidate = (key: string) => queryClient.invalidateQueries({ queryKey: [key] });

    // Core Mutations
    const addVillaMut = useMutation({ mutationFn: api.addVilla, onSuccess: () => invalidate('villas') });
    const updateVillaMut = useMutation({ mutationFn: api.updateVilla, onSuccess: () => invalidate('villas') });
    const deleteVillaMut = useMutation({ mutationFn: api.deleteVilla, onSuccess: () => invalidate('villas') });

    const addBookingMut = useMutation({ mutationFn: api.addBooking, onSuccess: () => invalidate('bookings') });
    const updateBookingMut = useMutation({ mutationFn: api.updateBooking, onSuccess: () => invalidate('bookings') });
    const deleteBookingMut = useMutation({ mutationFn: api.deleteBooking, onSuccess: () => invalidate('bookings') });

    const addClientMut = useMutation({ mutationFn: api.addClient, onSuccess: () => invalidate('clients') });
    const updateClientMut = useMutation({ mutationFn: api.updateClient, onSuccess: () => invalidate('clients') });
    const deleteClientMut = useMutation({ mutationFn: api.deleteClient, onSuccess: () => invalidate('clients') });

    const addTaskMut = useMutation({ mutationFn: api.addTask, onSuccess: () => invalidate('tasks') });
    const updateTaskMut = useMutation({ mutationFn: api.updateTask, onSuccess: () => invalidate('tasks') });
    const deleteTaskMut = useMutation({ mutationFn: api.deleteTask, onSuccess: () => invalidate('tasks') });

    const addTicketMut = useMutation({ mutationFn: api.addTicket, onSuccess: () => invalidate('tickets') });
    const updateTicketMut = useMutation({ mutationFn: api.updateTicket, onSuccess: () => invalidate('tickets') });
    const deleteTicketMut = useMutation({ mutationFn: api.deleteTicket, onSuccess: () => invalidate('tickets') });

    // CMS & Others
    const addPostMut = useMutation({ mutationFn: api.addBlogPost, onSuccess: () => invalidate('blog') });
    const updatePostMut = useMutation({ mutationFn: api.updateBlogPost, onSuccess: () => invalidate('blog') });
    const deletePostMut = useMutation({ mutationFn: api.deleteBlogPost, onSuccess: () => invalidate('blog') });
    const addCatMut = useMutation({ mutationFn: api.addCategory, onSuccess: () => invalidate('categories') });
    const updateCatMut = useMutation({ mutationFn: api.updateCategory, onSuccess: () => invalidate('categories') });
    const deleteCatMut = useMutation({ mutationFn: api.deleteCategory, onSuccess: () => invalidate('categories') });
    const updateSettingsMut = useMutation({ mutationFn: api.updateIndexSettings, onSuccess: () => invalidate('pageSettings') });

    // Wrappers
    const addVilla = (v: Villa) => addVillaMut.mutate(v);
    const updateVilla = (v: Villa) => updateVillaMut.mutate(v);
    const deleteVilla = (id: string) => deleteVillaMut.mutate(id);

    const addBooking = (b: Booking) => addBookingMut.mutate(b);
    const updateBooking = (b: Booking) => updateBookingMut.mutate(b);
    const deleteBooking = (id: string) => deleteBookingMut.mutate(id);
    const updateBookingStatus = (id: string, status: BookingStatus) => {
        const booking = bookings.find(b => b.id === id);
        if(booking) updateBookingMut.mutate({ ...booking, status });
    };

    const addClient = (c: Client) => addClientMut.mutate(c);
    const updateClient = (c: Client) => updateClientMut.mutate(c);
    const deleteClient = (id: string) => deleteClientMut.mutate(id);

    const addTicket = (t: MaintenanceTicket) => addTicketMut.mutate(t);
    const updateTicketStatus = (id: string, status: any) => {
        const ticket = tickets.find(t => t.id === id);
        if(ticket) updateTicketMut.mutate({ ...ticket, status });
    };
    const deleteTicket = (id: string) => deleteTicketMut.mutate(id);

    const addTask = (t: Task) => addTaskMut.mutate(t);
    const updateTask = (t: Task) => updateTaskMut.mutate(t); // Direct update
    const deleteTask = (id: string) => deleteTaskMut.mutate(id);

    // Other entities...
    const addExpense = (e: Expense) => api.addExpense(e).then(() => invalidate('expenses'));
    const deleteExpense = (id: string) => api.deleteExpense(id).then(() => invalidate('expenses'));
    const addInvoice = (i: Invoice) => api.addInvoice(i).then(() => invalidate('invoices'));
    const deleteInvoice = (id: string) => api.deleteInvoice(id).then(() => invalidate('invoices'));
    const updateInvoiceStatus = () => {}; 
    const addSupplier = () => {};
    const addServiceRequest = (r: ServiceRequest) => api.addServiceRequest(r).then(() => invalidate('requests'));
    const updateServiceRequestStatus = (id: string, status: any) => {
        const req = serviceRequests.find(r => r.id === id);
        if(req) api.updateServiceRequest({...req, status}).then(() => invalidate('requests'));
    };
    const addInventoryItem = (i: InventoryItem) => api.addInventory(i).then(() => invalidate('inventory'));
    const updateInventory = (id: string, qty: number) => {
        const item = inventory.find(i => i.id === id);
        if(item) api.updateInventory({...item, quantity: qty}).then(() => invalidate('inventory'));
    };
    const updateInventoryItem = (item: InventoryItem) => api.updateInventory(item).then(() => invalidate('inventory'));
    const deleteInventoryItem = (id: string) => api.deleteInventory(id).then(() => invalidate('inventory'));
    const addStaffMember = (s: StaffMember) => api.addStaff(s).then(() => invalidate('staff'));
    const updateStaffMember = (s: StaffMember) => api.updateStaff(s).then(() => invalidate('staff'));
    const deleteStaffMember = (id: string) => api.deleteStaff(id).then(() => invalidate('staff'));
    const updateStaffSchedule = (staffId: string, dayIndex: number, newShift: string) => {
        const member = staff.find(s => s.id === staffId);
        if(member) {
            const newSchedule = [...member.schedule];
            newSchedule[dayIndex] = { ...newSchedule[dayIndex], shift: newShift as any };
            api.updateStaff({...member, schedule: newSchedule}).then(() => invalidate('staff'));
        }
    };
    const updateVillaStatus = (id: string, status: Partial<VillaStatus>) => {
        setVillaStatuses(prev => prev.map(v => v.id === id ? { ...v, ...status } : v));
    };
    const addTeamMessage = (msg: ChatMessage) => setTeamChat(prev => [...prev, msg]);
    const addMarketingCampaign = (c: MarketingCampaign) => api.addMarketingCampaign(c).then(() => invalidate('campaigns'));
    const updateCampaignStatus = (id: string, status: any) => {
        const camp = marketingCampaigns.find(c => c.id === id);
        if(camp) api.updateMarketingCampaign({...camp, status}).then(() => invalidate('campaigns'));
    };
    const addBlogPost = (p: BlogPost) => addPostMut.mutate(p);
    const updateBlogPost = (p: BlogPost) => updatePostMut.mutate(p);
    const deleteBlogPost = (id: string) => deletePostMut.mutate(id);
    const addCategory = (c: Category) => addCatMut.mutate(c);
    const updateCategory = (c: Category) => updateCatMut.mutate(c);
    const deleteCategory = (id: string) => deleteCatMut.mutate(id);
    const updateIndexPageSettings = (s: IndexPageSettings) => updateSettingsMut.mutate(s);
    const addGuideItem = (i: GuideItem) => api.addGuideItem(i).then(() => invalidate('guide'));
    const updateGuideItem = (i: GuideItem) => api.updateGuideItem(i).then(() => invalidate('guide'));
    const deleteGuideItem = (id: string) => api.deleteGuideItem(id).then(() => invalidate('guide'));
    const addPremiumService = (s: PremiumService) => api.addPremiumService(s).then(() => invalidate('services'));
    const updatePremiumService = (s: PremiumService) => api.updatePremiumService(s).then(() => invalidate('services'));
    const deletePremiumService = (id: string) => api.deletePremiumService(id).then(() => invalidate('services'));
    const addFAQ = (f: FAQItem) => api.addFAQ(f).then(() => invalidate('faqs'));
    const updateFAQ = (f: FAQItem) => api.updateFAQ(f).then(() => invalidate('faqs'));
    const deleteFAQ = (id: string) => api.deleteFAQ(id).then(() => invalidate('faqs'));
    const addReview = () => {};
    const addInteraction = () => {};
    const updateTranslation = (lang: keyof typeof TRANSLATIONS, key: string, value: string) => {
        setTranslations(prev => ({ ...prev, [lang]: { ...prev[lang], [key]: value } }));
    };
    const addMedia = (url: string) => setMediaLibrary(prev => [url, ...prev]);
    const resetData = () => { if(confirm("Attention: Réinitialisation complète.")) window.location.reload(); };

    return (
        <DataContext.Provider value={{
            bookings, addBooking, updateBooking, deleteBooking, updateBookingStatus,
            clients, addClient, updateClient, deleteClient,
            tickets, addTicket, updateTicketStatus, deleteTicket,
            tasks, addTask, updateTask, deleteTask, // Updated
            expenses, addExpense, deleteExpense,
            invoices, addInvoice, updateInvoiceStatus, deleteInvoice,
            suppliers, addSupplier,
            serviceRequests, addServiceRequest, updateServiceRequestStatus,
            inventory, addInventoryItem, updateInventory, updateInventoryItem, deleteInventoryItem,
            staff, addStaffMember, updateStaffMember, deleteStaffMember, updateStaffSchedule,
            teamChat, addTeamMessage,
            marketingCampaigns, addMarketingCampaign, updateCampaignStatus,
            villas, addVilla, updateVilla, deleteVilla,
            villaStatuses, updateVillaStatus,
            categories, addCategory, updateCategory, deleteCategory,
            indexPageSettings, updateIndexPageSettings,
            blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
            guideItems, addGuideItem, updateGuideItem, deleteGuideItem,
            premiumServices, addPremiumService, updatePremiumService, deletePremiumService,
            faqs, addFAQ, updateFAQ, deleteFAQ,
            reviews, addReview,
            clientInteractions, addInteraction,
            translations, updateTranslation,
            mediaLibrary, addMedia,
            resetData
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
