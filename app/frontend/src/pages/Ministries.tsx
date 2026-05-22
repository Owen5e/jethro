import { motion } from 'framer-motion';
import { BookOpen, Heart, Music, Users } from 'lucide-react';
import ministryhero from '../assets/ministry-hero.png';
import workerspicnic from '../assets/workerspicnic.png';

export default function Ministries() {
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

  const ministries = [
    {
      icon: Music,
      title: 'Worship Ministry',
      description:
        'Experience powerful worship through music, singing, and prayer. Our worship team leads us in glorifying God.',
    },
    {
      icon: Users,
      title: 'Small Groups',
      description:
        'Join a community of believers for prayer, study, and fellowship. Small groups meet weekly in homes and the church.',
    },
    {
      icon: BookOpen,
      title: 'Bible Study',
      description:
        'Deepen your understanding of Gods Word through in-depth Bible study and teaching programs.',
    },
    {
      icon: Heart,
      title: 'Community Service',
      description:
        'Serve those in need through various community outreach programs and volunteer opportunities.',
    },
    {
      icon: Users,
      title: 'Youth Ministry',
      description:
        'Mentoring and activities for young people to grow spiritually and build friendships.',
    },
    {
      icon: Heart,
      title: 'Counseling',
      description:
        'Compassionate counseling services offering support for life challenges and spiritual guidance.',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-cover bg-[center_10%]  bg-no-repeat text-white py-16 md:h-70 md:pt-10 relative "
        style={{ backgroundImage: `url(${ministryhero})` }}
      >
        {/* Right-side Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-4xl md:text-5xl font-bold">Our Ministries</h1>
          <p className="text-lg text-gray-200 mt-4">
            Ways to serve, grow, and connect in our faith community
          </p>
        </div>
      </motion.section>

      {/* Ministries Grid */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((ministry, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-[#f8f9fa] p-8 rounded-lg hover:shadow-lg transition"
              >
                <ministry.icon size={40} className="text-[#e94560] mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-[#1a1a2e]">
                  {ministry.title}
                </h3>
                <p className="text-gray-600">{ministry.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Community Image Section */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-[#f8f9fa]"
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            className="relative h-96 rounded-lg overflow-hidden shadow-xl mb-8"
          >
            <img
              src={workerspicnic}
              alt="Church community fellowship"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">
              A Welcoming Community
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Jethro Liberation Ministries Intl is built on the foundation of
              authentic relationships and genuine community. We believe that God
              designed us for connection, and our ministries reflect this
              commitment. Join us and experience the warmth of a faith community
              that truly cares about one another.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
