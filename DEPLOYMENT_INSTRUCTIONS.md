# Deployment Instructions for Cloudflare Function and Frontend Update

## Step 1: Clean Up Old Secrets and Add New Environment Variable Secrets to Cloudflare

First, if you have any old SumUp token secrets (like SUMUP_SANDBOX_TOKEN), delete them:

```bash
npx wrangler secret delete SUMUP_SANDBOX_TOKEN
```

Then, run the following commands to add your SumUp production credentials as secrets:

```bash
npx wrangler secret put SUMUP_CLIENT_ID
npx wrangler secret put SUMUP_CLIENT_SECRET
```

When prompted, enter these production values:
- SUMUP_CLIENT_ID: `cc_classic_4wON9feKLsaB1SgZM1PwUXSlNnDAO`
- SUMUP_CLIENT_SECRET: `cc_sk_classic_wNNJTugeEMSklqVYvDNSciQJBlFBvhbKEmN1gd53PFYIb2D1Z6`

The function will now automatically generate access tokens using OAuth2, so no static token secrets are needed.

## Step 2: Deploy Cloudflare Function

From the `ancient-leaf-2b5c` directory (or your Cloudflare project root), run:

```bash
npx wrangler publish
```

This will deploy your Cloudflare function to Cloudflare Pages.

## Step 3: Update Frontend API URL

In your `src/pages/Checkout.tsx` file, update the fetch URL for the SumUp checkout API to point to the deployed Cloudflare function URL.

For example, replace:

```typescript
const response = await fetch('/api/sumup/checkout', {
```

with

```typescript
const response = await fetch('https://<your-project>.pages.dev/api/sumup/checkout', {
```

Replace `<your-project>` with your actual Cloudflare Pages project name.

## Step 4: Test the Integration

- Start your frontend dev server.
- Place an order and verify the payment flow works correctly with the deployed Cloudflare function.

---

If you want, I can help you update the fetch URL in `Checkout.tsx` now. Just let me know.
