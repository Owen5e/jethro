import express, { Request, Response } from 'express';
import https from 'https';

const router = express.Router();
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY?.trim();

// Check if secret key is configured
if (!PAYSTACK_SECRET) {
  console.warn('⚠️  PAYSTACK_SECRET_KEY is not configured in .env');
} else {
  console.log(
    `✓ PAYSTACK_SECRET_KEY loaded: ${PAYSTACK_SECRET.substring(0, 10)}...${PAYSTACK_SECRET.substring(PAYSTACK_SECRET.length - 10)}`,
  );
}

// Initialize payment
router.post('/initialize', (req: Request, res: Response) => {
  const { email, amount, category, metadata } = req.body;

  // Validate required fields
  if (!email || !amount) {
    res.status(400).json({ error: 'Email and amount are required' });
    return;
  }

  // Paystack expects amount in kobo (1 dollar = 100 kobo)
  const amountInKobo = Math.round(amount * 100);

  const params = JSON.stringify({
    email,
    amount: amountInKobo,
    metadata: {
      category,
      ...metadata,
    },
  });

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json',
    },
  };

  const clientReq = https.request(options, (payRes) => {
    let data = '';
    payRes.on('data', (chunk) => {
      data += chunk;
    });
    payRes.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        console.log('Paystack response:', parsedData);
        res.json(parsedData);
      } catch (error) {
        console.error('Failed to parse Paystack response:', data, error);
        res
          .status(500)
          .json({ error: 'Failed to parse Paystack response', details: data });
      }
    });
  });

  clientReq.on('error', (error) => {
    console.error('Payment initialization error:', error);
    res
      .status(500)
      .json({ error: 'Payment initialization failed', details: error.message });
  });

  clientReq.write(params);
  clientReq.end();
});

// Verify payment
router.post('/verify/:reference', (req: Request, res: Response) => {
  const { reference } = req.params;

  if (!reference) {
    res.status(400).json({ error: 'Reference is required' });
    return;
  }

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
    },
  };

  const clientReq = https.request(options, (payRes) => {
    let data = '';
    payRes.on('data', (chunk) => {
      data += chunk;
    });
    payRes.on('end', () => {
      try {
        res.json(JSON.parse(data));
      } catch (error) {
        res
          .status(500)
          .json({ error: 'Failed to parse verification response' });
      }
    });
  });

  clientReq.on('error', (error) => {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  });

  clientReq.end();
});

export default router;
