import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Church,
  Globe,
  Heart,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
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
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white py-20 md:py-32 relative overflow-hidden"
      >
        {/* Background image */}
        <div className="absolute inset-0 opacity-40">
          <img
            src="/images/hero-church-worship.svg"
            alt="Church worship service"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif">
              Welcome to Jethro Liberation Ministries Intl
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              A community of faith, hope, and love. Join us on a spiritual
              journey of growth and fellowship.
            </p>
            <div className="flex gap-4">
              <Link
                to="/about"
                className="bg-[#e94560] hover:bg-[#d43d4f] text-white px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2"
              >
                Learn More <ArrowRight size={20} />
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white hover:bg-white hover:text-[#1a1a2e] text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Pastor Welcome Section */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-gradient-to-r from-[#f8f9fa] to-[#ffffff]"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Pastor Image */}
            <motion.div
              variants={fadeInUp}
              className="relative h-96 md:h-full rounded-lg overflow-hidden shadow-xl"
            >
              <img
                src="/images/pastor-welcome.svg"
                alt="Pastor welcome portrait"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition rounded-lg"></div>
            </motion.div>

            {/* Welcome Message */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl font-bold mb-6 text-[#1a1a2e] font-serif">
                Welcome from Our Apostle
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                "Welcome to Jethro Liberation Ministries Intl! We're honored
                that you've taken the time to visit us. Whether this is your
                first time or you've been with us for years, we want you to know
                that you belong here."
              </p>
              <p className="text-lg text-gray-600 mb-6">
                "Our desire is to create a warm, welcoming community where
                everyone can experience God's love and grow in their faith. We
                believe in the power of genuine relationships, authentic
                worship, and serving our community with compassion and grace."
              </p>
              <p className="text-lg text-gray-600">
                "If you have any questions or would like to get more involved,
                please don't hesitate to reach out. We'd love to connect with
                you and help you on your spiritual journey."
              </p>
              <p className="text-lg font-semibold text-[#e94560] mt-6">
                - Apostle Emmanuel David Craig, Founder/General Overseer
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Why Join Us Section */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeInUp}
            className="text-4xl font-bold text-center mb-12 text-[#1a1a2e] font-serif"
          >
            Why Join Us?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Community',
                description: 'Connect with a welcoming community of believers',
              },
              {
                icon: Users,
                title: 'Growth',
                description:
                  'Develop spiritually through prayer, worship and learning',
              },
              {
                icon: BookOpen,
                title: 'Teaching',
                description:
                  'Receive inspiring biblical teachings and guidance',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-[#f8f9fa] p-8 rounded-lg hover:shadow-lg transition"
              >
                <item.icon size={40} className="text-[#e94560] mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-[#1a1a2e]">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Our Services */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-[#f8f9fa]"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeInUp}
            className="text-4xl font-bold text-center mb-12 text-[#1a1a2e] font-serif"
          >
            Our Services
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Church,
                title: 'Victory Service(every Sunday)',
                description:
                  'Join us for inspiring worship services featuring contemporary and traditional music',
                times: '08:00 AM - 10:30 AM',
              },
              {
                icon: BookOpen,
                title: 'Illumination Service(every Wednesday)',
                description:
                  'In-depth biblical teaching and study programs for all ages and levels',
                times: '06:00 PM - 08:00 PM',
              },
              {
                icon: Globe,
                title: 'Prayer Meeting(every Friday)',
                description:
                  'Powerful prayer gatherings focused on intercession, healing and spiritual breakthroughs',
                times: '06:00 PM - 07:00 PM',
              },
            ].map((service, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition"
              >
                <service.icon size={40} className="text-gray-600 mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-[#1a1a2e] font-serif">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <p className="text-sm font-semibold text-[#e94560]">
                  {service.times}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeInUp}
            className="text-4xl font-bold text-center mb-12 font-serif"
          >
            Testimonies of Faith
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Jennifer Martinez',
                role: 'Church Member',
                quote:
                  'Jethro Liberation Ministries Intl changed my life. The community and support I found here is truly special.',
              },
              {
                name: 'Michael Thompson',
                role: 'Small Group Leader',
                quote:
                  "My faith deepened through the teachings and relationships I've built at Jethro Liberation Ministries Intl.",
              },
              {
                name: 'Sarah Williams',
                role: 'Volunteer',
                quote:
                  'Serving here has shown me the true meaning of ministry and unconditional love.',
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-[#0f3460] p-8 rounded-lg border-l-4 border-[#d4a574]"
              >
                <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-[#d4a574]">{testimonial.name}</p>
                  <p className="text-gray-300 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Ministries Preview */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeInUp}
            className="text-4xl font-bold text-center mb-12 text-[#1a1a2e] font-serif"
          >
            Our Ministries
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {[
              {
                title: 'Youth Ministry',
                description: 'Mentoring and community for young believers',
                Date: 'Every last Thursday of the month',
              },
              {
                title: 'Triumphant Women Ministry',
                description:
                  'Empowering women to thrive in faith, leadership, and service',
                Date: 'Every first Thursday of the month',
              },
              {
                title: 'Counseling ',
                description:
                  'Compassionate support for life challenges and spiritual growth',
                Date: 'Every Tuesday 4:00 PM - 6:00 PM',
              },
            ].map((ministry, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-[#f8f9fa] p-8 rounded-lg hover:shadow-lg transition border-l-4 border-[#e94560]"
              >
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">
                  {ministry.title}
                </h3>
                <p className="text-gray-600">{ministry.description}</p>
                <p className="text-[#e94560] font-semibold mt-3">
                  {ministry.Date}
                </p>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeInUp} className="text-center">
            <Link
              to="/ministries"
              className="inline-block bg-[#e94560] hover:bg-[#d43d4f] text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Explore All Ministries
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Sermons Preview */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-[#f8f9fa]"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeInUp}
            className="text-4xl font-bold text-center mb-12 text-[#1a1a2e] font-serif"
          >
            Latest Sermons
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {[
              {
                title: 'Faith in the Storm',
                speaker: 'Pastor John Smith',
                description: "How to maintain faith during life's challenges",
              },
              {
                title: 'Love Never Fails',
                speaker: 'Pastor Sarah Johnson',
                description:
                  "Understanding the power of God's love in our lives",
              },
            ].map((sermon, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">
                  {sermon.title}
                </h3>
                <p className="text-[#e94560] font-semibold mb-3 text-sm">
                  {sermon.speaker}
                </p>
                <p className="text-gray-600">{sermon.description}</p>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeInUp} className="text-center">
            <Link
              to="/sermons"
              className="inline-block bg-[#e94560] hover:bg-[#d43d4f] text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Listen to All Sermons
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Upcoming Events Preview */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeInUp}
            className="text-4xl font-bold text-center mb-12 text-[#1a1a2e] font-serif"
          >
            Upcoming Events
          </motion.h2>
          <motion.div variants={fadeInUp} className="text-center">
            <Link
              to="/events"
              className="inline-block bg-[#e94560] hover:bg-[#d43d4f] text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              View All Events
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Giving Section */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-[#0f3460] text-white"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            variants={fadeInUp}
            className="text-4xl font-bold mb-6 font-serif"
          >
            Support Our Mission
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg mb-8 max-w-2xl mx-auto"
          >
            Your generosity helps us continue our ministry and serve our
            community.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link
              to="/giving"
              className="inline-block bg-[#e94560] hover:bg-[#d43d4f] text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Make a Donation
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
