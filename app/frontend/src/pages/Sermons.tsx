import { motion } from 'framer-motion';
import {
  Calendar,
  Headphones,
  Pause,
  Play,
  Search,
  User,
  Video,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import sermonImage from '../assets/sermonimage.png';
import { sermonsApi } from '../lib/api';

export default function Sermons() {
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<{ [key: string]: number }>({});
  const [duration, setDuration] = useState<{ [key: string]: number }>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState<{
    [key: string]: boolean;
  }>({});
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const togglePlay = (sermonId: string, audioUrl: string) => {
    // Pause any currently playing audio
    if (playingId && playingId !== sermonId && audioRefs.current[playingId]) {
      audioRefs.current[playingId].pause();
      setIsPlayingAudio((prev) => ({ ...prev, [playingId]: false }));
    }

    if (playingId === sermonId) {
      // Clicking the same sermon's play button again toggles
      if (audioRefs.current[sermonId]) {
        if (audioRefs.current[sermonId].paused) {
          audioRefs.current[sermonId].play();
          setIsPlayingAudio((prev) => ({ ...prev, [sermonId]: true }));
        } else {
          audioRefs.current[sermonId].pause();
          setIsPlayingAudio((prev) => ({ ...prev, [sermonId]: false }));
        }
      }
    } else {
      setPlayingId(sermonId);
      // Create audio element if it doesn't exist
      if (!audioRefs.current[sermonId]) {
        const audio = new Audio(audioUrl);
        audio.addEventListener('loadedmetadata', () => {
          setDuration((prev) => ({ ...prev, [sermonId]: audio.duration }));
        });
        audio.addEventListener('timeupdate', () => {
          setCurrentTime((prev) => ({
            ...prev,
            [sermonId]: audio.currentTime,
          }));
        });
        audio.addEventListener('ended', () => {
          setPlayingId(null);
          setIsPlayingAudio((prev) => ({ ...prev, [sermonId]: false }));
        });
        audioRefs.current[sermonId] = audio;
      }
      audioRefs.current[sermonId].play();
      setIsPlayingAudio((prev) => ({ ...prev, [sermonId]: true }));
    }
  };

  const stopPlaying = (sermonId: string) => {
    if (audioRefs.current[sermonId]) {
      audioRefs.current[sermonId].pause();
      audioRefs.current[sermonId].currentTime = 0;
    }
    setPlayingId(null);
    setIsPlayingAudio((prev) => ({ ...prev, [sermonId]: false }));
  };

  const handleProgressChange = (
    sermonId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newTime = parseFloat(e.target.value);
    if (audioRefs.current[sermonId]) {
      audioRefs.current[sermonId].currentTime = newTime;
      setCurrentTime((prev) => ({ ...prev, [sermonId]: newTime }));
    }
  };

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        className="text-white py-16 md:py-24 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${sermonImage})` }}
      >
        {/* Right-side Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold">Sermons</h1>
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
                  <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                    {playingId === sermon.id && sermon.audio_url ? (
                      // Compact Player
                      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] p-4 rounded-lg text-white">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-semibold">
                            Now Playing
                          </div>
                          <button
                            onClick={() => stopPlaying(sermon.id)}
                            className="hover:bg-white/20 p-1 rounded transition"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        {/* Play/Pause and Progress */}
                        <div className="flex items-center gap-3 mb-3">
                          <button
                            onClick={() =>
                              sermon.audio_url &&
                              togglePlay(sermon.id, sermon.audio_url)
                            }
                            className="bg-[#e94560] hover:bg-[#d43d4f] p-2 rounded-lg transition flex-shrink-0"
                          >
                            {isPlayingAudio[sermon.id] ? (
                              <Pause size={18} />
                            ) : (
                              <Play size={18} />
                            )}
                          </button>

                          {/* Progress Bar */}
                          <div className="flex-1">
                            <input
                              type="range"
                              min="0"
                              max={duration[sermon.id] || 0}
                              value={currentTime[sermon.id] || 0}
                              onChange={(e) =>
                                handleProgressChange(sermon.id, e)
                              }
                              className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #e94560 0%, #e94560 ${
                                  ((currentTime[sermon.id] || 0) /
                                    (duration[sermon.id] || 1)) *
                                  100
                                }%, rgba(255,255,255,0.3) ${
                                  ((currentTime[sermon.id] || 0) /
                                    (duration[sermon.id] || 1)) *
                                  100
                                }%, rgba(255,255,255,0.3) 100%)`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Time Display */}
                        <div className="flex justify-between text-xs text-gray-200">
                          <span>{formatTime(currentTime[sermon.id] || 0)}</span>
                          <span>{formatTime(duration[sermon.id] || 0)}</span>
                        </div>
                      </div>
                    ) : (
                      // Button State
                      <div className="flex justify-between gap-2">
                        <button
                          onClick={() =>
                            sermon.audio_url &&
                            togglePlay(sermon.id, sermon.audio_url)
                          }
                          disabled={!sermon.audio_url}
                          className={`flex items-center gap-2 px-6 py-2 rounded-lg transition whitespace-nowrap ${
                            !sermon.audio_url
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-[#e94560] hover:bg-[#d43d4f] text-white'
                          }`}
                        >
                          <Headphones size={16} />
                          Listen
                        </button>
                        <a
                          href={sermon.video_url || '#'}
                          target={sermon.video_url ? '_blank' : undefined}
                          rel={
                            sermon.video_url ? 'noopener noreferrer' : undefined
                          }
                          onClick={(e) =>
                            !sermon.video_url && e.preventDefault()
                          }
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
                    )}
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
