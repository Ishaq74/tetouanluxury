# 🏖️ Tétouan Luxury Villas - E-commerce Platform

A modern, multilingual luxury villa rental platform built with **Astro**, **Tailwind CSS**, **Drizzle ORM**, **PostgreSQL**, and **Better Auth**.

## 🌟 Features

- **🚀 Modern Stack**: Built with Astro for optimal performance and SEO
- **🌍 Multilingual**: Full support for English, French, Spanish, and Arabic
- **💎 Luxury Design**: Elegant UI with Tailwind CSS
- **🔐 Secure Authentication**: Better Auth integration (coming soon)
- **📊 Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **📱 Responsive**: Mobile-first design approach
- **⚡ Fast**: Server-side rendering with Astro for lightning-fast page loads

## 📋 Tech Stack

### Frontend & Framework
- **Astro** `^4.16.0` - Modern SSR/SSG framework
- **React** `18.3.1` - For interactive components
- **Tailwind CSS** `^3.4.0` - Utility-first CSS framework
- **TypeScript** `~5.8.0` - Type safety

### Backend & Database
- **Drizzle ORM** `^0.30.0` - TypeScript-first ORM
- **PostgreSQL** - Production database (via `postgres` driver)
- **Better Auth** - Authentication (to be implemented)

### Additional Tools
- **TanStack Query** `5.29.0` - Data fetching and caching
- **Lucide React** `0.460.0` - Icon library
- **Recharts** `2.13.0` - Charts and analytics

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** 14.x or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ishaq74/tetouanluxury.git
   cd tetouanluxury
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your database connection:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/tetouanluxury
   AUTH_SECRET=your-super-secret-auth-key
   ```

4. **Setup the database**
   
   Create your PostgreSQL database:
   ```bash
   createdb tetouanluxury
   ```
   
   Generate and run migrations:
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:4321](http://localhost:4321) in your browser.

## 📁 Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # Astro & React components
│   ├── layouts/         # Page layouts
│   ├── pages/          # Astro pages (file-based routing)
│   ├── lib/            # Utilities and helpers
│   │   ├── types.ts    # TypeScript types
│   │   ├── constants.ts # Constants and configs
│   │   ├── i18n.ts     # Internationalization utilities
│   │   └── translations/ # Translation files
│   ├── db/             # Database configuration
│   │   ├── schema.ts   # Drizzle schema definitions
│   │   ├── index.ts    # Database connection
│   │   └── migrations/ # Database migrations
│   ├── auth/           # Authentication configuration
│   └── styles/         # Global styles
├── astro.config.mjs    # Astro configuration
├── tailwind.config.mjs # Tailwind CSS configuration
├── drizzle.config.ts   # Drizzle ORM configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run db:generate` | Generate database migrations |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |

## 🌍 Internationalization (i18n)

The platform supports 4 languages:
- 🇬🇧 English (`en`) - Default
- 🇫🇷 French (`fr`)
- 🇪🇸 Spanish (`es`)
- 🇸🇦 Arabic (`ar`) - RTL support

### Adding Translations

1. Add translations in `src/lib/translations/{lang}.ts`
2. Import in `src/lib/translations/index.ts`
3. Use in components via the `translations` object

## 🗄️ Database Schema

The database includes tables for:
- **Users** - Authentication and user management
- **Villas** - Property listings with multilingual content
- **Bookings** - Reservation management
- **Clients** - Customer relationship management
- **Tasks** - Operations management
- **Maintenance Tickets** - Property maintenance tracking
- **Blog Posts** - Content management
- **Sessions** - Authentication sessions

See `src/db/schema.ts` for complete schema definitions.

## 🔐 Authentication

Better Auth integration is planned for:
- User registration and login
- Session management
- Role-based access control (Guest, Client, Staff, Manager, Admin)
- Secure password hashing
- Email verification

## 🎨 Design System

### Colors
- **Primary**: `#0f172a` (Slate)
- **Secondary**: `#fef3c7` (Amber light)
- **Accent**: `#d97706` (Amber)
- **Success**: `#10b981` (Emerald)
- **Warning**: `#f59e0b` (Amber)
- **Danger**: `#ef4444` (Red)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

## 📝 Development Roadmap

### Completed ✅
- [x] Astro project setup with TypeScript
- [x] Tailwind CSS integration
- [x] i18n routing configuration (4 languages)
- [x] Database schema with Drizzle ORM
- [x] Basic page layouts and components
- [x] Home, Villas, and Contact pages
- [x] Navigation and Footer components
- [x] Environment configuration

### In Progress 🚧
- [ ] Better Auth implementation
- [ ] Complete database seeding
- [ ] Admin dashboard
- [ ] Client portal
- [ ] Staff operations interface
- [ ] Booking system
- [ ] Payment integration
- [ ] Blog/CMS functionality
- [ ] Services catalog
- [ ] Review system

### Planned 📋
- [ ] Email notifications
- [ ] WhatsApp integration
- [ ] Analytics dashboard
- [ ] Marketing campaigns
- [ ] Inventory management
- [ ] Financial reporting
- [ ] Advanced SEO optimization
- [ ] Performance monitoring

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the repository owner.

## 📄 License

Private - All rights reserved.

## 📧 Contact

For inquiries: contact@tetouanluxury.com

---

Built with ❤️ using Astro and modern web technologies.
