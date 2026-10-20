import { verifySandboxCallback } from '../../server/payment-service.js';

export const config = { api: { bodyParser: false } };

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  const payload = await readRawBody(req);
  const nonce = req.headers['x-mmpay-nonce'];
  const signature = req.headers['x-mmpay-signature'];
  try {
    try { JSON.parse(payload); } catch { return res.status(400).json({ error: 'Callback body must be valid JSON.' }); }
    if (!await verifySandboxCallback(payload, nonce, signature)) return res.status(400).json({ error: 'Invalid callback signature.' });
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('MMPay sandbox callback failed:', error?.message || error);
    return res.status(error.statusCode || 400).json({ error: error?.message || 'Could not process the sandbox callback.' });
  }
}
