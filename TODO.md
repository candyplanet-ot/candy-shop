# SumUp Payment Integration TODO

## 1. Set Up Environment Variables
- Add SumUp credentials to .env file:
  - VITE_SUMUP_CLIENT_ID=cc_classic_SP644UBvaCjvnTksffM3oM41vxouH
  - VITE_SUMUP_CLIENT_SECRET=cc_sk_classic_jOlhQLjbnqZndrRI3xALhb1zSuDj206g8c99nAnuSk2Q57E0C1
  - Note: For Cloudflare Functions, use wrangler secrets or env vars.

## 2. Initialize Cloudflare Functions
- Install Wrangler CLI if not installed.
- Initialize functions in the project: `wrangler init --yes` or set up functions directory.
- Configure wrangler.toml for the project.

## 3. Create Payment Function (/api/sumup/checkout)
- Create functions/api/sumup/checkout.js (or .ts).
- Implement logic to:
  - Get access token from SumUp using client credentials.
  - Create checkout with amount, currency (EUR), reference (order ID).
  - Return checkout URL and reference.

## 4. Update Checkout Page (src/pages/Checkout.tsx)
- [x] Modify placeOrder function to:
  - Create order in Supabase first, get order ID.
  - Call https://candy-shop4.pages.dev/api/sumup/checkout with order ID and subtotal.
  - Redirect to checkout URL on success.
  - Handle errors and loading states.

## 5. Create Order Success Page (src/pages/OrderSuccess.tsx)
- New page to handle post-payment confirmation.
- Process query params if any.
- Update order status to "paid" in Supabase.
- Display success message and clear cart.

## 6. Update Order Schema
- Check if orders table needs payment_reference field.
- Update status handling for paid/failed.

## 7. Add Error Handling and Logging
- Implement error handling in functions and frontend.
- Add logging for debugging.

## 8. Testing and Deployment
- Test in SumUp sandbox.
- Deploy functions and test full flow.
- Verify callback and order updates.
