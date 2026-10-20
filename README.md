# Myan Myan Pay sandbox checkout

A small React + Vite checkout with an Express API that creates sandbox MMQR payment requests. The secret key stays on the server and is never included in the browser build.

## Start locally

1. Install Node.js, then run `npm install` in this directory.
2. Copy `.env.example` to `.env` and fill in the sandbox app ID, publishable key, and secret key from the Myan Myan Pay developer console.
3. Run `npm run dev` and open the local Vite URL printed in the terminal.
4. Enter an amount and choose **Continue to payment**. Scan the returned sandbox QR with a supported payment app.

The API uses `https://sandbox.myanmyanpay.com` by default. Set `MMPAY_API_BASE_URL` only if Myan Myan Pay gave your sandbox app a different base URL. Never put the secret key in a `VITE_` variable or commit `.env`.

The sandbox QR request is initiated here; this demo does not treat the browser redirect or QR scan as proof of a successful payment. The verified callback is available at `/api/webhooks/mmpay-callback`. It validates the `X-Mmpay-Nonce` and `X-Mmpay-Signature` headers through the SDK and logs callback statuses. This demo does not persist callback status in a database; confirm payment status in the sandbox transaction details in the developer console.

## Deploy on Vercel

1. Push this project to a Git provider that Vercel can access, then import the repository into Vercel. Keep the project root as the repository root; Vercel uses `npm run build` and Vite's `dist` output.
2. Deploy once to get a public URL such as `https://your-project.vercel.app`. The Vite app is static, and the `api/` files run as Vercel Functions on the same domain.
3. Create the Myan Myan Pay application using the public deployment URL as the **Application Website** and `https://your-project.vercel.app/api/webhooks/mmpay-callback` as the **Sandbox Webhook URL**.
4. In Vercel project settings, add `MMPAY_APP_ID`, `MMPAY_SANDBOX_PUBLISHABLE_KEY`, and `MMPAY_SANDBOX_SECRET_KEY` as server-side environment variables for Preview and Production as needed. Add `MMPAY_API_BASE_URL` only if Myan Myan Pay supplied a different sandbox API URL. Never prefix these variables with `VITE_`.
5. Redeploy after adding the credentials, then open the public site and check `/api/status` reports `configured: true` before trying a sandbox payment.

The local Express server remains available through `npm run dev`; Vite proxies `/api` requests to it during local development.
# myanmyanpay-test.
