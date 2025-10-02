import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle CORS preflight
function handleOptions() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Get SumUp access token
async function getAccessToken() {
  try {
    const response = await fetch('https://api.sandbox.sumup.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.SUMUP_CLIENT_ID || 'your_test_client_id',
        client_secret: process.env.SUMUP_CLIENT_SECRET || 'your_test_client_secret',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SumUp token error: ${error}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

export async function onRequestPost({ request }: { request: Request }) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleOptions();
  }

  try {
    // Parse request body
    const { orderId } = await request.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'orderId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For testing, use dummy data if Supabase is not configured
    let order;
    if (!process.env.SUPABASE_URL) {
      console.log('Using test order data (Supabase not configured)');
      order = {
        id: orderId,
        total_amount: 10.99, // Test amount
        currency: 'EUR',
        items: [{ name: 'Test Item', quantity: 1, price: 10.99 }]
      };
    } else {
      // Fetch order from Supabase
      console.log('Fetching order from Supabase');
      const { data, error } = await supabase
        .from('orders')
        .select('id, total_amount, currency, items')
        .eq('id', orderId)
        .single();

      if (error || !data) {
        console.error('Order not found in Supabase:', error);
        return new Response(
          JSON.stringify({ error: 'Order not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      order = data;
    }

    // Get SumUp access token
    console.log('Getting SumUp access token');
    const accessToken = await getAccessToken();
    const merchantCode = process.env.SUMUP_MERCHANT_CODE || 'your_test_merchant_code';
    const checkoutBaseUrl = 'https://api.sandbox.sumup.com/v0.1/checkouts';

    // Create checkout session
    console.log('Creating SumUp checkout');
    const sumupResponse = await fetch(checkoutBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        checkout_reference: order.id,
        amount: Math.round(order.total_amount * 100), // Convert to cents
        currency: order.currency || 'EUR',
        merchant_code: merchantCode,
        description: `Order #${order.id}`,
        return_url: `${new URL(request.url).origin}/order-success`,
        cancel_url: `${new URL(request.url).origin}/cart`,
      }),
    });

    const data = await sumupResponse.json();

    if (!sumupResponse.ok) {
      console.error('SumUp API error:', data);
      throw new Error(data.message || 'Failed to create SumUp checkout');
    }

    const checkoutPaymentUrl = `https://sandbox.checkout.sumup.com/pay/${data.id}`;
    console.log('Checkout created successfully:', checkoutPaymentUrl);

    return new Response(
      JSON.stringify({
        success: true,
        redirectUrl: checkoutPaymentUrl,
        checkoutId: data.id
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return new Response(
      JSON.stringify({
        success: false,
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
}

// For backward compatibility
export const onRequest = onRequestPost;
