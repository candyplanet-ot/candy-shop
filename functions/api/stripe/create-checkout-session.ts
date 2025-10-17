import Stripe from 'stripe';

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
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
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

    // Use env binding for Cloudflare or fallback to Node.js process.env
    const STRIPE_KEY = env?.STRIPE_SECRET_KEY || env.STRIPE_SECRET_KEY;
    if (!STRIPE_KEY) {
      console.error('Missing STRIPE_SECRET_KEY in environment variables');
      return new Response(JSON.stringify({ success: false, error: 'Stripe secret key not configured' }), {
        status: 500,
        headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' },
      });
    }

    const stripe = new Stripe(STRIPE_KEY, { apiVersion: '2025-09-30.clover' });

    // Parse JSON payload
    const body: CreateCheckoutSessionRequest = await request.json();
    const { orderId, amount, currency = 'EUR', productName = 'Order' } = body;

    // Validate required fields
    if (!orderId || typeof amount !== 'number' || amount <= 0) {
      console.error('Invalid request payload:', body);
      return new Response(JSON.stringify({ success: false, error: 'Invalid request: orderId and positive amount required' }), {
        status: 400,
        headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' },
      });
    }

    console.log(`Creating Checkout Session for order ${orderId}, amount ${amount} ${currency}`);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: productName },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${new URL(request.url).origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(request.url).origin}/cancel`,
      metadata: { order_id: orderId },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'],
      },
    });

    console.log('Checkout Session created successfully:', session.id);

    return new Response(JSON.stringify({ success: true, sessionUrl: session.url, sessionId: session.id }), {
      status: 200,
      headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Checkout Session creation failed:', error);
    return new Response(JSON.stringify({ success: false, error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' },
    });
  }
}

// Handle OPTIONS requests for CORS
export async function onRequestOptions({ request }: { request: Request }): Promise<Response> {
  return handleOptions(request);
}

// Backward compatibility
export const onRequest = onRequestPost;
