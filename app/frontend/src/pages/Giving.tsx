import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState } from 'react';

export default function Giving() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [category, setCategory] = useState('general');

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

  const amounts = [10, 25, 50, 100, 250, 500];
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

  return (
    <div className="w-full">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-serif">
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
                    ${amount}
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
                  ${customAmount || selectedAmount || '0'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Category:</span>
                <span className="font-semibold text-[#1a1a2e]">
                  {categories.find((c) => c.id === category)?.label}
                </span>
              </div>
            </div>

            {/* Donate Button */}
            <button className="w-full bg-[#e94560] hover:bg-[#d43d4f] text-white py-4 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2">
              <Heart size={24} />
              Donate Now
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
