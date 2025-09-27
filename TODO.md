# TODO List for Guest Checkout Implementation

## Task: Allow guest checkout without login requirement

1. [x] Edit src/pages/Checkout.tsx:
   - Remove the auth session check and login redirect.
   - Modify order insert to use user_id from session if logged in, or null for guest orders.
   - Keep order status as "pending".

2. [x] Test guest checkout functionality.
