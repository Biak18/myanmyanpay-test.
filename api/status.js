import { isMmpayConfigured } from '../server/payment-service.js';

export default function handler(_req, res) {
  res.status(200).json({ configured: isMmpayConfigured(), environment: 'sandbox' });
}
