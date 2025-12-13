# Migration Guide: React/Vite → Astro

This document explains how the project has been migrated from React/Vite to Astro.

## 📊 Architecture Changes

### Before (React/Vite)
```
/
├── App.tsx                 # React Router setup
├── index.tsx              # React entry point
├── pages/                 # React components
├── components/            # React components
├── LanguageContext.tsx    # React Context for i18n
├── DataContext.tsx        # React Context for data
└── vite.config.ts         # Vite configuration
```

### After (Astro)
```
/
├── src/
│   ├── pages/            # Astro pages (file-based routing)
│   ├── layouts/          # Astro layouts
│   ├── components/       # Astro & React components
│   ├── lib/              # Utilities & helpers
│   │   └── translations/ # i18n translation files
│   ├── db/               # Drizzle ORM & database
│   └── styles/           # Global styles
├── astro.config.mjs      # Astro configuration
└── tailwind.config.mjs   # Tailwind configuration
```

## 🔄 Key Migrations

### 1. Routing

**Before (React Router):**
```tsx
const router = createRouter({ 
  routeTree,
  history: memoryHistory
});
```

**After (Astro File-based Routing):**
```
src/pages/
├── index.astro           → /
├── villas.astro          → /villas
├── contact.astro         → /contact
└── fr/
    └── index.astro       → /fr
```

### 2. Internationalization (i18n)

**Before (React Context):**
```tsx
const { language, setLanguage, t } = useLanguage();
```

**After (Astro i18n):**
```astro
---
import { translations } from '../lib/translations';
const lang = 'en';
const t = translations[lang];
---
<h1>{t.hero_title}</h1>
```

### 3. Data Management

**Before (React Context + TanStack Query):**
```tsx
const { villas, addVilla } = useData();
```

**After (Drizzle ORM + API Routes):**
```typescript
// API Route: src/pages/api/villas.ts
import { db } from '../../db';
import { villas } from '../../db/schema';

export const GET: APIRoute = async () => {
  const allVillas = await db.select().from(villas);
  return new Response(JSON.stringify(allVillas));
};
```

### 4. Styling

**Before (Inline Tailwind in React):**
```tsx
<div className="bg-primary text-white p-4">
  {content}
</div>
```

**After (Tailwind in Astro):**
```astro
<div class="bg-primary text-white p-4">
  {content}
</div>
```

## 🗄️ Database Schema

The project now uses **Drizzle ORM** with **PostgreSQL** instead of mock data:

```typescript
// Before: Mock data in constants
export const VILLAS = [ /* mock data */ ];

// After: Database schema
export const villas = pgTable('villas', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  pricePerNight: decimal('price_per_night'),
  // ... more fields
});
```

## 📦 Dependencies Changes

### Removed
- `@vitejs/plugin-react` (replaced by `@astrojs/react`)
- `react-router` (replaced by Astro's file-based routing)
- `vite` (replaced by Astro's build tool)

### Added
- `astro` - Main framework
- `@astrojs/tailwind` - Tailwind integration
- `@astrojs/node` - SSR adapter
- `drizzle-orm` - Database ORM
- `postgres` - PostgreSQL client
- `drizzle-kit` - Migration tools

### Kept
- `react` & `react-dom` - For interactive components (islands)
- `tailwindcss` - Styling
- `typescript` - Type safety
- `@tanstack/react-query` - Data fetching (for React islands)

## 🚀 Performance Improvements

1. **Server-Side Rendering (SSR)**: Pages are pre-rendered on the server
2. **Partial Hydration**: Only interactive components ship JavaScript
3. **Image Optimization**: Built-in image optimization
4. **Smaller Bundle Size**: Static pages have minimal JavaScript

## 🔐 Authentication

**Planned Implementation with Better Auth:**

```typescript
// src/auth/config.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
  database: drizzleAdapter(db),
  emailAndPassword: {
    enabled: true
  }
});
```

## 📝 Migration Checklist

### Completed ✅
- [x] Astro project setup
- [x] Tailwind CSS configuration
- [x] i18n routing (4 languages)
- [x] Database schema with Drizzle
- [x] Base layouts and components
- [x] Main public pages
- [x] API routes structure
- [x] Translation system
- [x] Admin dashboard layout

### In Progress 🚧
- [ ] Complete all page migrations
- [ ] Better Auth integration
- [ ] Database seeding
- [ ] API endpoints for all entities
- [ ] Interactive React islands
- [ ] Admin CMS functionality

### Planned 📋
- [ ] Full CRM features
- [ ] ERP modules
- [ ] Payment integration
- [ ] Email notifications
- [ ] WhatsApp integration

## 🎯 Benefits of Migration

1. **Better SEO**: Server-side rendering improves search engine visibility
2. **Faster Load Times**: Minimal JavaScript for static content
3. **Type Safety**: Drizzle ORM provides full TypeScript support
4. **Scalability**: PostgreSQL for production-ready data management
5. **Developer Experience**: File-based routing and Astro's DX
6. **Multilingual**: Built-in i18n support
7. **Modern Stack**: Latest technologies and best practices

## 📚 Resources

- [Astro Documentation](https://docs.astro.build)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Better Auth Documentation](https://better-auth.com)

## 🤝 Contributing

When adding new features:

1. Create Astro pages in `src/pages/`
2. Add translations in `src/lib/translations/`
3. Create database schema in `src/db/schema.ts`
4. Use API routes for data operations
5. Follow existing component patterns

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Create database if needed
createdb tetouanluxury

# Run migrations
npm run db:push
```

### Port Already in Use
```bash
# Astro will automatically find next available port
# Or specify custom port in astro.config.mjs
```

### Type Errors
```bash
# Regenerate Astro types
npm run astro sync
```
