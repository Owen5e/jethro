import { motion } from 'framer-motion';
import { BookOpen, Heart, Target, Users } from 'lucide-react';
import facecardone from '../assets/facecardone.png';
import facecardtwo from '../assets/facecardtwo.jpeg';
import heroimage from '../assets/hero-image.png';

export default function About() {
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
        className="bg-cover  bg-no-repeat text-white py-16 md:h-70 md:pt-10 relative"
        style={{
          backgroundImage: `url(${heroimage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Right-side Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent backdrop-blur-[2px]"></div>
        <div className="container px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold">
            About Jethro Liberation Ministries Intl
          </h1>
        </div>
      </motion.section>

      {/* History */}
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
            className="text-4xl font-bold mb-6 text-[#1a1a2e]"
          >
            Our History
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-gray-600 max-w-3xl"
          >
            Jethro Liberation Ministry was founded by Apostle Emmanuel David
            Craig in September 2022 through divine instruction and revelation
            from God. The vision began during a crusade in Onosa, Lagos, in May
            2022, where the Lord spoke concerning the birth of a new ministry.
            Through prayers, visions, and spiritual counsel, the mandate of the
            ministry became clearer, including its name, vision, and mission.
            The ministry first started as an online prayer platform before
            growing into a physical fellowship with a small group of believers.
            On September 11, 2022, the church officially held its first service
            in a small classroom with 6 adults and 2 children in attendance.
            Since then, God has continued to increase and strengthen the
            ministry, making it a place of prayer, liberation, and spiritual
            transformation.
          </motion.p>
        </div>
      </motion.section>

      {/* Vision & Mission */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-[#f8f9fa]"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-3 mb-4">
                <Target size={32} className="text-[#e94560]" />
                <h3 className="text-3xl font-bold text-[#1a1a2e]">
                  Our Mission
                </h3>
              </div>
              <p className="text-gray-600 text-lg capitalize">
                Taking Jesus to the dying world through the media and other
                forms of radical evangelism.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-3 mb-4">
                <Heart size={32} className="text-[#e94560]" />
                <h3 className="text-3xl font-bold text-[#1a1a2e]">
                  Our Vision
                </h3>
              </div>
              <p className="text-gray-600 text-lg capitalize">
                Raising generations of soldiers that will bring purity,
                deliverance, excellence and prosperity to the body Christ and
                the society
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Core Values */}
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
            className="text-4xl font-bold text-center mb-12 text-[#1a1a2e]"
          >
            Our Core Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Biblical Truth',
                description:
                  'We are committed to teaching and living by the truth of Gods Word',
              },
              {
                icon: Users,
                title: 'Community',
                description:
                  'We believe in the power of fellowship and supporting one another',
              },
              {
                icon: Heart,
                title: 'Love',
                description:
                  'Gods love is the foundation of everything we do and say',
              },
              {
                icon: Target,
                title: 'Service',
                description:
                  'We serve our community with humility and dedication',
              },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-[#f8f9fa] p-8 rounded-lg"
              >
                <value.icon size={40} className="text-[#e94560] mb-4" />
                <h4 className="text-2xl font-bold mb-3 text-[#1a1a2e]">
                  {value.title}
                </h4>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Leadership */}
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
            Our Leadership
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                image: facecardone,
                name: 'Apostle Emmanuel David Craig',
                role: 'Founder/General Overseer',
                bio: 'With over 10 years of ministry experience, Apostle Craig leads our congregation with passion and wisdom.',
              },
              {
                image: facecardtwo,
                name: 'Pastor Sarah Craig',
                role: 'Associate Pastor',
                bio: 'Pastor Sarah oversees our community outreach and discipleship programs with dedication and grace.',
              },
            ].map((leader, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white p-8 rounded-lg shadow"
              >
                <div className="w-24 h-24 bg-[#e94560] rounded-full mx-auto mb-4">
                  <img
                    src={leader.image}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-2xl font-bold text-center mb-2 text-[#1a1a2e]">
                  {leader.name}
                </h3>
                <p className="text-[#e94560] font-semibold text-center mb-4">
                  {leader.role}
                </p>
                <p className="text-gray-600 text-center">{leader.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
