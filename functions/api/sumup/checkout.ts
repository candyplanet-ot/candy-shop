import { Router } from 'itty-router';

const router = Router();

// Configuration
const SUMUP_CLIENT_ID = process.env.SUMUP_CLIENT_ID || '';
const SUMUP_CLIENT_SECRET = process.env.SUMUP_CLIENT_SECRET || '';

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Helper function to get access token from SumUp
async function getAccessToken() {
  const tokenUrl = 'https://api.sumup.com/token';
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: SUMUP_CLIENT_ID,
    client_secret: SUMUP_CLIENT_SECRET,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to get access token from SumUp');
  }

  const data = await response.json();
  return data.access_token;
}

// Handle CORS preflight
router.options('/', () => {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
});

// Handle checkout creation
router.post('/', async (request: Request) => {
  try {
    // Parse and validate request
    const body = await request.json();
    const { orderId, amount } = body;

    if (!orderId || !amount) {
      return new Response(
        JSON.stringify({ error: 'Missing orderId or amount' }), 
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Get SumUp API credentials
    const accessToken = await getAccessToken();
    const apiEndpoint = 'https://api.sumup.com/v0.1/checkouts';
    const merchantCode = process.env.SUMUP_MERCHANT_CODE || '';

    if (!merchantCode) {
      throw new Error('Merchant code is not configured');
    }

    // Create checkout session
    const checkoutResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        checkout_reference: orderId,
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'EUR',
        merchant_code: merchantCode,
        description: `Order #${orderId}`,
        return_url: `${new URL(request.url).origin}/order-success`,
        cancel_url: `${new URL(request.url).origin}/cart`,
      }),
    });

    // Handle API response
    if (!checkoutResponse.ok) {
      const error = await checkoutResponse.text();
      console.error('SumUp API error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create checkout',
          details: error,
        }), 
        {
          status: checkoutResponse.status,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Return checkout URL to client
    const { id } = await checkoutResponse.json();
    const redirectUrl = `https://checkout.sumup.com/pay/${id}`;

    return new Response(
      JSON.stringify({ checkoutUrl: redirectUrl }), 
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    // Handle any unexpected errors
    console.error('Checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return new Response(
      JSON.stringify({ 
        error: 'Checkout processing failed',
        details: errorMessage,
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});

export default router;
