import { motion } from 'framer-motion';
import { Calendar, Headphones, Pause, Search, User, Video } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { sermonsApi } from '../lib/api';

export default function Sermons() {
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const togglePlay = (sermonId: string, audioUrl: string) => {
    // Pause any currently playing audio
    if (playingId && playingId !== sermonId && audioRefs.current[playingId]) {
      audioRefs.current[playingId].pause();
      audioRefs.current[playingId].currentTime = 0;
    }

    if (playingId === sermonId) {
      // Clicking the same sermon's play button again toggles
      if (audioRefs.current[sermonId]) {
        if (audioRefs.current[sermonId].paused) {
          audioRefs.current[sermonId].play();
        } else {
          audioRefs.current[sermonId].pause();
        }
      }
    } else {
      setPlayingId(sermonId);
      // Create audio element if it doesn't exist
      if (!audioRefs.current[sermonId]) {
        const audio = new Audio(audioUrl);
        audio.addEventListener('ended', () => {
          setPlayingId(null);
        });
        audioRefs.current[sermonId] = audio;
      }
      audioRefs.current[sermonId].play();
    }
  };

  const stopPlaying = (sermonId: string) => {
    if (audioRefs.current[sermonId]) {
      audioRefs.current[sermonId].pause();
      audioRefs.current[sermonId].currentTime = 0;
    }
    setPlayingId(null);
  };

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
        <div className="container mx-auto px-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sermons.map((sermon: any) => (
                <motion.div
                  key={sermon.id}
                  variants={fadeInUp}
                  className="bg-white p-6 rounded-lg shadow flex flex-col"
                >
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#1a1a2e] mb-2">
                      {sermon.title}
                    </h3>
                    <div className="flex gap-4 text-gray-600 flex-wrap mb-3">
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
                    <p className="text-gray-600 mb-4">{sermon.description}</p>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() =>
                        sermon.audio_url &&
                        togglePlay(sermon.id, sermon.audio_url)
                      }
                      disabled={!sermon.audio_url}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg transition whitespace-nowrap ${
                        !sermon.audio_url
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : playingId === sermon.id
                            ? 'bg-[#d43d4f] text-white'
                            : 'bg-[#e94560] hover:bg-[#d43d4f] text-white'
                      }`}
                    >
                      {playingId === sermon.id ? (
                        <>
                          <Pause size={16} />
                          Pause
                        </>
                      ) : (
                        <>
                          <Headphones size={16} />
                          Listen
                        </>
                      )}
                    </button>
                    <a
                      href={sermon.video_url || '#'}
                      target={sermon.video_url ? '_blank' : undefined}
                      rel={sermon.video_url ? 'noopener noreferrer' : undefined}
                      onClick={(e) => !sermon.video_url && e.preventDefault()}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg transition whitespace-nowrap ${
                        !sermon.video_url
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-[#0f3460] hover:bg-[#16213e] text-white'
                      }`}
                    >
                      <Video size={16} />
                      Watch
                    </a>
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
