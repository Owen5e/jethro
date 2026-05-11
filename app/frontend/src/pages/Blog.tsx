import { motion } from 'framer-motion';
import { Calendar, Newspaper } from 'lucide-react';
import { useEffect, useState } from 'react';
import { blogApi } from '../lib/api';

export default function Blog() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [articleDetail, setArticleDetail] = useState<any>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await blogApi.getAll();
        setArticles(data || []);
      } catch (err) {
        console.error('Failed to fetch blog articles:', err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleSelectArticle = async (id: string) => {
    if (selectedArticle === id) {
      setSelectedArticle(null);
      setArticleDetail(null);
      return;
    }
    setSelectedArticle(id);
    try {
      const detail = await blogApi.getById(id);
      setArticleDetail(detail);
    } catch (err) {
      console.error('Failed to fetch article detail:', err);
      setArticleDetail(null);
    }
  };

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
          <h1 className="text-4xl md:text-5xl font-bold font-serif">Blog</h1>
          <p className="text-lg text-gray-200 mt-4">
            Insights, devotionals, and updates from our ministry
          </p>
        </div>
      </motion.section>

      {/* Blog Grid */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="visible"
        className="py-16 md:py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center text-gray-500 py-12">
              Loading articles...
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center">
              <motion.div variants={fadeInUp}>
                <Newspaper size={64} className="text-[#e94560] mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4 font-serif">
                  Coming Soon
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  We are working on bringing you inspiring blog posts,
                  devotionals, and ministry updates. Stay tuned!
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article: any) => (
                <motion.div
                  key={article.id}
                  variants={fadeInUp}
                  onClick={() => handleSelectArticle(article.id)}
                  className="bg-[#f8f9fa] rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
                >
                  {article.header_image ? (
                    <img
                      src={article.header_image}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-[#0f3460] flex items-center justify-center">
                      <Newspaper size={48} className="text-white opacity-50" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar size={14} />
                      <span>
                        {new Date(article.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Article Detail Modal */}
          {selectedArticle && articleDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => {
                setSelectedArticle(null);
                setArticleDetail(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {articleDetail.header_image && (
                  <img
                    src={articleDetail.header_image}
                    alt={articleDetail.title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">
                    {articleDetail.title}
                  </h2>
                  <p className="text-gray-500 text-sm mb-4">
                    {new Date(articleDetail.created_at).toLocaleDateString()}
                  </p>
                  {articleDetail.description && (
                    <p className="text-gray-700 mb-6 whitespace-pre-wrap">
                      {articleDetail.description}
                    </p>
                  )}

                  {/* Additional Images */}
                  {Array.isArray(articleDetail.images) &&
                    articleDetail.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {articleDetail.images.map(
                          (imgUrl: string, i: number) => (
                            <img
                              key={i}
                              src={imgUrl}
                              alt={`${articleDetail.title} image ${i + 1}`}
                              className="w-full h-40 object-cover rounded"
                            />
                          ),
                        )}
                      </div>
                    )}

                  {/* Audio */}
                  {articleDetail.audio_url && (
                    <div className="mb-4">
                      <audio
                        controls
                        className="w-full"
                        src={articleDetail.audio_url}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  {/* Video */}
                  {articleDetail.video_url && (
                    <div className="mb-4">
                      <a
                        href={articleDetail.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#e94560] hover:bg-[#d43d4f] text-white px-4 py-2 rounded-lg inline-block transition"
                      >
                        Watch Video
                      </a>
                    </div>
                  )}

                  {/* Testimonies */}
                  {Array.isArray(articleDetail.testimonies) &&
                    articleDetail.testimonies.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">
                          Testimonies
                        </h3>
                        <div className="space-y-3">
                          {articleDetail.testimonies.map(
                            (testimony: string, i: number) => (
                              <div
                                key={i}
                                className="bg-[#f8f9fa] p-4 rounded-lg border-l-4 border-[#e94560]"
                              >
                                <p className="text-gray-700 italic">
                                  "{testimony}"
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  <button
                    onClick={() => {
                      setSelectedArticle(null);
                      setArticleDetail(null);
                    }}
                    className="mt-6 bg-[#e94560] hover:bg-[#d43d4f] text-white px-6 py-2 rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
