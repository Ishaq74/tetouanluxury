
import { pgTable, uuid, varchar, text, timestamp, integer, boolean, decimal, pgEnum } from 'drizzle-orm/pg-core';

// Media Library Table
export const mediaLibrary = pgTable('media_library', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // image, video, document
  url: varchar('url', { length: 500 }).notNull(),
  size: integer('size'), // in bytes
  uploadedAt: timestamp('uploaded_at').defaultNow(),
  uploadedBy: varchar('uploaded_by', { length: 255 }),
});

// Enums
export const userRoleEnum = pgEnum('user_role', ['GUEST', 'CLIENT', 'STAFF_CLEANING', 'STAFF_MAINTENANCE', 'MANAGER', 'ADMIN']);
export const bookingStatusEnum = pgEnum('booking_status', ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED']);
export const pipelineStageEnum = pgEnum('pipeline_stage', ['NEW_LEAD', 'DISCUSSION', 'PROPOSAL', 'CONFIRMED', 'POST_STAY']);
export const taskTypeEnum = pgEnum('task_type', ['CLEANING', 'MAINTENANCE', 'CONCIERGE']);
export const taskStatusEnum = pgEnum('task_status', ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED', 'PENDING_REVIEW', 'REJECTED']);
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

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('CLIENT'),
  phone: varchar('phone', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Villas Table
export const villas = pgTable('villas', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  descriptionEn: text('description_en'),
  descriptionFr: text('description_fr'),
  descriptionEs: text('description_es'),
  descriptionAr: text('description_ar'),
  shortDescEn: text('short_desc_en'),
  shortDescFr: text('short_desc_fr'),
  shortDescEs: text('short_desc_es'),
  shortDescAr: text('short_desc_ar'),
  pricePerNight: decimal('price_per_night', { precision: 10, scale: 2 }).notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  pool: boolean('pool').default(true),
  images: text('images').array(),
  isAvailable: boolean('is_available').default(true),
  maintenanceMode: boolean('maintenance_mode').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Clients Table
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  passportNumber: varchar('passport_number', { length: 100 }),
  passportVerified: boolean('passport_verified').default(false),
  totalSpends: decimal('total_spends', { precision: 10, scale: 2 }).default('0'),
  staysCount: integer('stays_count').default(0),
  status: varchar('status', { length: 50 }).default('NEW'),
  notes: text('notes'),
  pipelineStage: varchar('pipeline_stage', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastStay: timestamp('last_stay'),
});

// Bookings Table
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  villaId: uuid('villa_id').references(() => villas.id).notNull(),
  clientId: uuid('client_id').references(() => clients.id),
  clientName: varchar('client_name', { length: 255 }).notNull(),
  clientEmail: varchar('client_email', { length: 255 }).notNull(),
  villaName: varchar('villa_name', { length: 255 }),
  checkIn: timestamp('check_in'),
  checkOut: timestamp('check_out'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: bookingStatusEnum('status').notNull().default('PENDING'),
  guests: integer('guests').notNull(),
  specialRequests: text('special_requests'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tasks Table
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: taskTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  villaId: uuid('villa_id').references(() => villas.id),
  assignedTo: uuid('assigned_to').references(() => users.id),
  dueDate: timestamp('due_date').notNull(),
  status: taskStatusEnum('status').notNull().default('TODO'),
  priority: varchar('priority', { length: 20 }),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Maintenance Tickets Table
export const maintenanceTickets = pgTable('maintenance_tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: varchar('category', { length: 50 }).notNull(),
  description: text('description').notNull(),
  villaId: uuid('villa_id').references(() => villas.id).notNull(),
  reportedBy: uuid('reported_by').references(() => users.id),
  priority: varchar('priority', { length: 20 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('OPEN'),
  costEstimate: decimal('cost_estimate', { precision: 10, scale: 2 }),
  assignedTo: uuid('assigned_to').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Blog Posts Table
export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  titleEn: varchar('title_en', { length: 255 }),
  titleFr: varchar('title_fr', { length: 255 }),
  titleEs: varchar('title_es', { length: 255 }),
  titleAr: varchar('title_ar', { length: 255 }),
  contentEn: text('content_en'),
  contentFr: text('content_fr'),
  contentEs: text('content_es'),
  contentAr: text('content_ar'),
  excerptEn: text('excerpt_en'),
  excerptFr: text('excerpt_fr'),
  excerptEs: text('excerpt_es'),
  excerptAr: text('excerpt_ar'),
  category: varchar('category', { length: 100 }),
  tags: text('tags').array(),
  image: varchar('image', { length: 500 }),
  author: varchar('author', { length: 255 }),
  status: varchar('status', { length: 50 }).default('DRAFT'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Staff Table
export const staff = pgTable('staff', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  role: userRoleEnum('role').notNull(),
  status: varchar('status', { length: 50 }).default('ACTIVE'),
  schedule: text('schedule'), // JSON stringified array
  lastLogin: timestamp('last_login'),
});

// Inventory Table
export const inventory = pgTable('inventory', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  quantity: integer('quantity').notNull(),
  minLevel: integer('min_level').default(5),
  unit: varchar('unit', { length: 50 }).notNull(),
  status: inventoryStatusEnum('status').default('OK'),
});

// Suppliers Table
export const suppliers = pgTable('suppliers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  service: varchar('service', { length: 255 }),
  contact: varchar('contact', { length: 255 }),
  email: varchar('email', { length: 255 }),
});

// Expenses Table
export const expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: varchar('category', { length: 100 }).notNull(),
  description: text('description').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('date').notNull(),
  status: expenseStatusEnum('status').default('PENDING'),
  supplierId: uuid('supplier_id').references(() => suppliers.id),
});

// Client Interactions Table
export const clientInteractions = pgTable('client_interactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').references(() => clients.id),
  type: interactionTypeEnum('type').notNull(),
  direction: interactionDirectionEnum('direction').notNull(),
  content: text('content').notNull(),
  date: timestamp('date').defaultNow(),
  agent: varchar('agent', { length: 255 }),
});

// Reviews Table
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  villaId: uuid('villa_id').references(() => villas.id),
  guestName: varchar('guest_name', { length: 255 }).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  date: timestamp('date'),
  category: varchar('category', { length: 100 }),
  videoUrl: varchar('video_url', { length: 500 }),
  status: reviewStatusEnum('status').default('PENDING'),
});

// Notifications Table
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  time: varchar('time', { length: 50 }),
  read: boolean('read').default(false),
  type: notificationTypeEnum('type').default('INFO'),
  role: varchar('role', { length: 50 }),
});

// Service Requests Table
export const serviceRequests = pgTable('service_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').references(() => clients.id),
  clientName: varchar('client_name', { length: 255 }),
  villaId: uuid('villa_id').references(() => villas.id),
  serviceType: varchar('service_type', { length: 100 }),
  dateRequested: timestamp('date_requested'),
  status: serviceRequestStatusEnum('status').default('PENDING'),
  notes: text('notes'),
  price: decimal('price', { precision: 10, scale: 2 }),
});

// Marketing Campaigns Table
export const marketingCampaigns = pgTable('marketing_campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  type: campaignTypeEnum('type'),
  status: campaignStatusEnum('status').default('DRAFT'),
  sentCount: integer('sent_count').default(0),
  openRate: decimal('open_rate', { precision: 5, scale: 2 }).default('0'),
  date: timestamp('date'),
});

// Invoices Table
export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').references(() => bookings.id),
  clientName: varchar('client_name', { length: 255 }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('date'),
  status: invoiceStatusEnum('status').default('UNPAID'),
  url: varchar('url', { length: 500 }),
});

// Account Table (auth externe)
export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: varchar('account_id', { length: 255 }).notNull(),
  providerId: varchar('provider_id', { length: 255 }).notNull(),
  userId: uuid('user_id').references(() => users.id),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  expiresAt: timestamp('expires_at'),
  password: text('password'),
});

// Verification Table (auth externe)
export const verifications = pgTable('verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

// Categories Table
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type', { length: 50 }).notNull(), // BLOG, GUIDE, SERVICE
  name: text('name').notNull(), // JSON stringified
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'), // JSON stringified
  image: varchar('image', { length: 500 }),
  count: integer('count').default(0),
  seo: text('seo'), // JSON stringified
});

// Index Page Settings Table
export const indexPageSettings = pgTable('index_page_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  heroTitle: text('hero_title'), // JSON stringified
  heroSubtitle: text('hero_subtitle'), // JSON stringified
  seo: text('seo'), // JSON stringified
});

// Guide Items Table
export const guideItems = pgTable('guide_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(), // JSON stringified
  category: varchar('category', { length: 100 }),
  desc: text('desc'), // JSON stringified
  fullContent: text('full_content'), // JSON stringified
  image: varchar('image', { length: 500 }),
  location: varchar('location', { length: 255 }),
  seo: text('seo'), // JSON stringified
});

// Premium Services Table
export const premiumServices = pgTable('premium_services', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(), // JSON stringified
  category: varchar('category', { length: 100 }),
  price: varchar('price', { length: 50 }),
  desc: text('desc'), // JSON stringified
  longDesc: text('long_desc'), // JSON stringified
  seo: text('seo'), // JSON stringified
});

// Grocery Items Table
export const groceryItems = pgTable('grocery_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // JSON stringified
  category: varchar('category', { length: 100 }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 50 }),
  image: varchar('image', { length: 500 }),
});

// FAQs Table
export const faqs = pgTable('faqs', {
  id: uuid('id').primaryKey().defaultRandom(),
  question: text('question').notNull(), // JSON stringified
  answer: text('answer').notNull(), // JSON stringified
});

// Sessions Table (for Better Auth)
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  token: varchar('token', { length: 500 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
