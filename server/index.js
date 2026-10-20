import 'dotenv/config';
import express from 'express';
import { createSandboxPayment, isMmpayConfigured, verifySandboxCallback } from './payment-service.js';

const app = express();
app.use(express.json({ limit: '32kb' }));
app.get('/api/status', (_req, res) => res.json({ configured: isMmpayConfigured(), environment: 'sandbox' }));
app.post('/api/payments', async (req, res) => {
  const amount = Number(req.body?.amount);
  try {
    res.json(await createSandboxPayment(amount));
  } catch (error) {
    console.error('MMPay sandbox payment failed:', error?.message || error);
    res.status(error.statusCode || 502).json({ error: error?.message || 'Could not create a sandbox payment.' });
  }
});
app.post('/api/webhooks/mmpay-callback', async (req, res) => {
  const payload = JSON.stringify(req.body);
  const nonce = req.headers['x-mmpay-nonce'];
  const signature = req.headers['x-mmpay-signature'];
  try {
    if (!await verifySandboxCallback(payload, nonce, signature)) return res.status(400).json({ error: 'Invalid callback signature.' });
    res.json({ received: true });
  } catch (error) {
    console.error('MMPay sandbox callback failed:', error?.message || error);
    res.status(error.statusCode || 400).json({ error: error?.message || 'Could not process the sandbox callback.' });
  }
});
const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`Sandbox API listening at http://localhost:${port}`));
