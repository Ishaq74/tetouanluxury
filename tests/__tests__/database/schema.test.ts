import { describe, it, expect } from 'vitest';
import { db } from '../../../lib/db';
import * as schema from '../../../database/schema';

describe('Database Connection', () => {
  it('should connect to database', async () => {
    const result = await db.select().from(schema.villas).limit(1);
    expect(result).toBeDefined();
  });
});

describe('Database Schema', () => {
  it('should have villas table', async () => {
    const villas = await db.select().from(schema.villas);
    expect(Array.isArray(villas)).toBe(true);
  });

  it('should have bookings table', async () => {
    const bookings = await db.select().from(schema.bookings);
    expect(Array.isArray(bookings)).toBe(true);
  });

  it('should have clients table', async () => {
    const clients = await db.select().from(schema.clients);
    expect(Array.isArray(clients)).toBe(true);
  });

  it('should have staff table', async () => {
    const staff = await db.select().from(schema.staff);
    expect(Array.isArray(staff)).toBe(true);
  });

  it('should have tasks table', async () => {
    const tasks = await db.select().from(schema.tasks);
    expect(Array.isArray(tasks)).toBe(true);
  });

  it('should have maintenance_tickets table', async () => {
    const tickets = await db.select().from(schema.maintenanceTickets);
    expect(Array.isArray(tickets)).toBe(true);
  });

  it('should have inventory table', async () => {
    const inventory = await db.select().from(schema.inventory);
    expect(Array.isArray(inventory)).toBe(true);
  });

  it('should have blog_posts table', async () => {
    const posts = await db.select().from(schema.blogPosts);
    expect(Array.isArray(posts)).toBe(true);
  });

  it('should have categories table', async () => {
    const categories = await db.select().from(schema.categories);
    expect(Array.isArray(categories)).toBe(true);
  });
});
