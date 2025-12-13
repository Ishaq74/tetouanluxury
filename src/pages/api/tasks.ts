import type { APIRoute } from 'astro';
import { db } from '../../db';
import { tasks } from '../../db/schema';

export const GET: APIRoute = async () => {
  try {
    const allTasks = await db.select().from(tasks);
    
    return new Response(
      JSON.stringify({
        success: true,
        data: allTasks
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
        error: 'Failed to fetch tasks'
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
    
    const newTask = await db.insert(tasks).values(body).returning();
    
    return new Response(
      JSON.stringify({
        success: true,
        data: newTask[0]
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
        error: 'Failed to create task'
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

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Task ID is required'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Update task - would need eq import from drizzle-orm
    // const updatedTask = await db.update(tasks).set(updates).where(eq(tasks.id, id)).returning();
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Task update endpoint - full implementation pending'
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
        error: 'Failed to update task'
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
