import { motion } from 'framer-motion';
import { Heart, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    type: 'general',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      type: 'general',
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="text-lg text-gray-200 mt-4">
            We'd love to hear from you
          </p>
        </div>
      </motion.section>

      {/* Church Exterior Section */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            className="relative h-96 rounded-lg overflow-hidden shadow-xl"
          >
            <img
              src="/images/church-exterior.svg"
              alt="Jethro Liberation Ministries Intl building exterior"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Info and Form */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8">
                Get In Touch
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Phone
                    size={32}
                    className="text-[#e94560] flex-shrink-0 mt-1"
                  />
                  <div>
                    <h3 className="font-bold text-[#1a1a2e] mb-1">Phone</h3>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Mail
                    size={32}
                    className="text-[#e94560] flex-shrink-0 mt-1"
                  />
                  <div>
                    <h3 className="font-bold text-[#1a1a2e] mb-1">Email</h3>
                    <p className="text-gray-600">info@gracechurch.com</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MapPin
                    size={32}
                    className="text-[#e94560] flex-shrink-0 mt-1"
                  />
                  <div>
                    <h3 className="font-bold text-[#1a1a2e] mb-1">Address</h3>
                    <p className="text-gray-600">
                      123 Faith Street
                      <br />
                      Hope City, ST 12345
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">
                  Service Times
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Sunday:</strong> 10:00 AM & 5:00 PM
                  </p>
                  <p>
                    <strong>Wednesday:</strong> 7:00 PM
                  </p>
                  <p>
                    <strong>Prayer Hours:</strong> Tuesday - Friday, 6:00 AM -
                    6:00 PM
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeInUp}>
              <form
                onSubmit={handleSubmit}
                className="bg-[#f8f9fa] p-8 rounded-lg"
              >
                <div className="mb-6">
                  <label className="block text-[#1a1a2e] font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
                    placeholder="Your name"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-[#1a1a2e] font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
                    placeholder="Your email"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-[#1a1a2e] font-semibold mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
                    placeholder="Your phone number"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-[#1a1a2e] font-semibold mb-2">
                    Message Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="prayer">Prayer Request</option>
                    <option value="feedback">Feedback</option>
                    <option value="volunteer">Volunteer Interest</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-[#1a1a2e] font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
                    placeholder="Your message"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#e94560] hover:bg-[#d43d4f] text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Prayer Request Section */}
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
            Visit Us
          </motion.h2>
          <motion.div
            variants={fadeInUp}
            className="bg-[#f8f9fa] rounded-lg overflow-hidden shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Location Info */}
              <div>
                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                  Church Location
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-[#1a1a2e] mb-2">
                      Address:
                    </p>
                    <p className="text-gray-600">
                      Grace Church
                      <br />
                      123 Faith Street
                      <br />
                      Hope City, ST 12345
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a2e] mb-2">
                      Parking:
                    </p>
                    <p className="text-gray-600">
                      Free parking available in the main lot
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a2e] mb-2">
                      Accessibility:
                    </p>
                    <p className="text-gray-600">
                      Wheelchair accessible entrance and facilities
                    </p>
                  </div>
                </div>
              </div>

              {/* Embedded Map */}
              <motion.div
                variants={fadeInUp}
                className="rounded-lg overflow-hidden h-96 md:h-auto"
              >
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8386271484473!2d144.9613353!3d-37.8136276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf0100b8ab7270f0!2s123%20Pitt%20St%2C%20Sydney%20NSW%202000!5e0!3m2!1sen!2sau!4v1620000000000"
                  allowFullScreen
                  title="Jethro Liberation Ministries Intl Location"
                ></iframe>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Prayer Request Section */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-[#0f3460] text-white"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-6">
            Prayer Requests
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg mb-8 max-w-2xl mx-auto"
          >
            Need prayer? Submit a prayer request and our prayer team will hold
            you in their hearts and prayers.
          </motion.p>
          <motion.button
            variants={fadeInUp}
            className="inline-block bg-[#e94560] hover:bg-[#d43d4f] text-white px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2 mx-auto"
          >
            <Heart size={20} />
            Submit Prayer Request
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}
