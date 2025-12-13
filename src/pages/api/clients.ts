import type { APIRoute } from 'astro';
import { db } from '../../db';
import { clients } from '../../db/schema';

export const GET: APIRoute = async () => {
  try {
    const allClients = await db.select().from(clients);
    
    return new Response(
      JSON.stringify({
        success: true,
        data: allClients
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
        error: 'Failed to fetch clients'
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
    
    const newClient = await db.insert(clients).values(body).returning();
    
    return new Response(
      JSON.stringify({
        success: true,
        data: newClient[0]
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
        error: 'Failed to create client'
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
