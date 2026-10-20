import { verifySandboxCallback } from '../../server/payment-service.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
  const nonce = req.headers['x-mmpay-nonce'];
  const signature = req.headers['x-mmpay-signature'];
  try {
    if (!await verifySandboxCallback(payload, nonce, signature)) return res.status(400).json({ error: 'Invalid callback signature.' });
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('MMPay sandbox callback failed:', error?.message || error);
    return res.status(error.statusCode || 400).json({ error: error?.message || 'Could not process the sandbox callback.' });
  }
}
