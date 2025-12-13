/**
 * Database seed data
 * Run this script to populate the database with initial data
 */

import { db } from '@db/index';
import { villas, users, clients, bookings, blogPosts } from '@db/schema';

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

    // Seed Villas
    console.log('Seeding villas...');
    const villaData = [
      {
        name: 'Villa Azure',
        descriptionEn: 'Experience luxury in this stunning modern villa with panoramic ocean views.',
        descriptionFr: 'Découvrez le luxe dans cette superbe villa moderne avec vue panoramique sur l\'océan.',
        descriptionEs: 'Experimenta el lujo en esta impresionante villa moderna con vistas panorámicas al océano.',
        descriptionAr: 'استمتع بالفخامة في هذه الفيلا الحديثة المذهلة مع إطلالات بانورامية على المحيط.',
        shortDescEn: 'Stunning modern villa with ocean views',
        shortDescFr: 'Superbe villa moderne avec vue sur l\'océan',
        shortDescEs: 'Impresionante villa moderna con vistas al mar',
        shortDescAr: 'فيلا حديثة مذهلة مع إطلالة على المحيط',
        pricePerNight: '450.00',
        bedrooms: 4,
        bathrooms: 3,
        pool: true,
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800',
          'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=800',
        ],
        isAvailable: true,
        maintenanceMode: false,
      },
      {
        name: 'Villa Serenity',
        descriptionEn: 'A peaceful retreat with elegant design and private pool.',
        descriptionFr: 'Une retraite paisible au design élégant et piscine privée.',
        descriptionEs: 'Un refugio tranquilo con diseño elegante y piscina privada.',
        descriptionAr: 'ملاذ هادئ بتصميم أنيق ومسبح خاص.',
        shortDescEn: 'Peaceful retreat with private pool',
        shortDescFr: 'Retraite paisible avec piscine privée',
        shortDescEs: 'Refugio tranquilo con piscina privada',
        shortDescAr: 'ملاذ هادئ مع مسبح خاص',
        pricePerNight: '450.00',
        bedrooms: 4,
        bathrooms: 3,
        pool: true,
        images: [
          'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=800',
        ],
        isAvailable: true,
        maintenanceMode: false,
      },
      {
        name: 'Villa Paradise',
        descriptionEn: 'Your dream vacation home in Morocco\'s hidden gem.',
        descriptionFr: 'La maison de vacances de vos rêves dans le joyau caché du Maroc.',
        descriptionEs: 'La casa de vacaciones de tus sueños en la joya escondida de Marruecos.',
        descriptionAr: 'منزل عطلتك الحلم في جوهرة المغرب المخفية.',
        shortDescEn: 'Dream vacation home in Tétouan',
        shortDescFr: 'Maison de vacances de rêve à Tétouan',
        shortDescEs: 'Casa de vacaciones soñada en Tetuán',
        shortDescAr: 'منزل عطلة الأحلام في تطوان',
        pricePerNight: '450.00',
        bedrooms: 4,
        bathrooms: 3,
        pool: true,
        images: [
          'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800',
        ],
        isAvailable: true,
        maintenanceMode: false,
      },
    ];

    const createdVillas = await db.insert(villas).values(villaData).returning();

    // Seed Sample Client
    console.log('Seeding clients...');
    const sampleClient = await db.insert(clients).values({
      fullName: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+33-6-12-34-56-78',
      passportNumber: 'AB123456',
      passportVerified: true,
      totalSpends: '3150.00',
      staysCount: 1,
      status: 'RETURNING',
      notes: 'VIP client, prefers villa with ocean view',
      pipelineStage: 'CONFIRMED',
    }).returning();

    // Seed Sample Booking
    console.log('Seeding bookings...');
    if (createdVillas.length > 0 && sampleClient.length > 0) {
      await db.insert(bookings).values({
        villaId: createdVillas[0].id,
        clientId: sampleClient[0].id,
        clientName: 'John Smith',
        clientEmail: 'john.smith@example.com',
        startDate: new Date('2024-12-20'),
        endDate: new Date('2024-12-27'),
        totalPrice: '3150.00',
        status: 'CONFIRMED',
        guests: 4,
        specialRequests: 'Early check-in requested, vegetarian meals preferred',
      });
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
