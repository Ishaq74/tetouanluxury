import { db, client } from '../lib/db';
import * as schema from './schema';
import {
  VILLAS,
  MOCK_BOOKINGS,
  MOCK_CLIENTS,
  MOCK_CLIENT_INTERACTIONS,
  MOCK_TASKS,
  MOCK_TICKETS,
  BLOG_POSTS,
  INVENTORY_ITEMS,
  TETOUAN_GUIDE,
  PREMIUM_SERVICES,
  MOCK_EXPENSES,
  MOCK_SUPPLIERS,
  MOCK_REVIEWS,
  MOCK_STAFF,
  MOCK_INVOICES,
  GROCERY_CATALOG,
  MOCK_SERVICE_REQUESTS,
  MOCK_MARKETING_CAMPAIGNS,
  MOCK_CATEGORIES,
} from './seed';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Seed Categories first (referenced by other tables)
    console.log('📦 Seeding categories...');
    await db.insert(schema.categories).values(MOCK_CATEGORIES);

    // Seed Villas
    console.log('🏠 Seeding villas...');
    await db.insert(schema.villas).values(VILLAS);

    // Seed Clients
    console.log('👥 Seeding clients...');
    await db.insert(schema.clients).values(MOCK_CLIENTS);

    // Seed Bookings
    console.log('📅 Seeding bookings...');
    await db.insert(schema.bookings).values(MOCK_BOOKINGS);

    // Seed Client Interactions
    console.log('💬 Seeding client interactions...');
    await db.insert(schema.clientInteractions).values(MOCK_CLIENT_INTERACTIONS);

    // Seed Tasks
    console.log('✅ Seeding tasks...');
    await db.insert(schema.tasks).values(MOCK_TASKS);

    // Seed Maintenance Tickets
    console.log('🔧 Seeding maintenance tickets...');
    await db.insert(schema.maintenanceTickets).values(MOCK_TICKETS);

    // Seed Staff
    console.log('👷 Seeding staff...');
    await db.insert(schema.staff).values(MOCK_STAFF);

    // Seed Inventory
    console.log('📦 Seeding inventory...');
    await db.insert(schema.inventory).values(INVENTORY_ITEMS);

    // Seed Suppliers
    console.log('🏪 Seeding suppliers...');
    await db.insert(schema.suppliers).values(MOCK_SUPPLIERS);

    // Seed Expenses
    console.log('💰 Seeding expenses...');
    await db.insert(schema.expenses).values(MOCK_EXPENSES);

    // Seed Reviews
    console.log('⭐ Seeding reviews...');
    await db.insert(schema.reviews).values(MOCK_REVIEWS);

    // Seed Invoices
    console.log('🧾 Seeding invoices...');
    await db.insert(schema.invoices).values(MOCK_INVOICES);

    // Seed Service Requests
    console.log('🎯 Seeding service requests...');
    await db.insert(schema.serviceRequests).values(MOCK_SERVICE_REQUESTS);

    // Seed Marketing Campaigns
    console.log('📧 Seeding marketing campaigns...');
    await db.insert(schema.marketingCampaigns).values(MOCK_MARKETING_CAMPAIGNS);

    // Seed Blog Posts
    console.log('📝 Seeding blog posts...');
    await db.insert(schema.blogPosts).values(BLOG_POSTS);

    // Seed Guide Items
    console.log('🗺️ Seeding guide items...');
    await db.insert(schema.guideItems).values(TETOUAN_GUIDE);

    // Seed Premium Services
    console.log('💎 Seeding premium services...');
    await db.insert(schema.premiumServices).values(PREMIUM_SERVICES);

    // Seed Grocery Items
    console.log('🛒 Seeding grocery items...');
    await db.insert(schema.groceryItems).values(GROCERY_CATALOG);

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

seedDatabase();
