import { describe, it, expect, beforeAll } from 'vitest';
import { api } from '../../../api/database';

describe('Database API - Villas', () => {
  it('should fetch all villas', async () => {
    const villas = await api.getVillas();
    expect(Array.isArray(villas)).toBe(true);
    expect(villas.length).toBeGreaterThan(0);
  });

  it('should have valid villa structure', async () => {
    const villas = await api.getVillas();
    const villa = villas[0];
    
    expect(villa).toHaveProperty('id');
    expect(villa).toHaveProperty('name');
    expect(villa).toHaveProperty('description');
    expect(villa).toHaveProperty('pricePerNight');
    expect(villa).toHaveProperty('bedrooms');
    expect(villa).toHaveProperty('bathrooms');
  });
});

describe('Database API - Bookings', () => {
  it('should fetch all bookings', async () => {
    const bookings = await api.getBookings();
    expect(Array.isArray(bookings)).toBe(true);
  });

  it('should have valid booking structure', async () => {
    const bookings = await api.getBookings();
    if (bookings.length > 0) {
      const booking = bookings[0];
      
      expect(booking).toHaveProperty('id');
      expect(booking).toHaveProperty('villaId');
      expect(booking).toHaveProperty('clientName');
      expect(booking).toHaveProperty('startDate');
      expect(booking).toHaveProperty('endDate');
      expect(booking).toHaveProperty('totalPrice');
      expect(booking).toHaveProperty('status');
    }
  });
});

describe('Database API - Clients', () => {
  it('should fetch all clients', async () => {
    const clients = await api.getClients();
    expect(Array.isArray(clients)).toBe(true);
  });

  it('should have valid client structure', async () => {
    const clients = await api.getClients();
    if (clients.length > 0) {
      const client = clients[0];
      
      expect(client).toHaveProperty('id');
      expect(client).toHaveProperty('fullName');
      expect(client).toHaveProperty('email');
      expect(client).toHaveProperty('totalSpends');
      expect(client).toHaveProperty('staysCount');
    }
  });
});
