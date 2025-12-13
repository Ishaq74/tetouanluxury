import type { APIRoute } from 'astro';
// import { db } from '@db/index'; // TODO: Implement database integration

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');

    // Mock maintenance tickets data (would come from database)
    let tickets = [
      {
        id: 1,
        villaId: 1,
        villaName: 'Villa Océane',
        title: 'AC Unit Not Working',
        description: 'Air conditioning in master bedroom not cooling',
        priority: 'high',
        status: 'open',
        assignedTo: 'Ahmed Hassan',
        reportedBy: 'John Smith',
        dueDate: '2024-12-15',
        createdAt: '2024-12-13',
      },
      {
        id: 2,
        villaId: 2,
        villaName: 'Villa Montagne',
        title: 'Pool Filter Maintenance',
        description: 'Regular monthly pool filter cleaning required',
        priority: 'medium',
        status: 'in_progress',
        assignedTo: 'Mohammed Ali',
        reportedBy: 'Staff',
        dueDate: '2024-12-18',
        createdAt: '2024-12-12',
      },
      {
        id: 3,
        villaId: 1,
        villaName: 'Villa Océane',
        title: 'Light Bulb Replacement',
        description: 'Several light bulbs need replacement in living room',
        priority: 'low',
        status: 'scheduled',
        assignedTo: 'Youssef Ben',
        reportedBy: 'Cleaning Staff',
        dueDate: '2024-12-20',
        createdAt: '2024-12-11',
      },
    ];

    // Apply filters
    if (status) {
      tickets = tickets.filter(t => t.status === status);
    }
    if (priority) {
      tickets = tickets.filter(t => t.priority === priority);
    }

    return new Response(JSON.stringify({ success: true, data: tickets }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch maintenance tickets' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.villaId || !body.title || !body.priority) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate data types
    if (typeof body.villaId !== 'number' || body.villaId <= 0) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid villaId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate priority enum
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(body.priority)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid priority value' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create new ticket (would insert into database)
    const newTicket = {
      id: crypto.randomUUID(),
      ...body,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify({ success: true, data: newTicket }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to create maintenance ticket' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return new Response(JSON.stringify({ success: false, error: 'Ticket ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update ticket (would update in database)
    const updatedTicket = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify({ success: true, data: updatedTicket }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to update maintenance ticket' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
