import { motion } from 'framer-motion';
import { Calendar, Search, User } from 'lucide-react';
import { useState } from 'react';

export default function Sermons() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const sermons = [
    {
      id: 1,
      title: 'Faith in the Storm',
      speaker: 'Pastor John Smith',
      date: '2024-05-05',
      category: 'Faith',
      description: "How to maintain faith when facing life's challenges.",
    },
    {
      id: 2,
      title: 'Love Never Fails',
      speaker: 'Pastor Sarah Johnson',
      date: '2024-04-28',
      category: 'Love',
      description: "Understanding the power of God's love in our lives.",
    },
    {
      id: 3,
      title: "God's Plan for Your Life",
      speaker: 'Pastor John Smith',
      date: '2024-04-21',
      category: 'Purpose',
      description: "Discovering God's purpose and calling for your journey.",
    },
    {
      id: 4,
      title: 'Freedom in Christ',
      speaker: 'Pastor Sarah Johnson',
      date: '2024-04-14',
      category: 'Freedom',
      description: 'Breaking free from the chains that hold us captive.',
    },
  ];

  const filteredSermons = sermons.filter(
    (sermon) =>
      (selectedCategory === 'all' || sermon.category === selectedCategory) &&
      (sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="w-full">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-serif">Sermons</h1>
          <p className="text-lg text-gray-200 mt-4">
            Listen to our latest messages and teachings
          </p>
        </div>
      </motion.section>

      {/* Search and Filter */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="visible"
        className="py-8 bg-white border-b"
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            className="flex gap-4 flex-col md:flex-row"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search sermons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
            >
              <option value="all">All Categories</option>
              <option value="Faith">Faith</option>
              <option value="Love">Love</option>
              <option value="Purpose">Purpose</option>
              <option value="Freedom">Freedom</option>
            </select>
          </motion.div>
        </div>
      </motion.section>

      {/* Sermons List */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-[#f8f9fa]"
      >
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            {filteredSermons.map((sermon) => (
              <motion.div
                key={sermon.id}
                variants={fadeInUp}
                className="bg-white p-6 rounded-lg shadow"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#1a1a2e] mb-2">
                      {sermon.title}
                    </h3>
                    <div className="flex gap-4 text-gray-600 flex-wrap">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{sermon.speaker}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                          {new Date(sermon.date).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="bg-[#e94560] text-white px-3 py-1 rounded text-sm">
                        {sermon.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-3">{sermon.description}</p>
                  </div>
                  <button className="bg-[#e94560] hover:bg-[#d43d4f] text-white px-6 py-2 rounded-lg transition whitespace-nowrap">
                    Listen
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
