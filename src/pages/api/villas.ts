import type { APIRoute } from 'astro';
import { db } from '../../db';
import { villas } from '../../db/schema';

export const GET: APIRoute = async () => {
  try {
    const allVillas = await db.select().from(villas);
    
    return new Response(
      JSON.stringify({
        success: true,
        data: allVillas
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
        error: 'Failed to fetch villas'
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
    
    // Insert new villa
    const newVilla = await db.insert(villas).values(body).returning();
    
    return new Response(
      JSON.stringify({
        success: true,
        data: newVilla[0]
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
        error: 'Failed to create villa'
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
