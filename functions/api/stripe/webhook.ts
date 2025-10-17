import Stripe from 'stripe';

// Type definitions
interface WebhookEvent {
  id: string;
  object: string;
  api_version: string;
  created: number;
  data: {
    object: any;
  };
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id: string;
    idempotency_key: string | null;
  };
  type: string;
}

// Dynamic CORS headers based on request origin
function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
    'Access-Control-Allow-Credentials': 'true'
  };
}

// Handle CORS preflight requests
function handleOptions(request: Request): Response {
  return new Response(null, {
    status: 200,
    headers: getCorsHeaders(request),
  });
}

// Main request handler
export async function onRequestPost({ request, env }: { request: Request; env: any }): Promise<Response> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }

  try {
    console.log('Processing Stripe webhook');

    // Validate environment variables
    if (!env.STRIPE_SECRET_KEY) {
      console.error('Missing STRIPE_SECRET_KEY in environment variables');
      return new Response('Stripe secret key not configured', {
        status: 500,
        headers: getCorsHeaders(request),
      });
    }

    if (!env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing STRIPE_WEBHOOK_SECRET in environment variables');
      return new Response('Stripe webhook secret not configured', {
        status: 500,
        headers: getCorsHeaders(request),
      });
    }

    // Initialize Stripe with secret key from environment
    const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-09-30.clover',
    });

    // Get the raw body and signature
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      console.error('Missing Stripe signature');
      return new Response('Missing Stripe signature', {
        status: 400,
        headers: getCorsHeaders(request),
      });
    }

    // Verify webhook signature
    let event: WebhookEvent;
    try {
      event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET) as WebhookEvent;
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response('Webhook signature verification failed', {
        status: 400,
        headers: getCorsHeaders(request),
      });
    }

    console.log('Webhook event type:', event.type);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);

        // Extract order ID from metadata
        const orderId = session.metadata?.order_id;
        if (orderId) {
          console.log('Updating order status for order ID:', orderId);

          // Update order status to paid in Supabase
          try {
            // Use fetch to call a Supabase API endpoint or use a database client
            // For now, we'll use a simple fetch to update the order
            const response = await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
                'apikey': env.SUPABASE_ANON_KEY!,
              },
              body: JSON.stringify({ status: 'paid' }),
            });

            if (response.ok) {
              console.log('Order', orderId, 'has been marked as paid successfully');
            } else {
              console.error('Failed to update order status:', response.statusText);
            }
          } catch (dbError) {
            console.error('Failed to update order status in database:', dbError);
          }
        } else {
          console.error('No order_id found in session metadata');
        }
        break;

      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object;
        console.log('Payment failed:', paymentIntent.id);

        // Handle failed payment
        const failedOrderId = paymentIntent.metadata?.order_id;
        if (failedOrderId) {
          console.log('Payment failed for order ID:', failedOrderId);

          // Update order status to failed in Supabase
          try {
            const response = await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${failedOrderId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
                'apikey': env.SUPABASE_ANON_KEY!,
              },
              body: JSON.stringify({ status: 'failed' }),
            });

            if (response.ok) {
              console.log('Order', failedOrderId, 'has been marked as failed');
            } else {
              console.error('Failed to update failed order status:', response.statusText);
            }
          } catch (dbError) {
            console.error('Failed to update failed order status in database:', dbError);
          }
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response('Webhook processed successfully', {
      status: 200,
      headers: getCorsHeaders(request),
    });

  } catch (error) {
    console.error('Webhook processing failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(`Webhook processing failed: ${errorMessage}`, {
      status: 500,
      headers: getCorsHeaders(request),
    });
  }
}

// For backward compatibility
export const onRequest = onRequestPost;
