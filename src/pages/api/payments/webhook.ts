import type { APIRoute } from 'astro';
import { verifyWebhookSignature } from '@lib/stripe';
import { db } from '@db/index';
import { bookings } from '@db/schema';
import { eq } from 'drizzle-orm';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature', { status: 400 });
    }

    const event = await verifyWebhookSignature(body, signature);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata?.bookingId;

        if (bookingId) {
          // Update booking status to confirmed
          await db
            .update(bookings)
            .set({
              status: 'confirmed',
              paymentStatus: 'paid',
              updatedAt: new Date(),
            })
            .where(eq(bookings.id, bookingId));

          console.log(`Booking ${bookingId} confirmed after payment`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata?.bookingId;

        if (bookingId) {
          // Update booking status to payment failed
          await db
            .update(bookings)
            .set({
              paymentStatus: 'failed',
              updatedAt: new Date(),
            })
            .where(eq(bookings.id, bookingId));

          console.log(`Payment failed for booking ${bookingId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }
};
