import type { APIRoute } from 'astro';
import { createPaymentIntent } from '@lib/stripe';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { amount, currency, customerId, metadata, description } = body;

    // Validation
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400 }
      );
    }

    const paymentIntent = await createPaymentIntent({
      amount,
      currency,
      customerId,
      metadata,
      description,
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500 }
    );
  }
};
