import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(targetDate: string): TimeRemaining {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const gap = target - now;

      if (gap > 0) {
        setTimeRemaining({
          days: Math.floor(gap / (1000 * 60 * 60 * 24)),
          hours: Math.floor((gap / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((gap / 1000 / 60) % 60),
          seconds: Math.floor((gap / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeRemaining;
}

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

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

  const events = [
    {
      id: 1,
      title: 'Sunday Worship Service',
      date: '2026-06-12',
      time: '10:00 AM',
      location: 'Main Sanctuary',
      description:
        'Join us for our weekly worship service with music, teaching, and fellowship.',
      image: 'bg-[#0f3460]',
      dateTime: '2026-06-12T10:00:00',
    },
    {
      id: 2,
      title: 'Prayer Meeting',
      date: '2026-06-15',
      time: '7:00 PM',
      location: 'Prayer Room',
      description: 'Join our community in intercessory prayer and worship.',
      image: 'bg-[#16213e]',
      dateTime: '2026-06-15T19:00:00',
    },
    {
      id: 3,
      title: 'Community Outreach',
      date: '2026-06-18',
      time: '9:00 AM',
      location: 'City Park',
      description: 'Serve our community with food, fellowship, and care.',
      image: 'bg-[#e94560]',
      dateTime: '2026-06-18T09:00:00',
    },
    {
      id: 4,
      title: 'Youth Group Meeting',
      date: '2026-06-20',
      time: '6:30 PM',
      location: 'Youth Center',
      description: 'Games, teaching, and fellowship for young believers.',
      image: 'bg-[#d4a574]',
      dateTime: '2026-06-20T18:30:00',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-serif">Events</h1>
          <p className="text-lg text-gray-200 mt-4">
            Join us for worship, fellowship, and service
          </p>
        </div>
      </motion.section>

      {/* Events Grid */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => {
              const timeRemaining = useCountdown(event.dateTime);
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  selectedEvent={selectedEvent}
                  setSelectedEvent={setSelectedEvent}
                  timeRemaining={timeRemaining}
                  fadeInUp={fadeInUp}
                />
              );
            })}
          </div>
        </div>
      </motion.section>
    </div>
  );
}

interface EventCardProps {
  event: any;
  selectedEvent: number | null;
  setSelectedEvent: (id: number | null) => void;
  timeRemaining: TimeRemaining;
  fadeInUp: any;
}

function EventCard({
  event,
  selectedEvent,
  setSelectedEvent,
  timeRemaining,
  fadeInUp,
}: EventCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      onClick={() =>
        setSelectedEvent(selectedEvent === event.id ? null : event.id)
      }
      className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
    >
      <div className={`${event.image} h-40`}></div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">
          {event.title}
        </h3>
        <div className="space-y-2 text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#e94560]" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#e94560]" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-[#e94560]" />
            <span>{event.location}</span>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-[#f8f9fa] p-4 rounded-lg mb-4">
          <p className="text-sm font-semibold text-[#1a1a2e] mb-3">
            Time until event:
          </p>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white p-2 rounded text-center">
              <div className="text-2xl font-bold text-[#e94560]">
                {timeRemaining.days}
              </div>
              <div className="text-xs text-gray-600">Days</div>
            </div>
            <div className="bg-white p-2 rounded text-center">
              <div className="text-2xl font-bold text-[#e94560]">
                {timeRemaining.hours}
              </div>
              <div className="text-xs text-gray-600">Hours</div>
            </div>
            <div className="bg-white p-2 rounded text-center">
              <div className="text-2xl font-bold text-[#e94560]">
                {timeRemaining.minutes}
              </div>
              <div className="text-xs text-gray-600">Mins</div>
            </div>
            <div className="bg-white p-2 rounded text-center">
              <div className="text-2xl font-bold text-[#e94560]">
                {timeRemaining.seconds}
              </div>
              <div className="text-xs text-gray-600">Secs</div>
            </div>
          </div>
        </div>

        {selectedEvent === event.id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 pt-4 border-t"
          >
            <p className="text-gray-600">{event.description}</p>
            <button className="mt-4 bg-[#e94560] hover:bg-[#d43d4f] text-white px-4 py-2 rounded-lg transition w-full">
              Register
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
