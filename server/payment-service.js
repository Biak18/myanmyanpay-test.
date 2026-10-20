import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import QRCode from 'qrcode';
import { MMPaySDK } from 'mmpay-node-sdk';

const required = ['MMPAY_APP_ID', 'MMPAY_SANDBOX_PUBLISHABLE_KEY', 'MMPAY_SANDBOX_SECRET_KEY'];
let sdk;
let callbackListenersRegistered = false;

export function isMmpayConfigured() {
  return required.every((key) => Boolean(process.env[key]));
}

export function getMmpay() {
  if (!isMmpayConfigured()) return null;
  if (!sdk) {
    sdk = new MMPaySDK({
      appId: process.env.MMPAY_APP_ID,
      publishableKey: process.env.MMPAY_SANDBOX_PUBLISHABLE_KEY,
      secretKey: process.env.MMPAY_SANDBOX_SECRET_KEY,
      apiBaseUrl: process.env.MMPAY_API_BASE_URL || 'https://sandbox.myanmyanpay.com',
    });
  }
  if (!callbackListenersRegistered) {
    sdk.onTxCreate((tx) => console.info('MMPay sandbox transaction pending:', tx.orderId));
    sdk.onTxSuccess((tx) => console.info('MMPay sandbox transaction succeeded:', tx.orderId));
    sdk.onTxFail((tx) => console.info('MMPay sandbox transaction failed:', tx.orderId));
    sdk.onTxRefund((tx) => console.info('MMPay sandbox transaction refunded:', tx.orderId));
    sdk.onTxCancel((tx) => console.info('MMPay sandbox transaction cancelled:', tx.orderId));
    sdk.onTxExpire((tx) => console.info('MMPay sandbox transaction expired:', tx.orderId));
    sdk.onHeartbeat((tx) => console.info('MMPay sandbox transaction heartbeat:', tx.orderId));
    callbackListenersRegistered = true;
  }
  return sdk;
}

export async function createSandboxPayment(amount) {
  const mmpay = getMmpay();
  if (!mmpay) {
    const error = new Error('Add your sandbox credentials to .env or Vercel environment variables.');
    error.statusCode = 503;
    throw error;
  }
  if (!Number.isSafeInteger(amount) || amount < 100) {
    const error = new Error('Enter an amount of at least 100 MMK.');
    error.statusCode = 400;
    throw error;
  }

  const orderId = `TEST-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`;
  const payment = await mmpay.sandboxPay({
    orderId,
    amount,
    currency: 'MMK',
    items: [{ name: 'Fieldnotes journal', amount, quantity: 1 }],
    customMessage: 'Fieldnotes sandbox test payment',
  });
  if (!payment?.qr) throw new Error('Sandbox did not return a QR payload. Check your keys and API response.');

  const qrImage = await QRCode.toDataURL(payment.qr, { width: 320, margin: 1, color: { dark: '#17251f', light: '#ffffff' } });
  return { orderId, amount, status: payment.status || 'PENDING', qrImage, qrPayload: payment.qr };
}

export async function verifySandboxCallback(payload, nonce, signature) {
  const mmpay = getMmpay();
  if (!mmpay) {
    const error = new Error('Sandbox credentials are not configured.');
    error.statusCode = 503;
    throw error;
  }
  const valid = await mmpay.verifyCb(payload, nonce, signature);
  if (!valid) return false;

  await mmpay.listen(payload, nonce, signature);
  return true;
}
