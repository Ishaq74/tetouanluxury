# Database Migration Implementation

## ✅ Implementation Complete

This project has been migrated from mock data to a real PostgreSQL database using **Drizzle ORM** with **Better Auth** for authentication.

---

## 🗄️ Database Stack

- **Local Development**: PostgreSQL (via Docker recommended)
- **Production**: NeonDB (serverless Postgres)
- **ORM**: Drizzle ORM v0.30.10
- **Authentication**: Better Auth
- **Migration Tool**: Drizzle Kit

---

## 📁 Project Structure

```
/database
  ├── schema.ts           # Database schema with all tables & enums
  ├── seed.ts             # Seed data (mock data for development)
  ├── seed-runner.ts      # Script to populate database
  ├── migrate.ts          # Migration runner
  └── migrations/         # Auto-generated SQL migrations

/lib
  └── db.ts               # Database client configuration

/api
  ├── database.ts         # Real API layer using Drizzle
  └── mock.ts             # Legacy mock API (can be deprecated)

/auth
  └── config.ts           # Better Auth configuration

drizzle.config.ts         # Drizzle Kit configuration
.env                      # Environment variables (local)
.env.example              # Environment template
```

---

## 🚀 Setup Instructions

### 1. **Install Dependencies**

Already installed:
```bash
npm install
```

### 2. **Setup PostgreSQL Database**

**Option A: Docker (Recommended for local development)**
```bash
docker run --name tetouanluxury-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=tetouanluxury \
  -p 5432:5432 \
  -d postgres:16-alpine
```

**Option B: Local PostgreSQL**
Install PostgreSQL and create a database:
```sql
CREATE DATABASE tetouanluxury;
```

### 3. **Configure Environment Variables**

Copy `.env.example` to `.env` and update:
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/tetouanluxury
BETTER_AUTH_SECRET=your-secret-key-here-min-32-chars
BETTER_AUTH_URL=http://localhost:5173
```

### 4. **Generate and Run Migrations**

```bash
# Generate migration files from schema
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 5. **Seed the Database**

```bash
npm run db:seed
```

This will populate your database with all the mock data from `seed.ts`.

### 6. **Start Development Server**

```bash
npm run dev
```

---

## 📊 Database Schema Overview

### **Authentication Tables** (Better Auth)
- `user` - User accounts with roles
- `session` - Active user sessions
- `account` - OAuth and password credentials
- `verification` - Email verification tokens

### **Core Business Tables**
- `villas` - Property listings
- `bookings` - Reservation records
- `clients` - Customer database with CRM fields
- `client_interactions` - Communication history

### **Operations**
- `tasks` - Cleaning, maintenance, concierge tasks
- `maintenance_tickets` - Issue tracking
- `staff` - Employee management
- `inventory` - Stock management

### **Finance**
- `expenses` - Operating expenses
- `invoices` - Billing records
- `suppliers` - Vendor database

### **CMS (Content Management)**
- `blog_posts` - Multilingual blog articles
- `guide_items` - Local guide content
- `premium_services` - Service catalog
- `categories` - Taxonomy for content
- `faqs` - FAQ database
- `grocery_items` - Grocery delivery catalog

### **Marketing & Analytics**
- `reviews` - Guest reviews
- `service_requests` - Service bookings
- `marketing_campaigns` - Email/WhatsApp campaigns

---

## 🔐 Authentication Flow

**Better Auth** is configured with:
- Email/Password authentication
- Session management (7-day expiry)
- Role-based access control (GUEST, CLIENT, STAFF_CLEANING, STAFF_MAINTENANCE, MANAGER, ADMIN)

### Usage Example:
```typescript
import { auth } from './auth/config';

// Sign in
const session = await auth.signIn.email({
  email: "user@example.com",
  password: "password"
});

// Get current user
const user = await auth.getSession();
```

---

## 🔄 Switching Between Mock and Real Database

### Current Implementation:
- `api/database.ts` - Real database API (Drizzle ORM)
- `api/mock.ts` - Mock API (localStorage)

### To use real database:
```typescript
// In your components, import from:
import { api } from './api/database';  // ✅ Real database
// instead of:
import { api } from './api/mock';      // ❌ Mock data
```

---

## 🌐 Production Deployment (NeonDB)

### 1. Create NeonDB Project
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### 2. Update Environment Variables
```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require
```

### 3. Run Migrations
```bash
npm run db:migrate
npm run db:seed
```

---

## 🛠️ Database Management

### Drizzle Studio (GUI)
```bash
npm run db:studio
```
Opens a web interface at `https://local.drizzle.studio` to browse and edit data.

### Generate New Migrations
After modifying `database/schema.ts`:
```bash
npm run db:generate
```

### Push Schema Changes (Dev)
For quick iteration without migration files:
```bash
npm run db:push
```

---

## 📝 API Layer Usage

All CRUD operations are now async and return Promises:

```typescript
import { api } from './api/database';

// Get all villas
const villas = await api.getVillas();

// Add a booking
const newBooking = await api.addBooking({
  id: 'BK-2001',
  villaId: 'villa-1',
  clientName: 'John Doe',
  // ... other fields
});

// Update a client
await api.updateClient({
  id: 'CL-001',
  fullName: 'Updated Name',
  // ... other fields
});

// Delete a task
await api.deleteTask('TSK-001');
```

---

## 🧪 Testing Strategy

### Phase 1: Unit Tests (Recommended)
```bash
npm install -D vitest @testing-library/react
```

Create tests for:
- Database queries
- API endpoints
- Authentication flows

### Phase 2: Integration Tests
Test full user workflows with real database transactions.

### Phase 3: E2E Tests
Use Playwright or Cypress for end-to-end testing.

---

## 📦 Zero-Cost Storage Solution

### Current Implementation:
- **Local Development**: Docker PostgreSQL (free)
- **Production**: NeonDB Free Tier
  - 512 MB storage
  - 1 project
  - 100 hours/month compute
  - Perfect for MVP and small-scale deployment

### Scaling Options:
- Upgrade NeonDB plan when needed
- Implement image storage via Cloudflare R2 (free tier: 10GB)
- Use Vercel Blob for file uploads (free tier included)

---

## 🔥 Migration Checklist

- [✅] Install Drizzle ORM & Better Auth
- [✅] Define complete database schema
- [✅] Configure Drizzle Kit
- [✅] Create database connection
- [✅] Setup Better Auth configuration
- [✅] Create migration scripts
- [✅] Create seed data runner
- [✅] Build real API layer with CRUD operations
- [✅] Add environment configuration
- [ ] Update components to use real API
- [ ] Implement authentication UI
- [ ] Add error handling and validation
- [ ] Write tests (unit, integration, e2e)
- [ ] Deploy to production

---

## 🚨 Important Notes

1. **Environment Variables**: Never commit `.env` to git. Always use `.env.example` as template.

2. **Database Migrations**: In production, always test migrations on a staging database first.

3. **Seed Data**: The seed script (`npm run db:seed`) will insert duplicate data if run multiple times. Add upsert logic or clear tables before seeding.

4. **Better Auth Secret**: Generate a secure secret for production:
   ```bash
   openssl rand -base64 32
   ```

5. **CORS**: When deploying the API separately, configure CORS headers properly.

---

## 📚 Documentation References

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Better Auth Docs](https://better-auth.com/docs)
- [NeonDB Docs](https://neon.tech/docs)
- [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)

---

## 🎯 Next Steps

1. **Replace Mock API Calls**: Update all components importing from `api/mock.ts` to use `api/database.ts`
2. **Add Authentication**: Implement login/signup flows using Better Auth
3. **Add Validation**: Use Zod or similar for input validation
4. **Error Handling**: Add try-catch blocks and user-friendly error messages
5. **Testing**: Achieve 100% test coverage as required
6. **Real-time Features**: Add WebSocket support for team chat
7. **File Uploads**: Implement image upload for villas, reviews, etc.

---

## 💡 Pro Tips

- Use Drizzle Studio for quick data inspection during development
- Enable query logging in development: Set `verbose: true` in Drizzle config
- Use database transactions for complex operations (bookings, payments)
- Implement soft deletes for important records (bookings, clients)
- Add database indices for frequently queried columns

---

**Status**: ✅ Core implementation complete. Ready for integration with UI components.
