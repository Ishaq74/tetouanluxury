import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

export interface CreatePaymentIntentParams {
  amount: number;
  currency?: string;
  customerId?: string;
  metadata?: Record<string, string>;
  description?: string;
}

export async function createPaymentIntent(params: CreatePaymentIntentParams) {
  const {
    amount,
    currency = 'eur',
    customerId,
    metadata,
    description,
  } = params;

  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    customer: customerId,
    metadata,
    description,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

export async function createCustomer(email: string, name?: string) {
  return await stripe.customers.create({
    email,
    name,
  });
}

export async function getCustomer(customerId: string) {
  return await stripe.customers.retrieve(customerId);
}

export async function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('Stripe webhook secret not configured');
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

export { Stripe };
