import { db } from '../lib/db';
import * as schema from '../database/schema';
import { 
  Villa, Booking, Client, MaintenanceTicket, Task, Expense, Invoice, 
  ServiceRequest, InventoryItem, StaffMember, BlogPost, GuideItem, 
  PremiumService, FAQItem, MarketingCampaign, Category, Review, 
  ClientInteraction 
} from '../types';
import { eq } from 'drizzle-orm';

// Simulated delay for realistic API behavior
const DELAY = 400;
const delay = <T>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), DELAY));
};

export const api = {
  // --- VILLAS ---
  getVillas: async () => {
    const villas = await db.select().from(schema.villas);
    return delay(villas as Villa[]);
  },
  
  addVilla: async (villa: Villa) => {
    const [newVilla] = await db.insert(schema.villas).values(villa).returning();
    return delay(newVilla as Villa);
  },
  
  updateVilla: async (villa: Villa) => {
    const [updated] = await db.update(schema.villas)
      .set(villa)
      .where(eq(schema.villas.id, villa.id))
      .returning();
    return delay(updated as Villa);
  },
  
  deleteVilla: async (id: string) => {
    await db.delete(schema.villas).where(eq(schema.villas.id, id));
    return delay({ success: true });
  },

  // --- BOOKINGS ---
  getBookings: async () => {
    const bookings = await db.select().from(schema.bookings);
    return delay(bookings as Booking[]);
  },
  
  addBooking: async (booking: Booking) => {
    const [newBooking] = await db.insert(schema.bookings).values(booking).returning();
    return delay(newBooking as Booking);
  },
  
  updateBooking: async (booking: Booking) => {
    const [updated] = await db.update(schema.bookings)
      .set(booking)
      .where(eq(schema.bookings.id, booking.id))
      .returning();
    return delay(updated as Booking);
  },
  
  deleteBooking: async (id: string) => {
    await db.delete(schema.bookings).where(eq(schema.bookings.id, id));
    return delay({ success: true });
  },

  // --- CLIENTS ---
  getClients: async () => {
    const clients = await db.select().from(schema.clients);
    return delay(clients as Client[]);
  },
  
  addClient: async (client: Client) => {
    const [newClient] = await db.insert(schema.clients).values(client).returning();
    return delay(newClient as Client);
  },
  
  updateClient: async (client: Client) => {
    const [updated] = await db.update(schema.clients)
      .set(client)
      .where(eq(schema.clients.id, client.id))
      .returning();
    return delay(updated as Client);
  },
  
  deleteClient: async (id: string) => {
    await db.delete(schema.clients).where(eq(schema.clients.id, id));
    return delay({ success: true });
  },

  // --- MAINTENANCE TICKETS ---
  getTickets: async () => {
    const tickets = await db.select().from(schema.maintenanceTickets);
    return delay(tickets as MaintenanceTicket[]);
  },
  
  addTicket: async (ticket: MaintenanceTicket) => {
    const [newTicket] = await db.insert(schema.maintenanceTickets).values(ticket).returning();
    return delay(newTicket as MaintenanceTicket);
  },
  
  updateTicket: async (ticket: MaintenanceTicket) => {
    const [updated] = await db.update(schema.maintenanceTickets)
      .set(ticket)
      .where(eq(schema.maintenanceTickets.id, ticket.id))
      .returning();
    return delay(updated as MaintenanceTicket);
  },
  
  deleteTicket: async (id: string) => {
    await db.delete(schema.maintenanceTickets).where(eq(schema.maintenanceTickets.id, id));
    return delay({ success: true });
  },

  // --- TASKS ---
  getTasks: async () => {
    const tasks = await db.select().from(schema.tasks);
    return delay(tasks as Task[]);
  },
  
  addTask: async (task: Task) => {
    const [newTask] = await db.insert(schema.tasks).values(task).returning();
    return delay(newTask as Task);
  },
  
  updateTask: async (task: Task) => {
    const [updated] = await db.update(schema.tasks)
      .set(task)
      .where(eq(schema.tasks.id, task.id))
      .returning();
    return delay(updated as Task);
  },
  
  deleteTask: async (id: string) => {
    await db.delete(schema.tasks).where(eq(schema.tasks.id, id));
    return delay({ success: true });
  },

  // --- EXPENSES ---
  getExpenses: async () => {
    const expenses = await db.select().from(schema.expenses);
    return delay(expenses as Expense[]);
  },
  
  addExpense: async (expense: Expense) => {
    const [newExpense] = await db.insert(schema.expenses).values(expense).returning();
    return delay(newExpense as Expense);
  },
  
  deleteExpense: async (id: string) => {
    await db.delete(schema.expenses).where(eq(schema.expenses.id, id));
    return delay({ success: true });
  },

  // --- INVOICES ---
  getInvoices: async () => {
    const invoices = await db.select().from(schema.invoices);
    return delay(invoices as Invoice[]);
  },
  
  addInvoice: async (invoice: Invoice) => {
    const [newInvoice] = await db.insert(schema.invoices).values(invoice).returning();
    return delay(newInvoice as Invoice);
  },
  
  deleteInvoice: async (id: string) => {
    await db.delete(schema.invoices).where(eq(schema.invoices.id, id));
    return delay({ success: true });
  },

  // --- BLOG POSTS ---
  getBlogPosts: async () => {
    const posts = await db.select().from(schema.blogPosts);
    return delay(posts as BlogPost[]);
  },
  
  addBlogPost: async (post: BlogPost) => {
    const [newPost] = await db.insert(schema.blogPosts).values(post).returning();
    return delay(newPost as BlogPost);
  },
  
  updateBlogPost: async (post: BlogPost) => {
    const [updated] = await db.update(schema.blogPosts)
      .set(post)
      .where(eq(schema.blogPosts.id, post.id))
      .returning();
    return delay(updated as BlogPost);
  },
  
  deleteBlogPost: async (id: string) => {
    await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
    return delay({ success: true });
  },

  // --- CATEGORIES ---
  getCategories: async () => {
    const categories = await db.select().from(schema.categories);
    return delay(categories as Category[]);
  },
  
  addCategory: async (cat: Category) => {
    const [newCat] = await db.insert(schema.categories).values(cat).returning();
    return delay(newCat as Category);
  },
  
  updateCategory: async (cat: Category) => {
    const [updated] = await db.update(schema.categories)
      .set(cat)
      .where(eq(schema.categories.id, cat.id))
      .returning();
    return delay(updated as Category);
  },
  
  deleteCategory: async (id: string) => {
    await db.delete(schema.categories).where(eq(schema.categories.id, id));
    return delay({ success: true });
  },

  // --- GUIDE ITEMS ---
  getGuideItems: async () => {
    const items = await db.select().from(schema.guideItems);
    return delay(items as GuideItem[]);
  },
  
  addGuideItem: async (item: GuideItem) => {
    const [newItem] = await db.insert(schema.guideItems).values(item).returning();
    return delay(newItem as GuideItem);
  },
  
  updateGuideItem: async (item: GuideItem) => {
    const [updated] = await db.update(schema.guideItems)
      .set(item)
      .where(eq(schema.guideItems.id, item.id))
      .returning();
    return delay(updated as GuideItem);
  },
  
  deleteGuideItem: async (id: string) => {
    await db.delete(schema.guideItems).where(eq(schema.guideItems.id, id));
    return delay({ success: true });
  },

  // --- PREMIUM SERVICES ---
  getPremiumServices: async () => {
    const services = await db.select().from(schema.premiumServices);
    return delay(services as PremiumService[]);
  },
  
  addPremiumService: async (item: PremiumService) => {
    const [newItem] = await db.insert(schema.premiumServices).values(item).returning();
    return delay(newItem as PremiumService);
  },
  
  updatePremiumService: async (item: PremiumService) => {
    const [updated] = await db.update(schema.premiumServices)
      .set(item)
      .where(eq(schema.premiumServices.id, item.id))
      .returning();
    return delay(updated as PremiumService);
  },
  
  deletePremiumService: async (id: string) => {
    await db.delete(schema.premiumServices).where(eq(schema.premiumServices.id, id));
    return delay({ success: true });
  },

  // --- FAQS ---
  getFAQs: async () => {
    const faqs = await db.select().from(schema.faqs);
    return delay(faqs as FAQItem[]);
  },
  
  addFAQ: async (item: FAQItem) => {
    const [newItem] = await db.insert(schema.faqs).values(item).returning();
    return delay(newItem as FAQItem);
  },
  
  updateFAQ: async (item: FAQItem) => {
    const [updated] = await db.update(schema.faqs)
      .set(item)
      .where(eq(schema.faqs.id, item.id))
      .returning();
    return delay(updated as FAQItem);
  },
  
  deleteFAQ: async (id: string) => {
    await db.delete(schema.faqs).where(eq(schema.faqs.id, id));
    return delay({ success: true });
  },

  // --- INVENTORY ---
  getInventory: async () => {
    const inventory = await db.select().from(schema.inventory);
    return delay(inventory as InventoryItem[]);
  },
  
  addInventory: async (item: InventoryItem) => {
    const [newItem] = await db.insert(schema.inventory).values(item).returning();
    return delay(newItem as InventoryItem);
  },
  
  updateInventory: async (item: InventoryItem) => {
    const [updated] = await db.update(schema.inventory)
      .set(item)
      .where(eq(schema.inventory.id, item.id))
      .returning();
    return delay(updated as InventoryItem);
  },
  
  deleteInventory: async (id: string) => {
    await db.delete(schema.inventory).where(eq(schema.inventory.id, id));
    return delay({ success: true });
  },

  // --- STAFF ---
  getStaff: async () => {
    const staff = await db.select().from(schema.staff);
    return delay(staff as StaffMember[]);
  },
  
  addStaff: async (member: StaffMember) => {
    const [newMember] = await db.insert(schema.staff).values(member).returning();
    return delay(newMember as StaffMember);
  },
  
  updateStaff: async (member: StaffMember) => {
    const [updated] = await db.update(schema.staff)
      .set(member)
      .where(eq(schema.staff.id, member.id))
      .returning();
    return delay(updated as StaffMember);
  },
  
  deleteStaff: async (id: string) => {
    await db.delete(schema.staff).where(eq(schema.staff.id, id));
    return delay({ success: true });
  },

  // --- SERVICE REQUESTS ---
  getServiceRequests: async () => {
    const requests = await db.select().from(schema.serviceRequests);
    return delay(requests as ServiceRequest[]);
  },
  
  addServiceRequest: async (req: ServiceRequest) => {
    const [newReq] = await db.insert(schema.serviceRequests).values(req).returning();
    return delay(newReq as ServiceRequest);
  },
  
  updateServiceRequest: async (req: ServiceRequest) => {
    const [updated] = await db.update(schema.serviceRequests)
      .set(req)
      .where(eq(schema.serviceRequests.id, req.id))
      .returning();
    return delay(updated as ServiceRequest);
  },

  // --- MARKETING CAMPAIGNS ---
  getMarketingCampaigns: async () => {
    const campaigns = await db.select().from(schema.marketingCampaigns);
    return delay(campaigns as MarketingCampaign[]);
  },
  
  addMarketingCampaign: async (camp: MarketingCampaign) => {
    const [newCamp] = await db.insert(schema.marketingCampaigns).values(camp).returning();
    return delay(newCamp as MarketingCampaign);
  },
  
  updateMarketingCampaign: async (camp: MarketingCampaign) => {
    const [updated] = await db.update(schema.marketingCampaigns)
      .set(camp)
      .where(eq(schema.marketingCampaigns.id, camp.id))
      .returning();
    return delay(updated as MarketingCampaign);
  },

  // --- REVIEWS ---
  getReviews: async () => {
    const reviews = await db.select().from(schema.reviews);
    return delay(reviews as Review[]);
  },

  // --- CLIENT INTERACTIONS ---
  getInteractions: async () => {
    const interactions = await db.select().from(schema.clientInteractions);
    return delay(interactions as ClientInteraction[]);
  },

  // --- INDEX PAGE SETTINGS ---
  getIndexSettings: async () => {
    const settings = await db.select().from(schema.indexPageSettings);
    return delay(settings);
  },
  
  updateIndexSettings: async (settings: any) => {
    const [updated] = await db.update(schema.indexPageSettings)
      .set(settings)
      .where(eq(schema.indexPageSettings.id, settings.id))
      .returning();
    return delay(updated);
  },
};
