# Myan Myan Pay sandbox checkout

A small React + Vite checkout with an Express API that creates sandbox MMQR payment requests. The secret key stays on the server and is never included in the browser build.

## Start locally

1. Install Node.js, then run `npm install` in this directory.
2. Copy `.env.example` to `.env` and fill in the sandbox app ID, publishable key, and secret key from the Myan Myan Pay developer console.
3. Run `npm run dev` and open the local Vite URL printed in the terminal.
4. Enter an amount and choose **Continue to payment**. Scan the returned sandbox QR with a supported payment app.

The API uses `https://sandbox.myanmyanpay.com` by default. Set `MMPAY_API_BASE_URL` only if Myan Myan Pay gave your sandbox app a different base URL. Never put the secret key in a `VITE_` variable or commit `.env`.

## Run the merchant test-payment exercise

1. Add the sandbox app ID, publishable key, and secret key to `.env`, then start the app with `npm run dev`.
2. Enter an amount of at least 1,000 MMK and choose **Continue to payment**. The server calls the MMPay SDK and returns an order reference plus the MMQR payload; the browser displays the QR.
3. Scan the QR using a supported payment app. QR creation starts a `PENDING` request; it is not proof of payment.
4. The checkout checks status automatically every five seconds through `GET /api/payment-status?orderId=...`, which uses the SDK's payment lookup method. `SUCCESS` confirms the payment. `PENDING` means it is still awaiting payment; `FAILED`, `CANCELLED`, and `EXPIRED` are not successful. Terminal results hide the QR and show **Close result**.
5. To demonstrate cancellation, choose **Cancel active payment**. The app calls MMPay's cancel API and clears the cached order only after MMPay confirms `CANCELLED`.

The verified webhook endpoint is `/api/webhooks/mmpay-callback`. It validates the `X-Mmpay-Nonce` and `X-Mmpay-Signature` headers through the SDK, then emits the matching event in the server logs. A webhook is server-to-server and does not push directly into the open browser. The page therefore looks up the latest provider status automatically. For local development, configure a publicly reachable webhook URL in the MMPay developer console to receive callbacks. This demo does not store order statuses in a database.

## Deploy on Vercel

1. Push this project to a Git provider that Vercel can access, then import the repository into Vercel. Keep the project root as the repository root; Vercel uses `npm run build` and Vite's `dist` output.
2. Deploy once to get a public URL such as `https://your-project.vercel.app`. The Vite app is static, and the `api/` files run as Vercel Functions on the same domain.
3. Create the Myan Myan Pay application using the public deployment URL as the **Application Website** and `https://your-project.vercel.app/api/webhooks/mmpay-callback` as the **Sandbox Webhook URL**.
4. In Vercel project settings, add `MMPAY_APP_ID`, `MMPAY_SANDBOX_PUBLISHABLE_KEY`, and `MMPAY_SANDBOX_SECRET_KEY` as server-side environment variables for Preview and Production as needed. Add `MMPAY_API_BASE_URL` only if Myan Myan Pay supplied a different sandbox API URL. Never prefix these variables with `VITE_`.
5. Redeploy after adding the credentials, then open the public site and check `/api/status` reports `configured: true` before trying a sandbox payment.

The local Express server remains available through `npm run dev`; Vite proxies `/api` requests to it during local development.
# myanmyanpay-test.
