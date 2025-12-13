import { pgTable, uuid, varchar, text, timestamp, integer, boolean, decimal, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['GUEST', 'CLIENT', 'STAFF_CLEANING', 'STAFF_MAINTENANCE', 'MANAGER', 'ADMIN']);
export const bookingStatusEnum = pgEnum('booking_status', ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED']);
export const taskStatusEnum = pgEnum('task_status', ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED', 'PENDING_REVIEW', 'REJECTED']);
export const taskTypeEnum = pgEnum('task_type', ['CLEANING', 'MAINTENANCE', 'CONCIERGE']);

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
});

// Bookings Table
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  villaId: uuid('villa_id').references(() => villas.id).notNull(),
  clientId: uuid('client_id').references(() => clients.id),
  clientName: varchar('client_name', { length: 255 }).notNull(),
  clientEmail: varchar('client_email', { length: 255 }).notNull(),
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

// Sessions Table (for Better Auth)
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  token: varchar('token', { length: 500 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
