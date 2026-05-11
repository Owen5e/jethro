import { motion } from 'framer-motion';
import { Calendar, Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { sermonsApi } from '../lib/api';

export default function Sermons() {
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const params: { search?: string; category?: string } = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory !== 'all') params.category = selectedCategory;
        const data = await sermonsApi.getAll(params);
        setSermons(data || []);
      } catch (err) {
        console.error('Failed to fetch sermons:', err);
        setSermons([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSermons();
  }, [searchTerm, selectedCategory]);

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
              <option value="Purity">Purity</option>
              <option value="Deliverance">Deliverance</option>
              <option value="Prayer">Prayer</option>
              <option value="Prosperity">Prosperity</option>
              <option value="Worship">Worship</option>
            </select>
          </motion.div>
        </div>
      </motion.section>

      {/* Sermons List */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="visible"
        className="py-16 md:py-24 bg-[#f8f9fa]"
      >
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="text-center text-gray-500 py-12">
              Loading sermons...
            </div>
          ) : sermons.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <User size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No sermons found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sermons.map((sermon: any) => (
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
                          <span>{sermon.author}</span>
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
                    <div className="flex gap-2">
                      {sermon.audio_url && (
                        <a
                          href={sermon.audio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#e94560] hover:bg-[#d43d4f] text-white px-6 py-2 rounded-lg transition whitespace-nowrap"
                        >
                          Listen
                        </a>
                      )}
                      {sermon.video_url && (
                        <a
                          href={sermon.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#0f3460] hover:bg-[#16213e] text-white px-6 py-2 rounded-lg transition whitespace-nowrap"
                        >
                          Watch
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
