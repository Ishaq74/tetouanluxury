
// FRONTEND DATA LAYER
// Note: Seed data is now in src/db/seed.ts and managed by Drizzle ORM
// The following constants are kept for backward compatibility with existing React components
// import * as Seed from '@db/seed';

// --- UI CONSTANTS ---
export const COLORS = {
  primary: '#0f172a', 
  secondary: '#fef3c7', 
  accent: '#d97706',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  text: '#333333',
  background: '#ffffff'
};


// Note: Mock data exports commented out - use database queries instead
// In Astro, fetch data using API routes or direct database queries
// Example: const villas = await db.select().from(villas);

// Temporary exports for components that still reference these
export const VILLAS: any[] = [];
export const PREMIUM_SERVICES: any[] = [];
export const MOCK_NOTIFICATIONS: any[] = [];

/*
export const VILLAS = Seed.VILLAS;
export const MOCK_TASKS = Seed.MOCK_TASKS;
export const MOCK_TICKETS = Seed.MOCK_TICKETS;
export const BLOG_POSTS = Seed.BLOG_POSTS;
export const INVENTORY_ITEMS = Seed.INVENTORY_ITEMS;
export const TETOUAN_GUIDE = Seed.TETOUAN_GUIDE;
export const ITINERARIES = Seed.ITINERARIES;
export const PREMIUM_SERVICES = Seed.PREMIUM_SERVICES;
export const MOCK_EXPENSES = Seed.MOCK_EXPENSES;
export const MOCK_SUPPLIERS = Seed.MOCK_SUPPLIERS;
export const MOCK_REVIEWS = Seed.MOCK_REVIEWS;
export const MOCK_CHAT = Seed.MOCK_CHAT;
export const FAQ_ITEMS = Seed.FAQ_ITEMS;
export const MOCK_NOTIFICATIONS = Seed.MOCK_NOTIFICATIONS;
export const MOCK_VILLA_STATUS = Seed.MOCK_VILLA_STATUS;
export const MOCK_STAFF = Seed.MOCK_STAFF;
export const MOCK_INVOICES = Seed.MOCK_INVOICES;
export const GROCERY_CATALOG = Seed.GROCERY_CATALOG;
export const MOCK_SERVICE_REQUESTS = Seed.MOCK_SERVICE_REQUESTS;
export const MOCK_MARKETING_CAMPAIGNS = Seed.MOCK_MARKETING_CAMPAIGNS;

export const MOCK_CATEGORIES = Seed.MOCK_CATEGORIES;
*/

// Mock Page Settings
export const MOCK_INDEX_SETTINGS = [
    {
        id: 'BLOG',
        heroTitle: { EN: 'Journal', FR: 'Le Journal', ES: 'Diario', AR: 'المدونة' },
        heroSubtitle: { EN: 'News & Stories', FR: 'Actualités & Histoires', ES: 'Noticias e Historias', AR: 'أخبار وقصص' },
        seo: { 
            title: { EN: 'Blog', FR: 'Blog', ES: 'Blog', AR: 'مدونة' },
            description: { EN: 'Latest news.', FR: 'Dernières nouvelles.', ES: 'Últimas noticias.', AR: 'أحدث الأخبار.' },
            keywords: ['blog', 'news']
        }
    },
    {
        id: 'GUIDE',
        heroTitle: { EN: 'Discover Tétouan', FR: 'Découvrir Tétouan', ES: 'Descubrir Tetuán', AR: 'اكتشف تطوان' },
        heroSubtitle: { EN: 'Local Guide', FR: 'Guide Local', ES: 'Guía Local', AR: 'دليل محلي' },
        seo: { 
            title: { EN: 'Guide', FR: 'Guide', ES: 'Guía', AR: 'دليل' },
            description: { EN: 'Local guide.', FR: 'Guide local.', ES: 'Guía local.', AR: 'دليل محلي.' },
            keywords: ['guide', 'travel']
        }
    }
];