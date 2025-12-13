import type { APIRoute } from 'astro';

// Mock data - in production this would connect to the database
let guidePlaces = [
  {
    id: crypto.randomUUID(),
    name: "La Table de Tétouan",
    category: "restaurants",
    description: "Fine dining with traditional Moroccan cuisine",
    rating: 4.8,
    priceRange: "$$$",
    address: "45 Rue de la Kasbah, Tétouan",
    phone: "+212 539 96 12 34",
    status: "active"
  }
];

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const status = url.searchParams.get('status');

  let filtered = [...guidePlaces];

  if (category) {
    filtered = filtered.filter(place => place.category === category);
  }
  if (status) {
    filtered = filtered.filter(place => place.status === status);
  }

  return new Response(JSON.stringify({ places: filtered }), {
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

    const validCategories = ['restaurants', 'activities', 'shopping', 'wellness'];
    if (!validCategories.includes(data.category)) {
      return new Response(JSON.stringify({ error: 'Invalid category' }), {
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

    const newPlace = {
      id: crypto.randomUUID(),
      ...data,
      status: data.status || 'active'
    };

    guidePlaces.push(newPlace);

    return new Response(JSON.stringify({ place: newPlace }), {
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
      return new Response(JSON.stringify({ error: 'Place ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const index = guidePlaces.findIndex(p => p.id === data.id);
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Place not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    guidePlaces[index] = { ...guidePlaces[index], ...data };

    return new Response(JSON.stringify({ place: guidePlaces[index] }), {
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
    return new Response(JSON.stringify({ error: 'Place ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const index = guidePlaces.findIndex(p => p.id === id);
  if (index === -1) {
    return new Response(JSON.stringify({ error: 'Place not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  guidePlaces.splice(index, 1);

  return new Response(JSON.stringify({ message: 'Place deleted successfully' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
