import type { APIRoute } from 'astro';

// Mock data - in production this would connect to the database
let blogPosts = [
  {
    id: crypto.randomUUID(),
    title: "Discovering the Hidden Gems of Tétouan's Medina",
    slug: "hidden-gems-tetouan-medina",
    category: "Local Life",
    excerpt: "Explore the lesser-known treasures of Tétouan's historic medina",
    content: "Full article content here...",
    author: "Maria Garcia",
    publishedAt: "2024-01-15",
    status: "published",
    locale: "en"
  }
];

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const status = url.searchParams.get('status');
  const locale = url.searchParams.get('locale');

  let filtered = [...blogPosts];

  if (category) {
    filtered = filtered.filter(post => post.category === category);
  }
  if (status) {
    filtered = filtered.filter(post => post.status === status);
  }
  if (locale) {
    filtered = filtered.filter(post => post.locale === locale);
  }

  return new Response(JSON.stringify({ posts: filtered }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Validation
    if (!data.title || typeof data.title !== 'string') {
      return new Response(JSON.stringify({ error: 'Title is required and must be a string' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!data.slug || typeof data.slug !== 'string') {
      return new Response(JSON.stringify({ error: 'Slug is required and must be a string' }), {
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

    const newPost = {
      id: crypto.randomUUID(),
      ...data,
      publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
      status: data.status || 'draft'
    };

    blogPosts.push(newPost);

    return new Response(JSON.stringify({ post: newPost }), {
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
      return new Response(JSON.stringify({ error: 'Post ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const index = blogPosts.findIndex(p => p.id === data.id);
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    blogPosts[index] = { ...blogPosts[index], ...data };

    return new Response(JSON.stringify({ post: blogPosts[index] }), {
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
    return new Response(JSON.stringify({ error: 'Post ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const index = blogPosts.findIndex(p => p.id === id);
  if (index === -1) {
    return new Response(JSON.stringify({ error: 'Post not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  blogPosts.splice(index, 1);

  return new Response(JSON.stringify({ message: 'Post deleted successfully' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
