import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import bookshero from '../assets/books-hero.png';
import { booksApi } from '../lib/api';

export default function Books() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await booksApi.getAll();
        setBooks(data || []);
      } catch (err) {
        console.error('Failed to fetch books:', err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
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

  return (
    <div className="w-full">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-cover bg-center  bg-no-repeat text-white py-16 md:h-70 md:pt-10 relative "
        style={{ backgroundImage: `url(${bookshero})` }}
      >
        {/* Right-side Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-4xl md:text-5xl font-bold">Books</h1>
          <p className="text-lg text-gray-200 mt-4">
            Explore our collection of faith-filled books and resources
          </p>
        </div>
      </motion.section>

      {/* Books Grid */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="visible"
        className="py-16 md:py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center text-gray-500 py-12">
              Loading books...
            </div>
          ) : books.length === 0 ? (
            <div className="text-center">
              <motion.div variants={fadeInUp}>
                <BookOpen size={64} className="text-[#e94560] mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4 font-serif">
                  Coming Soon
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  We are curating a collection of inspiring books and resources
                  to help you grow in your faith. Check back soon for updates!
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map((book: any) => (
                <motion.div
                  key={book.id}
                  variants={fadeInUp}
                  className="bg-[#f8f9fa] rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                >
                  {book.image_url ? (
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-[#0f3460] flex items-center justify-center">
                      <BookOpen size={48} className="text-white opacity-50" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">
                      {book.title}
                    </h3>
                    <p className="text-[#e94560] font-semibold mb-4">
                      {book.author}
                    </p>
                    <a
                      href={book.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#e94560] hover:bg-[#d43d4f] text-white px-4 py-2 rounded-lg transition"
                    >
                      <ExternalLink size={16} />
                      View Book
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
