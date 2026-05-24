import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        ref: string;
        onClose: () => void;
        onSuccess: (response: { reference: string }) => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

export default function Giving() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [category, setCategory] = useState('general');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const paystackScriptLoaded = useRef(false);

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  // Load Paystack script
  useEffect(() => {
    if (paystackScriptLoaded.current) return;

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    paystackScriptLoaded.current = true;

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const amounts = [10000, 20000, 50000, 100000, 250000, 500000];
  const categories = [
    {
      id: 'general',
      label: 'General Fund',
      description: 'Support all church operations',
    },
    {
      id: 'missions',
      label: 'Missions',
      description: 'Support global mission work',
    },
    {
      id: 'community',
      label: 'Community Outreach',
      description: 'Help those in our community',
    },
    {
      id: 'youth',
      label: 'Youth Ministry',
      description: 'Support our young people',
    },
  ];

  const handleDonate = async () => {
    const amount = customAmount || selectedAmount;

    if (!amount || !email) {
      setMessage('Please enter email and select an amount');
      return;
    }

    if (!publicKey) {
      setMessage('Payment configuration error. Please contact support.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Initialize payment with your backend
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount: parseFloat(String(amount)),
          category,
        }),
      });

      const data = await response.json();
      console.log('Payment initialization response:', data);

      if (!response.ok) {
        setMessage(`Backend error: ${data.error || response.statusText}`);
        setLoading(false);
        return;
      }

      if (!data.status) {
        console.error('Paystack error:', data);
        setMessage(
          `Paystack error: ${data.message || 'Payment initialization failed'}`,
        );
        setLoading(false);
        return;
      }

      // Use Paystack inline
      if (window.PaystackPop) {
        const handler = window.PaystackPop.setup({
          key: publicKey,
          email,
          amount: parseFloat(String(amount)) * 100, // Paystack uses kobo
          ref: data.data.reference,
          onSuccess: () => {
            setMessage('✓ Donation successful! Thank you for your generosity.');
            setSelectedAmount(null);
            setCustomAmount('');
            setEmail('');
            setTimeout(() => setMessage(''), 3000);
          },
          onClose: () => {
            setMessage('Payment window closed');
          },
        });
        handler.openIframe();
      }
    } catch (error) {
      console.error('Donation error:', error);
      setMessage('Error processing donation. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="w-full">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Support Our Mission
          </h1>
          <p className="text-lg text-gray-200 mt-4">
            Your generosity makes a difference in our community
          </p>
        </div>
      </motion.section>

      {/* Giving Form */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-white"
      >
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            variants={fadeInUp}
            className="bg-[#f8f9fa] p-8 rounded-lg"
          >
            {/* Email Input */}
            <div className="mb-8">
              <label className="block text-[#1a1a2e] font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
              />
            </div>

            {/* Category Selection */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">
                Select a category
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-lg border-2 text-left transition ${
                      category === cat.id
                        ? 'border-[#e94560] bg-red-50'
                        : 'border-gray-300 hover:border-[#e94560]'
                    }`}
                  >
                    <div className="font-semibold text-[#1a1a2e]">
                      {cat.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {cat.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">
                Select an amount
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`p-3 rounded-lg font-semibold transition ${
                      selectedAmount === amount
                        ? 'bg-[#e94560] text-white'
                        : 'bg-white border-2 border-gray-300 text-[#1a1a2e] hover:border-[#e94560]'
                    }`}
                  >
                    ₦{amount.toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Or enter custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
              />
            </div>

            {/* Summary */}
            <div className="bg-white p-6 rounded-lg mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Amount:</span>
                <span className="text-3xl font-bold text-[#e94560]">
                  ₦{(customAmount || selectedAmount || '0').toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Category:</span>
                <span className="font-semibold text-[#1a1a2e]">
                  {categories.find((c) => c.id === category)?.label}
                </span>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-lg mb-4 text-center text-sm ${
                  message.includes('✓')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {message}
              </div>
            )}

            {/* Donate Button */}
            <button
              onClick={handleDonate}
              disabled={loading}
              className="w-full bg-[#e94560] hover:bg-[#d43d4f] disabled:bg-gray-400 text-white py-4 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2"
            >
              <Heart size={24} />
              {loading ? 'Processing...' : 'Donate Now'}
            </button>

            <p className="text-center text-gray-600 mt-4 text-sm">
              Your contribution is secure and tax-deductible. Jethro Liberation
              Ministries Intl is a 501(c)(3) organization.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
