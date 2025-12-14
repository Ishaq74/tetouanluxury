/**
 * Database seed data
 * Run this script to populate the database with initial data
 */

import { db } from '@db/index';
import { villas, users, clients, bookings, blogPosts } from '@db/schema';
import {
  staff,
  inventory,
  suppliers,
  expenses,
  clientInteractions,
  reviews,
  notifications,
  serviceRequests,
  marketingCampaigns,
  invoices,
  categories,
  indexPageSettings,
  guideItems,
  premiumServices,
  groceryItems,
  faqs
} from '@db/schema';

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Seed Users
    console.log('Seeding users...');
    const adminUser = await db.insert(users).values({
      email: 'admin@tetouanluxury.com',
      name: 'Admin User',
      password: 'hashed_password_here', // In production, use proper password hashing
      role: 'ADMIN',
      phone: '+212-123-456-789',
    }).returning();

    // Seed Villas enrichies
    console.log('Seeding villas...');
    const villaData = [
      {
        name: 'Villa Malabata',
        descriptionEn: 'A sanctuary of luxury offering modern elegance with traditional Moroccan touches. Private pool, panoramic views of the Mediterranean, and 24/7 security.',
        descriptionFr: 'Un sanctuaire de luxe offrant une élégance moderne avec des touches marocaines traditionnelles. Piscine privée, vues panoramiques sur la Méditerranée et sécurité 24/7.',
        descriptionEs: 'Un santuario de lujo que ofrece elegancia moderna con toques tradicionales marroquíes. Piscina privada, vistas panorámicas del Mediterráneo y seguridad 24/7.',
        descriptionAr: 'ملاذ من الفخامة يجمع بين الأناقة العصرية واللمسات المغربية التقليدية. مسبح خاص، إطلالات بانورامية على البحر الأبيض المتوسط، وأمن على مدار 24 ساعة.',
        shortDescEn: 'Modern luxury with sea views.',
        shortDescFr: 'Luxe moderne avec vue mer.',
        shortDescEs: 'Lujo moderno con vistas al mar.',
        shortDescAr: 'فخامة عصرية مع إطلالة على البحر.',
        pricePerNight: '370.00',
        bedrooms: 4,
        bathrooms: 3,
        pool: true,
        images: [
          'https://picsum.photos/800/600?random=10',
          'https://picsum.photos/800/600?random=20',
          'https://picsum.photos/800/600?random=30'
        ],
        isAvailable: true,
        maintenanceMode: false,
      },
      {
        name: 'Villa Cabo',
        descriptionEn: 'A peaceful retreat with elegant design and private pool.',
        descriptionFr: 'Une retraite paisible au design élégant et piscine privée.',
        descriptionEs: 'Un refugio tranquilo con diseño elegante y piscina privada.',
        descriptionAr: 'ملاذ هادئ بتصميم أنيق ومسبح خاص.',
        shortDescEn: 'Peaceful retreat with private pool',
        shortDescFr: 'Retraite paisible avec piscine privée',
        shortDescEs: 'Refugio tranquilo con piscina privada',
        shortDescAr: 'ملاذ هادئ مع مسبح خاص',
        pricePerNight: '390.00',
        bedrooms: 4,
        bathrooms: 3,
        pool: true,
        images: [
          'https://picsum.photos/800/600?random=11',
          'https://picsum.photos/800/600?random=21',
          'https://picsum.photos/800/600?random=31'
        ],
        isAvailable: true,
        maintenanceMode: false,
      },
      // ... Ajoute d'autres villas inspirées de database/seed.ts si besoin ...
    ];
    const createdVillas = await db.insert(villas).values(villaData).returning();

    // Seed Clients enrichis
    console.log('Seeding clients...');
    const clientData = [
      {
        fullName: 'Karim Benjelloun',
        email: 'karim.b@example.com',
        phone: '+212 600 000 000',
        passportNumber: 'A1234567',
        passportVerified: true,
        totalSpends: '12500.00',
        staysCount: 3,
        status: 'VIP',
        notes: 'Prefers extra towels. Allergies to nuts. Always books Villa Malabata.',
        pipelineStage: 'CONFIRMED',
        lastStay: new Date('2024-12-27'),
      },
      {
        fullName: 'Sophie Marceau',
        email: 'sophie.m@example.com',
        phone: '+33 600 000 000',
        passportNumber: null,
        passportVerified: false,
        totalSpends: '1500.00',
        staysCount: 1,
        status: 'NEW',
        notes: 'Interested in Chefchaouen tour. Asked about vegetarian options for chef.',
        pipelineStage: 'DISCUSSION',
        lastStay: new Date('2024-11-05'),
      },
      // ... Ajoute d'autres clients inspirés de database/seed.ts si besoin ...
    ];
    const createdClients = await db.insert(clients).values(clientData).returning();

    // Seed Bookings enrichis
    console.log('Seeding bookings...');
    if (createdVillas.length > 0 && createdClients.length > 0) {
      await db.insert(bookings).values([
        {
          villaId: createdVillas[0].id,
          clientId: createdClients[0].id,
          clientName: 'Karim Benjelloun',
          clientEmail: 'karim.b@example.com',
          villaName: createdVillas[0].name,
          checkIn: new Date('2024-12-20'),
          checkOut: new Date('2024-12-27'),
          startDate: new Date('2024-12-20'),
          endDate: new Date('2024-12-27'),
          totalPrice: '3150.00',
          status: 'CONFIRMED',
          guests: 4,
          specialRequests: 'Early check-in requested, vegetarian meals preferred',
        },
        {
          villaId: createdVillas[1]?.id,
          clientId: createdClients[1]?.id,
          clientName: 'Sophie Marceau',
          clientEmail: 'sophie.m@example.com',
          villaName: createdVillas[1]?.name,
          checkIn: new Date('2024-11-01'),
          checkOut: new Date('2024-11-05'),
          startDate: new Date('2024-11-01'),
          endDate: new Date('2024-11-05'),
          totalPrice: '1500.00',
          status: 'CONFIRMED',
          guests: 2,
          specialRequests: 'Airport pickup needed',
        },
        // ... Ajoute d'autres bookings inspirés de database/seed.ts si besoin ...
      ]);
    }

    // Seed Sample Blog Post
    console.log('Seeding blog posts...');
    await db.insert(blogPosts).values({
      slug: 'discover-tetouan-hidden-gem',
      titleEn: 'Discover Tétouan: Morocco\'s Hidden Gem',
      titleFr: 'Découvrez Tétouan : Le Joyau Caché du Maroc',
      titleEs: 'Descubre Tetuán: La Joya Escondida de Marruecos',
      titleAr: 'اكتشف تطوان: جوهرة المغرب المخفية',
      contentEn: 'Tétouan is a beautiful city nestled between the Rif Mountains and the Mediterranean Sea...',
      contentFr: 'Tétouan est une belle ville nichée entre les montagnes du Rif et la mer Méditerranée...',
      contentEs: 'Tetuán es una hermosa ciudad ubicada entre las montañas del Rif y el mar Mediterráneo...',
      contentAr: 'تطوان مدينة جميلة تقع بين جبال الريف والبحر الأبيض المتوسط...',
      excerptEn: 'Discover the beauty and culture of Tétouan',
      excerptFr: 'Découvrez la beauté et la culture de Tétouan',
      excerptEs: 'Descubre la belleza y cultura de Tetuán',
      excerptAr: 'اكتشف جمال وثقافة تطوان',
      category: 'local-life',
      tags: ['travel', 'culture', 'morocco'],
      image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800',
      author: 'Admin',
      status: 'PUBLISHED',
      publishedAt: new Date(),
    });

    // Seed Categories
    console.log('Seeding categories...');
    await db.insert(categories).values({
      type: 'BLOG',
      name: JSON.stringify({EN:'Local Life',FR:'Vie Locale',ES:'Vida Local',AR:'الحياة المحلية'}),
      slug: 'local-life',
      description: JSON.stringify({EN:'Stories from the medina.',FR:'Histoires de la médina.',ES:'Historias de la medina.',AR:'قصص من المدينة.'}),
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800',
      count: 12,
      seo: null
    });

    // Seed Index Page Settings
    console.log('Seeding index page settings...');
    await db.insert(indexPageSettings).values({
      heroTitle: JSON.stringify({EN:'Welcome to Tetouan Luxury',FR:'Bienvenue à Tetouan Luxury',ES:'Bienvenido a Tetouan Luxury',AR:'مرحبا بكم في تطوان لكجري'}),
      heroSubtitle: JSON.stringify({EN:'Luxury villas in Morocco',FR:'Villas de luxe au Maroc',ES:'Villas de lujo en Marruecos',AR:'فلل فاخرة في المغرب'}),
      seo: null
    });

    // Seed Guide Items
    console.log('Seeding guide items...');
    await db.insert(guideItems).values({
      title: JSON.stringify({EN:'Medina of Tétouan',FR:'Médina de Tétouan',ES:'Medina de Tetuán',AR:'المدينة القديمة لتطوان'}),
      category: 'Culture',
      desc: JSON.stringify({EN:'A UNESCO World Heritage site.',FR:'Un site du patrimoine mondial de l\'UNESCO.',ES:'Patrimonio de la Humanidad por la UNESCO.',AR:'موقع التراث العالمي لليونسكو.'}),
      fullContent: JSON.stringify({EN:'Full text...',FR:'Texte complet...',ES:'Texto completo...',AR:'النص الكامل...'}),
      image: 'https://picsum.photos/800/600?random=201',
      location: 'City Center',
      seo: null
    });

    // Seed Premium Services
    console.log('Seeding premium services...');
    await db.insert(premiumServices).values({
      title: JSON.stringify({EN:'Private Chef',FR:'Chef Privé',ES:'Chef Privado',AR:'طاه خاص'}),
      category: 'Dining',
      price: '150€/day',
      desc: JSON.stringify({EN:'Traditional Moroccan cuisine in your villa.',FR:'Cuisine marocaine traditionnelle dans votre villa.',ES:'Cocina marroquí tradicional en su villa.',AR:'مأكولات مغربية تقليدية في فيلتك.'}),
      longDesc: JSON.stringify({EN:'Detailed description...',FR:'Description détaillée...',ES:'Descripción detallada...',AR:'وصف مفصل...'}),
      seo: null
    });

    // Seed Grocery Items
    console.log('Seeding grocery items...');
    await db.insert(groceryItems).values({
      name: JSON.stringify({EN:'Mineral Water (6x1.5L)',FR:'Eau Minérale (6x1.5L)',ES:'Agua Mineral (6x1.5L)',AR:'مياه معدنية (6x1.5L)'}),
      category: 'DRINKS',
      price: '4',
      unit: 'pack',
      image: null
    });

    // Seed FAQs
    console.log('Seeding FAQs...');
    await db.insert(faqs).values({
      question: JSON.stringify({EN:'Is breakfast included?',FR:'Le petit-déjeuner est-il inclus ?',ES:'¿El desayuno está incluido?',AR:'هل الإفطار مشمول؟'}),
      answer: JSON.stringify({EN:'We offer a welcome basket upon arrival.',FR:'Nous offrons un panier de bienvenue à l\'arrivée.',ES:'Ofrecemos una cesta de bienvenida a la llegada.',AR:'نقدم سلة ترحيب عند الوصول.'})
    });

    // Seed Staff
    console.log('Seeding staff...');
    await db.insert(staff).values({
      name: 'Fatima Benali',
      role: 'STAFF_CLEANING',
      phone: '+212 600 000 001',
      email: 'fatima@villas.ma',
      status: 'ACTIVE',
      schedule: JSON.stringify([{day:'Mon',shift:'MORNING'}]),
      lastLogin: new Date()
    });

    // Seed Inventory
    console.log('Seeding inventory...');
    await db.insert(inventory).values({
      name: 'Bath Towels (White)',
      category: 'LINEN',
      quantity: 45,
      minLevel: 20,
      unit: 'pcs',
      status: 'OK'
    });

    // Seed Suppliers
    console.log('Seeding suppliers...');
    await db.insert(suppliers).values({
      name: 'Tetouan Clim S.A.R.L',
      service: 'HVAC Maintenance',
      contact: '+212 600 123 456',
      email: 'contact@tetouanclim.ma'
    });

    // Seed Expenses
    console.log('Seeding expenses...');
    await db.insert(expenses).values({
      category: 'UTILITIES',
      description: 'Monthly Electricity Bill (Amendis)',
      amount: '450',
      date: new Date('2023-10-01'),
      status: 'PENDING',
      supplierId: null
    });

    // Seed Client Interactions
    console.log('Seeding client interactions...');
    await db.insert(clientInteractions).values({
      clientId: null,
      type: 'WHATSAPP',
      direction: 'INBOUND',
      content: 'Hello, is the villa available for next Eid?',
      date: new Date('2023-09-10T14:30:00Z'),
      agent: null
    });

    // Seed Reviews
    console.log('Seeding reviews...');
    await db.insert(reviews).values({
      villaId: null,
      guestName: 'Alice D.',
      rating: 5,
      comment: 'Absolutely stunning villa. The staff was incredibly helpful.',
      date: new Date('2023-10-15'),
      category: 'FAMILY',
      videoUrl: null,
      status: 'PUBLISHED'
    });

    // Seed Notifications
    console.log('Seeding notifications...');
    await db.insert(notifications).values({
      title: 'New Booking',
      message: 'Villa Malabata booked for Oct 15-22',
      time: '5m ago',
      read: false,
      type: 'SUCCESS',
      role: 'MANAGER'
    });

    // Seed Service Requests
    console.log('Seeding service requests...');
    await db.insert(serviceRequests).values({
      clientId: null,
      clientName: 'Karim Benjelloun',
      villaId: null,
      serviceType: 'CHEF',
      dateRequested: new Date('2023-10-16'),
      status: 'PENDING',
      notes: 'Dinner for 4, no nuts.',
      price: '150'
    });

    // Seed Marketing Campaigns
    console.log('Seeding marketing campaigns...');
    await db.insert(marketingCampaigns).values({
      name: 'Winter Warmers - Long Stay',
      type: 'EMAIL',
      status: 'SENT',
      sentCount: 150,
      openRate: '42',
      date: new Date('2023-09-01')
    });

    // Seed Invoices
    console.log('Seeding invoices...');
    await db.insert(invoices).values({
      bookingId: null,
      clientName: 'Karim Benjelloun',
      amount: '2450',
      date: new Date('2023-09-15'),
      status: 'PAID',
      url: '#'
    });

    console.log('Database seeding completed successfully!');
    return {
      success: true,
      message: 'Database seeded successfully',
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
