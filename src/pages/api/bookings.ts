import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { bookings } from '../../../db/schema';

export const GET: APIRoute = async () => {
  try {
    const allBookings = await db.select().from(bookings);
    
    return new Response(
      JSON.stringify({
        success: true,
        data: allBookings
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch bookings'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Insert new booking
    const newBooking = await db.insert(bookings).values(body).returning();
    
    return new Response(
      JSON.stringify({
        success: true,
        data: newBooking[0]
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to create booking'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
