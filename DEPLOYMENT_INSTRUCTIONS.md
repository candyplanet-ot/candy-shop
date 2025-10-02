<<<<<<< HEAD
# Deployment Instructions for Cloudflare Function and Frontend Update

## Step 1: Add Environment Variable Secrets to Cloudflare

Run the following commands in your terminal to add your SumUp credentials as secrets in your Cloudflare project:

```bash
npx wrangler secret put SUMUP_CLIENT_ID
npx wrangler secret put SUMUP_CLIENT_SECRET
```

You will be prompted to enter the values for each secret. Use the values from your `.env` file.

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
=======
# Deployment Instructions for Cloudflare Function and Frontend Update

## Step 1: Add Environment Variable Secrets to Cloudflare

Run the following commands in your terminal to add your SumUp credentials as secrets in your Cloudflare project:

```bash
npx wrangler secret put SUMUP_CLIENT_ID
npx wrangler secret put SUMUP_CLIENT_SECRET
```

You will be prompted to enter the values for each secret. Use the values from your `.env` file.

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
>>>>>>> cf3b96f63dd429b0a17bbe128b6c7a693ae364f5
