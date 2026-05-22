import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import eventshero from '../assets/eventshero.png';
import { eventsApi } from '../lib/api';

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
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsApi.getAll();
        setEvents(data || []);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
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
        className="bg-cover bg-[center_50%]  bg-no-repeat py-16 md:py-24 relative 
         text-white"
        style={{ backgroundImage: `url(${eventshero})` }}
      >
        {/* Right-side Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-4xl md:text-5xl font-bold">Events</h1>
          <p className="text-lg text-gray-200 mt-4">
            Join us for worship, fellowship, and service
          </p>
        </div>
      </motion.section>

      {/* Events Grid */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="visible"
        className="py-16 md:py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center text-gray-500 py-12">
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">
                No upcoming events at this time. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: any) => (
                <EventCard
                  key={event.id}
                  event={event}
                  selectedEvent={selectedEvent}
                  setSelectedEvent={setSelectedEvent}
                  fadeInUp={fadeInUp}
                />
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}

interface EventCardProps {
  event: any;
  selectedEvent: string | null;
  setSelectedEvent: (id: string | null) => void;
  fadeInUp: any;
}

function EventCard({
  event,
  selectedEvent,
  setSelectedEvent,
  fadeInUp,
}: EventCardProps) {
  const dateTime = `${event.date}T${event.time || '00:00'}`;
  const timeRemaining = useCountdown(dateTime);

  return (
    <motion.div
      variants={fadeInUp}
      onClick={() =>
        setSelectedEvent(selectedEvent === event.id ? null : event.id)
      }
      className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
    >
      {event.image_url ? (
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-48 object-fill"
        />
      ) : (
        <div className="bg-[#0f3460] h-48"></div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">{event.title}</h3>
        <div className="space-y-1 text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#e94560]" />
            <span className="text-sm">
              {new Date(event.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[#e94560]" />
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#e94560]" />
            <span className="text-sm">{event.location}</span>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-[#f8f9fa] p-3 rounded-lg ">
          <p className="text-xs font-semibold text-[#1a1a2e] mb-2">
            Time until event:
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            <div className="bg-white p-0.5 rounded text-center">
              <div className="text-lg font-bold text-[#e94560]">
                {timeRemaining.days}
              </div>
              <div className="text-[10px] text-gray-600">Days</div>
            </div>
            <div className="bg-white p-1.5 rounded text-center">
              <div className="text-lg font-bold text-[#e94560]">
                {timeRemaining.hours}
              </div>
              <div className="text-[10px] text-gray-600">Hours</div>
            </div>
            <div className="bg-white p-1.5 rounded text-center">
              <div className="text-lg font-bold text-[#e94560]">
                {timeRemaining.minutes}
              </div>
              <div className="text-[10px] text-gray-600">Mins</div>
            </div>
            <div className="bg-white p-1.5 rounded text-center">
              <div className="text-lg font-bold text-[#e94560]">
                {timeRemaining.seconds}
              </div>
              <div className="text-[10px] text-gray-600">Secs</div>
            </div>
          </div>
        </div>

        {selectedEvent === event.id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 pt-3 border-t"
          >
            <p className="text-sm text-gray-600">{event.description}</p>
            <button className="mt-3 bg-[#e94560] hover:bg-[#d43d4f] text-white px-3 py-1.5 text-sm rounded-lg transition w-full">
              Register
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
