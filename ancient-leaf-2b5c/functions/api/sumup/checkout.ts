import { Router } from 'itty-router';

const router = Router();

const SUMUP_CLIENT_ID = process.env.SUMUP_CLIENT_ID!;
const SUMUP_CLIENT_SECRET = process.env.SUMUP_CLIENT_SECRET!;

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
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
});

router.post('/', async (request: Request) => {
  try {
    const body = await request.json();
    const { orderId, amount } = body;

    if (!orderId || !amount) {
      return new Response(JSON.stringify({ error: 'Missing orderId or amount' }), {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const accessToken = await getAccessToken();

    const checkoutResponse = await fetch('https://api.sumup.com/v0.1/checkouts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkout_reference: orderId,
        amount: {
          amount: amount.toFixed(2),
          currency: 'EUR',
        },
        merchant_code: SUMUP_CLIENT_ID,
        return_url: 'https://candy-shop4.pages.dev/order-success',
      }),
    });

    if (!checkoutResponse.ok) {
      const errorData = await checkoutResponse.json();
      return new Response(JSON.stringify({ error: 'Failed to create checkout', details: errorData }), {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const checkoutData = await checkoutResponse.json();

    return new Response(JSON.stringify({ checkoutUrl: checkoutData.checkout_url }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
});

export default {
  fetch: router.handle,
};
