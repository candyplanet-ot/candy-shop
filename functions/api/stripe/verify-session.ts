import Stripe from 'stripe';

// Type definitions
interface VerifySessionRequest {
  session_id: string;
}

interface VerifySessionResponse {
  success: boolean;
  session?: any;
  error?: string;
}

// Dynamic CORS headers based on request origin
function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
export async function onRequestGet({ request, env }: { request: Request; env: any }): Promise<Response> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }

  try {
    console.log('Processing Stripe session verification request');

    // Validate environment variables
    if (!env.STRIPE_SECRET_KEY) {
      console.error('Missing STRIPE_SECRET_KEY in environment variables');
      const errorResponse: VerifySessionResponse = {
        success: false,
        error: 'Stripe secret key not configured'
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' },
      });
    }

    // Initialize Stripe with secret key from environment
    const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-09-30.clover',
    });

    // Get session_id from URL parameters
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id');

    if (!sessionId) {
      console.error('Missing session_id parameter');
      const errorResponse: VerifySessionResponse = {
        success: false,
        error: 'Missing session_id parameter'
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 400,
        headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' },
      });
    }

    console.log(`Verifying session: ${sessionId}`);

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      console.error('Session not found');
      const errorResponse: VerifySessionResponse = {
        success: false,
        error: 'Session not found'
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
        headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' },
      });
    }

    // Check if payment was successful
    if (session.payment_status === 'paid') {
      console.log('Session verified successfully:', session.id);
      const successResponse: VerifySessionResponse = {
        success: true,
        session: {
          id: session.id,
          payment_status: session.payment_status,
          amount_total: session.amount_total,
          currency: session.currency,
          customer_email: session.customer_details?.email,
          order_id: session.metadata?.order_id,
        },
      };

      return new Response(JSON.stringify(successResponse), {
        status: 200,
        headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' },
      });
    } else {
      console.log('Payment not completed for session:', session.id);
      const errorResponse: VerifySessionResponse = {
        success: false,
        error: 'Payment not completed'
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 400,
        headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Session verification failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const errorResponse: VerifySessionResponse = {
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
export const onRequest = onRequestGet;
