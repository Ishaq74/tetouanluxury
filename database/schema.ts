
// CONTRACT FOR BACKEND TEAM
// This file uses Drizzle ORM to define the PostgreSQL database structure.
// Includes Better Auth schema requirements.

import { pgTable, text, serial, integer, boolean, timestamp, numeric, pgEnum, jsonb, date, uuid } from 'drizzle-orm/pg-core';

// --- ENUMS ---
export const userRoleEnum = pgEnum('user_role', ['GUEST', 'CLIENT', 'STAFF_CLEANING', 'STAFF_MAINTENANCE', 'MANAGER', 'ADMIN']);
export const bookingStatusEnum = pgEnum('booking_status', ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED']);
export const pipelineStageEnum = pgEnum('pipeline_stage', ['NEW_LEAD', 'DISCUSSION', 'PROPOSAL', 'CONFIRMED', 'POST_STAY']);
export const taskTypeEnum = pgEnum('task_type', ['CLEANING', 'MAINTENANCE', 'CONCIERGE']);
export const taskStatusEnum = pgEnum('task_status', ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED']);
export const ticketPriorityEnum = pgEnum('ticket_priority', ['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
export const ticketStatusEnum = pgEnum('ticket_status', ['OPEN', 'IN_PROGRESS', 'RESOLVED']);
export const interactionTypeEnum = pgEnum('interaction_type', ['WHATSAPP', 'EMAIL', 'PHONE', 'SYSTEM']);
export const interactionDirectionEnum = pgEnum('interaction_direction', ['INBOUND', 'OUTBOUND']);
export const inventoryStatusEnum = pgEnum('inventory_status', ['OK', 'LOW', 'CRITICAL']);
export const expenseStatusEnum = pgEnum('expense_status', ['PAID', 'PENDING']);
export const reviewStatusEnum = pgEnum('review_status', ['PENDING', 'PUBLISHED', 'ARCHIVED']);
export const notificationTypeEnum = pgEnum('notification_type', ['INFO', 'ALERT', 'SUCCESS']);
export const serviceRequestStatusEnum = pgEnum('service_request_status', ['PENDING', 'APPROVED', 'COMPLETED']);
export const campaignTypeEnum = pgEnum('campaign_type', ['EMAIL', 'WHATSAPP']);
export const campaignStatusEnum = pgEnum('campaign_status', ['DRAFT', 'SCHEDULED', 'SENT']);
export const invoiceStatusEnum = pgEnum('invoice_status', ['PAID', 'UNPAID', 'OVERDUE']);

// --- BETTER AUTH SCHEMA ---

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
    role: userRoleEnum('role').default('GUEST'),
    phone: text('phone'),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => user.id),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	expiresAt: timestamp("expires_at"),
	password: text("password"),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
});

// --- APP BUSINESS TABLES ---

export const villas = pgTable('villas', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: jsonb('description').notNull(), // Stores LocalizedString
  shortDescription: jsonb('short_description'), // Stores LocalizedString
  pricePerNight: numeric('price_per_night').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  pool: boolean('pool').default(true),
  isAvailable: boolean('is_available').default(true),
  maintenanceMode: boolean('maintenance_mode').default(false),
  images: text('images').array(),
  features: jsonb('features').array(), // Stores array of LocalizedString
  createdAt: timestamp('created_at').defaultNow(),
});

export const clients = pgTable('clients', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  passportNumber: text('passport_number'),
  passportVerified: boolean('passport_verified').default(false),
  totalSpends: numeric('total_spends').default('0'),
  staysCount: integer('stays_count').default(0),
  status: text('status'), // VIP, NEW, RETURNING
  notes: text('notes'),
  pipelineStage: pipelineStageEnum('pipeline_stage').default('NEW_LEAD'),
  tags: text('tags').array(),
  userId: text('user_id').references(() => user.id), // Link to auth user if they have an account
  createdAt: timestamp('created_at').defaultNow(),
});

export const staff = pgTable('staff', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  role: userRoleEnum('role').notNull(),
  status: text('status').default('ACTIVE'), // ACTIVE, OFF_DUTY, ON_LEAVE
  schedule: jsonb('schedule'), // Array of day/shift objects
  lastLogin: timestamp('last_login'),
});

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(),
  villaId: text('villa_id').references(() => villas.id),
  clientId: text('client_id').references(() => clients.id),
  clientName: text('client_name').notNull(), // Denormalized for display/history
  clientEmail: text('client_email'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  totalPrice: numeric('total_price').notNull(),
  status: bookingStatusEnum('status').default('PENDING'),
  guests: integer('guests').default(1),
  specialRequests: text('special_requests'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const maintenanceTickets = pgTable('maintenance_tickets', {
  id: text('id').primaryKey(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  villaId: text('villa_id').references(() => villas.id),
  reportedBy: text('reported_by'),
  priority: ticketPriorityEnum('priority').default('MEDIUM'),
  status: ticketStatusEnum('status').default('OPEN'),
  createdAt: timestamp('created_at').defaultNow(), 
  costEstimate: numeric('cost_estimate'),
  assignedTo: text('assigned_to'), 
});

export const tasks = pgTable('tasks', {
  id: text('id').primaryKey(),
  type: taskTypeEnum('type').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  villaId: text('villa_id').references(() => villas.id),
  assignedTo: text('assigned_to'), // Could link to staff table
  dueDate: date('due_date'),
  status: taskStatusEnum('status').default('TODO'),
});

export const inventory = pgTable('inventory', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  quantity: integer('quantity').notNull(),
  minLevel: integer('min_level').default(5),
  unit: text('unit').notNull(),
  status: inventoryStatusEnum('status').default('OK'),
});

export const suppliers = pgTable('suppliers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  service: text('service'),
  contact: text('contact'),
  email: text('email'),
});

export const expenses = pgTable('expenses', {
  id: text('id').primaryKey(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  amount: numeric('amount').notNull(),
  date: date('date').notNull(),
  status: expenseStatusEnum('status').default('PENDING'),
  supplierId: text('supplier_id').references(() => suppliers.id),
});

export const clientInteractions = pgTable('client_interactions', {
  id: text('id').primaryKey(),
  clientId: text('client_id').references(() => clients.id),
  type: interactionTypeEnum('type').notNull(),
  direction: interactionDirectionEnum('direction').notNull(),
  content: text('content').notNull(),
  date: timestamp('date').defaultNow(),
  agent: text('agent'),
});

export const blogPosts = pgTable('blog_posts', {
  id: text('id').primaryKey(),
  title: jsonb('title').notNull(),
  slug: text('slug').notNull().unique(),
  category: text('category').notNull(),
  tags: text('tags').array(),
  excerpt: jsonb('excerpt'),
  content: jsonb('content'),
  image: text('image'),
  date: date('date'),
  author: text('author'),
  status: text('status').default('DRAFT'),
});

export const categories = pgTable('categories', {
    id: text('id').primaryKey(),
    type: text('type').notNull(), // BLOG, GUIDE, SERVICE
    name: jsonb('name').notNull(),
    slug: text('slug').notNull(),
    description: jsonb('description'),
    image: text('image'),
    count: integer('count').default(0),
    seo: jsonb('seo'),
});

export const indexPageSettings = pgTable('index_page_settings', {
    id: text('id').primaryKey(), // BLOG, GUIDE, etc.
    heroTitle: jsonb('hero_title'),
    heroSubtitle: jsonb('hero_subtitle'),
    seo: jsonb('seo'),
});

export const guideItems = pgTable('guide_items', {
  id: text('id').primaryKey(),
  title: jsonb('title').notNull(),
  category: text('category'),
  desc: jsonb('desc'),
  fullContent: jsonb('full_content'),
  image: text('image'),
  location: text('location'),
  seo: jsonb('seo'),
});

export const premiumServices = pgTable('premium_services', {
  id: text('id').primaryKey(),
  title: jsonb('title').notNull(),
  category: text('category'),
  price: text('price'), 
  desc: jsonb('desc'),
  longDesc: jsonb('long_desc'),
  seo: jsonb('seo'),
});

export const groceryItems = pgTable('grocery_items', {
  id: text('id').primaryKey(),
  name: jsonb('name').notNull(),
  category: text('category'),
  price: numeric('price').notNull(),
  unit: text('unit'),
  image: text('image'),
});

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  villaId: text('villa_id').references(() => villas.id),
  guestName: text('guest_name').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  date: date('date'),
  category: text('category'),
  videoUrl: text('video_url'),
  status: reviewStatusEnum('status').default('PENDING'),
});

export const faqs = pgTable('faqs', {
  id: text('id').primaryKey(),
  q: jsonb('question').notNull(),
  a: jsonb('answer').notNull(),
});

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  time: text('time'),
  read: boolean('read').default(false),
  type: notificationTypeEnum('type').default('INFO'),
  role: text('role'),
});

export const serviceRequests = pgTable('service_requests', {
  id: text('id').primaryKey(),
  clientId: text('client_id').references(() => clients.id),
  clientName: text('client_name'),
  villaId: text('villa_id').references(() => villas.id),
  serviceType: text('service_type'),
  dateRequested: date('date_requested'),
  status: serviceRequestStatusEnum('status').default('PENDING'),
  notes: text('notes'),
  price: numeric('price'),
});

export const marketingCampaigns = pgTable('marketing_campaigns', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: campaignTypeEnum('type'),
  status: campaignStatusEnum('status').default('DRAFT'),
  sentCount: integer('sent_count').default(0),
  openRate: numeric('open_rate').default('0'),
  date: date('date'),
});

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  bookingId: text('booking_id').references(() => bookings.id),
  clientName: text('client_name'),
  amount: numeric('amount').notNull(),
  date: date('date'),
  status: invoiceStatusEnum('status').default('UNPAID'),
  url: text('url'),
});
