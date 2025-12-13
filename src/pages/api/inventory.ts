import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');

    // Mock inventory data
    let items = [
      { id: 1, name: 'Bed Sheets (Queen)', category: 'linen', quantity: 45, minLevel: 20, unit: 'sets', lastRestocked: '2024-12-01' },
      { id: 2, name: 'Towels (Bath)', category: 'linen', quantity: 78, minLevel: 30, unit: 'pcs', lastRestocked: '2024-12-05' },
      { id: 3, name: 'Pillows', category: 'linen', quantity: 32, minLevel: 25, unit: 'pcs', lastRestocked: '2024-11-28' },
      { id: 4, name: 'Plates (Dinner)', category: 'kitchen', quantity: 120, minLevel: 50, unit: 'pcs', lastRestocked: '2024-12-08' },
      { id: 5, name: 'Glasses (Wine)', category: 'kitchen', quantity: 15, minLevel: 30, unit: 'pcs', lastRestocked: '2024-11-20' },
      { id: 6, name: 'Shampoo Bottles', category: 'toiletries', quantity: 55, minLevel: 40, unit: 'bottles', lastRestocked: '2024-12-10' },
      { id: 7, name: 'Soap Bars', category: 'toiletries', quantity: 18, minLevel: 25, unit: 'bars', lastRestocked: '2024-11-25' },
    ];

    if (category && category !== 'all') {
      items = items.filter(item => item.category === category);
    }

    return new Response(JSON.stringify({ success: true, data: items }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch inventory' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    if (!body.name || !body.category || !body.quantity || !body.minLevel) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate data types and ranges
    if (typeof body.quantity !== 'number' || body.quantity < 0) {
      return new Response(JSON.stringify({ success: false, error: 'Quantity must be a non-negative number' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (typeof body.minLevel !== 'number' || body.minLevel < 0) {
      return new Response(JSON.stringify({ success: false, error: 'Min level must be a non-negative number' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate category enum
    const validCategories = ['linen', 'kitchen', 'toiletries'];
    if (!validCategories.includes(body.category)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid category value' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newItem = {
      id: crypto.randomUUID(),
      ...body,
      lastRestocked: new Date().toISOString().split('T')[0],
    };

    return new Response(JSON.stringify({ success: true, data: newItem }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to create inventory item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return new Response(JSON.stringify({ success: false, error: 'Item ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updatedItem = {
      ...body,
      lastRestocked: new Date().toISOString().split('T')[0],
    };

    return new Response(JSON.stringify({ success: true, data: updatedItem }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to update inventory item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
