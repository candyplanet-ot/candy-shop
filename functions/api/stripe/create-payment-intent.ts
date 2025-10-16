import Stripe from 'stripe';

// Initialize Stripe with secret key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

// Type definitions
interface CreateCheckoutSessionRequest {
  orderId: string;
  amount: number; // Amount in cents
  currency?: string;
  productName?: string;
}

interface CreateCheckoutSessionResponse {
  success: boolean;
  sessionUrl?: string;
  sessionId?: string;
  error?: string;
}

// Dynamic CORS headers based on request origin
function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
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
    console.log('Processing Stripe Checkout Session creation request');

    // Validate environment variables
    if (!env.STRIPE_SECRET_KEY) {
      console.error('Missing STRIPE_SECRET_KEY in environment variables');
      const errorResponse: CreateCheckoutSessionResponse = {
        success: false,
        error: 'Stripe secret key not configured'
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' },
      });
    }

    // Parse JSON payload
    const body: CreateCheckoutSessionRequest = await request.json();
    const { orderId, amount, currency = 'EUR', productName = 'Order' } = body;

    // Validate required fields
    if (!orderId || typeof amount !== 'number' || amount <= 0) {
      console.error('Invalid request payload:', body);
      const errorResponse: CreateCheckoutSessionResponse = {
        success: false,
        error: 'Invalid request: orderId and positive amount required'
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 400,
        headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' },
      });
    }

    console.log(`Creating Checkout Session for order ${orderId}, amount ${amount} ${currency}`);

    // Create Checkout Session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: productName,
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://candy-shop4.pages.dev/thank-you?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://candy-shop4.pages.dev/cancel',
      metadata: {
        order_id: orderId,
      },
    });

    console.log('Checkout Session created successfully:', session.id);

    // Return success response with session URL
    const successResponse: CreateCheckoutSessionResponse = {
      success: true,
      sessionUrl: session.url || undefined,
      sessionId: session.id,
    };

    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Checkout Session creation failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const errorResponse: CreateCheckoutSessionResponse = {
      success: false,
      error: errorMessage
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' },
    });
  }
}

// For backward compatibility
export const onRequest = onRequestPost;

// Example frontend usage:
// const response = await fetch('/api/stripe/create-payment-intent', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({
//     orderId: '123',
//     amount: 1099, // €10.99 in cents
//     currency: 'EUR',
//     metadata: { user_id: 'user123' }
//   })
// });
// const data = await response.json();
// if (data.success) {
//   // Use data.clientSecret with Stripe Elements
// }
