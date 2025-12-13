import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    // Mock service requests
    let requests = [
      {
        id: 1,
        clientId: 1,
        clientName: 'Sarah Johnson',
        service: 'Private Chef Dinner',
        villaId: 1,
        villaName: 'Villa Océane',
        requestedDate: '2024-12-20',
        status: 'pending',
        price: 450,
        guests: 6,
        notes: 'Vegetarian menu preferred',
        createdAt: '2024-12-13',
      },
      {
        id: 2,
        clientId: 2,
        clientName: 'Michael Brown',
        service: 'Airport Transfer',
        villaId: 2,
        villaName: 'Villa Montagne',
        requestedDate: '2024-12-18',
        status: 'approved',
        price: 120,
        guests: 4,
        notes: 'Flight arrives at 14:30',
        createdAt: '2024-12-12',
      },
      {
        id: 3,
        clientId: 3,
        clientName: 'Emma Wilson',
        service: 'Spa Treatment',
        villaId: 1,
        villaName: 'Villa Océane',
        requestedDate: '2024-12-22',
        status: 'completed',
        price: 280,
        guests: 2,
        notes: 'Couples massage',
        createdAt: '2024-12-10',
      },
    ];

    if (status) {
      requests = requests.filter(r => r.status === status);
    }

    return new Response(JSON.stringify({ success: true, data: requests }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch service requests' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    if (!body.clientId || !body.service || !body.villaId || !body.requestedDate) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate data types
    if (typeof body.clientId !== 'number' || body.clientId <= 0) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid clientId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (typeof body.villaId !== 'number' || body.villaId <= 0) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid villaId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(body.requestedDate)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid date format. Use YYYY-MM-DD' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newRequest = {
      id: crypto.randomUUID(),
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    return new Response(JSON.stringify({ success: true, data: newRequest }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to create service request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return new Response(JSON.stringify({ success: false, error: 'Request ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updatedRequest = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify({ success: true, data: updatedRequest }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to update service request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
