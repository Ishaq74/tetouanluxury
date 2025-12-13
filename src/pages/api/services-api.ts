import type { APIRoute } from 'astro';

// Mock data - in production this would connect to the database
let services = [
  {
    id: crypto.randomUUID(),
    name: "Private Chef Experience",
    category: "dining",
    description: "Professional chef preparing authentic Moroccan cuisine in your villa",
    price: 150,
    duration: "3 hours",
    availability: "available",
    bookings: 45,
    rating: 4.9
  }
];

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const availability = url.searchParams.get('availability');

  let filtered = [...services];

  if (category) {
    filtered = filtered.filter(service => service.category === category);
  }
  if (availability) {
    filtered = filtered.filter(service => service.availability === availability);
  }

  return new Response(JSON.stringify({ services: filtered }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Validation
    if (!data.name || typeof data.name !== 'string') {
      return new Response(JSON.stringify({ error: 'Name is required and must be a string' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!data.category || typeof data.category !== 'string') {
      return new Response(JSON.stringify({ error: 'Category is required and must be a string' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const validCategories = ['dining', 'transport', 'wellness', 'activities'];
    if (!validCategories.includes(data.category)) {
      return new Response(JSON.stringify({ error: 'Invalid category' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (data.price && (typeof data.price !== 'number' || data.price < 0)) {
      return new Response(JSON.stringify({ error: 'Price must be a positive number' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (data.rating && (typeof data.rating !== 'number' || data.rating < 0 || data.rating > 5)) {
      return new Response(JSON.stringify({ error: 'Rating must be a number between 0 and 5' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const newService = {
      id: crypto.randomUUID(),
      ...data,
      availability: data.availability || 'available',
      bookings: data.bookings || 0,
      rating: data.rating || 0
    };

    services.push(newService);

    return new Response(JSON.stringify({ service: newService }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    if (!data.id || typeof data.id !== 'string') {
      return new Response(JSON.stringify({ error: 'Service ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const index = services.findIndex(s => s.id === data.id);
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Service not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    services[index] = { ...services[index], ...data };

    return new Response(JSON.stringify({ service: services[index] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'Service ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const index = services.findIndex(s => s.id === id);
  if (index === -1) {
    return new Response(JSON.stringify({ error: 'Service not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  services.splice(index, 1);

  return new Response(JSON.stringify({ message: 'Service deleted successfully' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
